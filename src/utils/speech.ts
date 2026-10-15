import { VoiceCommand } from '../types';

export interface SpeechWordBoundary {
  charIndex: number;
  charLength?: number;
  name?: string;
  elapsedTime?: number;
}

class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isSpeaking = false;
  private isPaused = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  // Announces text aloud for Audio-First mode
  public announce(text: string, rate = 1.0, voiceURI?: string | null) {
    if (!this.synth || !text) return;
    try {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.min(2.0, Math.max(0.5, rate));
      if (voiceURI) {
        const voice = this.getVoices().find((v) => v.voiceURI === voiceURI);
        if (voice) utterance.voice = voice;
      }
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech announce error:', e);
    }
  }

  // Speaks document text with word boundary callback
  public speakWithWordTracking({
    text,
    rate = 1.0,
    pitch = 1.0,
    voiceURI,
    onBoundary,
    onStart,
    onEnd,
    onError,
  }: {
    text: string;
    rate?: number;
    pitch?: number;
    voiceURI?: string | null;
    onBoundary?: (boundary: SpeechWordBoundary) => void;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }) {
    if (!this.synth) {
      onError?.(new Error('Speech synthesis is not supported on this device/browser.'));
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.min(2.0, Math.max(0.5, rate));
    utterance.pitch = Math.min(1.5, Math.max(0.8, pitch));

    if (voiceURI) {
      const voice = this.getVoices().find((v) => v.voiceURI === voiceURI);
      if (voice) utterance.voice = voice;
    }

    utterance.onboundary = (event) => {
      onBoundary?.({
        charIndex: event.charIndex,
        charLength: (event as any).charLength || 0,
        name: event.name,
        elapsedTime: event.elapsedTime,
      });
    };

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      onError?.(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
    }
  }

  public getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
    };
  }
}

export const speechService = new SpeechManager();

// Voice Recognition Manager (Web Speech API)
export class VoiceRecognitionService {
  private recognition: any = null;
  private isListening = false;
  private onCommandCallback: ((cmd: VoiceCommand, raw: string) => void) | null = null;
  private onTranscriptCallback: ((transcript: string) => void) | null = null;
  private onErrorCallback: ((errorMsg: string) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionConstructor =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript.toLowerCase().trim();
            if (event.results[i].isFinal) {
              this.processCommand(transcript);
            } else {
              interimTranscript += transcript;
            }
          }
          if (interimTranscript && this.onTranscriptCallback) {
            this.onTranscriptCallback(interimTranscript);
          }
        };

        this.recognition.onerror = (event: any) => {
          if (event.error === 'no-speech' || event.error === 'aborted') {
            return;
          }
          if (event.error === 'not-allowed') {
            this.onErrorCallback?.(
              'Microphone access denied. Please allow microphone permissions in your browser.'
            );
          } else {
            this.onErrorCallback?.(`Voice recognition error: ${event.error}`);
          }
        };

        this.recognition.onend = () => {
          // If still intended to listen, restart gracefully
          if (this.isListening) {
            try {
              this.recognition.start();
            } catch {
              this.isListening = false;
            }
          }
        };
      }
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public start({
    onCommand,
    onTranscript,
    onError,
  }: {
    onCommand: (cmd: VoiceCommand, raw: string) => void;
    onTranscript: (transcript: string) => void;
    onError: (errorMsg: string) => void;
  }) {
    if (!this.isSupported()) {
      onError('Voice commands are not supported in this browser. Chrome or Edge are recommended.');
      return;
    }

    this.onCommandCallback = onCommand;
    this.onTranscriptCallback = onTranscript;
    this.onErrorCallback = onError;

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (e: any) {
      if (e.name !== 'InvalidStateError') {
        onError(e.message || 'Could not start voice recognition.');
      }
    }
  }

  public stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Recognition already stopped
      }
    }
  }

  private processCommand(text: string) {
    if (this.onTranscriptCallback) {
      this.onTranscriptCallback(text);
    }

    const t = text.toLowerCase().trim();

    let matched: VoiceCommand | null = null;

    if (t.includes('bigger') || t.includes('larger text') || t.includes('increase text') || t.includes('zoom in')) {
      matched = 'bigger text';
    } else if (t.includes('smaller') || t.includes('decrease text') || t.includes('zoom out')) {
      matched = 'smaller text';
    } else if (t.includes('high contrast') || t.includes('contrast')) {
      matched = 'high contrast';
    } else if (t.includes('simplify') || t.includes('make easy') || t.includes('chunk')) {
      matched = 'simplify';
    } else if (t.includes('pause') || t.includes('stop')) {
      matched = 'pause';
    } else if (t.includes('previous') || t.includes('back')) {
      matched = 'previous';
    } else if (t.includes('next') || t.includes('forward')) {
      matched = 'next';
    } else if (t.includes('read') || t.includes('play') || t.includes('speak')) {
      matched = 'read';
    }

    if (matched && this.onCommandCallback) {
      this.onCommandCallback(matched, text);
    }
  }
}

export const voiceRecognitionService = new VoiceRecognitionService();
