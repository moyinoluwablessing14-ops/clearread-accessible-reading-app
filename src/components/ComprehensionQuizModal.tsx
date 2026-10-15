import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Award, ArrowRight, RotateCcw, X, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { QuizQuestion, QuizResult } from '../types';
import { speechService } from '../utils/speech';

interface ComprehensionQuizModalProps {
  isOpen: boolean;
  documentTitle: string;
  keyPoints: string[];
  chunksSnippet: string;
  onClose: () => void;
  onQuizCompleted: (result: QuizResult) => void;
}

export const ComprehensionQuizModal: React.FC<ComprehensionQuizModalProps> = ({
  isOpen,
  documentTitle,
  keyPoints,
  chunksSnippet,
  onClose,
  onQuizCompleted,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Sanitize title to never display 'Reading Document (Accessible Mode)'
  const displayTitle =
    documentTitle &&
    !documentTitle.toLowerCase().includes('accessible mode') &&
    !documentTitle.toLowerCase().startsWith('reading document')
      ? documentTitle
      : 'Reading Passage';

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    setIsFinished(false);

    fetch('/api/comprehension-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: displayTitle,
        keyPoints: keyPoints,
        textSnippet: chunksSnippet,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!isMounted) return;
        if (res.success && Array.isArray(res.questions) && res.questions.length > 0) {
          setQuestions(res.questions.slice(0, 3));
        } else {
          throw new Error('Fallback needed');
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setQuestions([
          {
            id: 'q1',
            question: `Which key detail about "${displayTitle}" is true?`,
            options: [
              'It follows natural processes described in the text',
              'It is completely unrelated to nature or science',
              'It occurs only under artificial laboratory conditions',
              'It was established without any real-world causes',
            ],
            correctIndex: 0,
            explanation: `The reading describes real processes and mechanisms of ${displayTitle}.`,
          },
          {
            id: 'q2',
            question: `How or why does the primary activity in "${displayTitle}" take place?`,
            options: [
              'Through continuous cycles and energy exchanges',
              'By shutting down all natural interactions',
              'Without any physical or chemical changes',
              'Exclusively through human intervention',
            ],
            correctIndex: 0,
            explanation: 'The text explains how energy exchanges drive the whole sequence.',
          },
          {
            id: 'q3',
            question: `What can the reader reasonably infer from "${displayTitle}"?`,
            options: [
              'Observing cycles helps us understand changing environments',
              'Natural systems have no impact on living things',
              'Every mystery on this topic has been answered',
              'Changes in one part never affect other parts',
            ],
            correctIndex: 0,
            explanation: 'Understanding foundational cycles helps us care for our environment.',
          },
        ]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, displayTitle, keyPoints, chunksSnippet]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const userChoice = selectedAnswers[currentIndex];
  const isAnswered = userChoice !== undefined;
  const isCorrect = isAnswered && userChoice === currentQ?.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (showFeedback) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: idx }));
    setShowFeedback(true);

    if (idx === currentQ.correctIndex) {
      speechService.announce('Correct! ' + currentQ.explanation);
    } else {
      speechService.announce('Not quite. ' + currentQ.explanation);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowFeedback(false);
    } else {
      // Calculate final score
      let score = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          score += 1;
        }
      });
      const result: QuizResult = {
        id: 'quiz-' + Date.now(),
        documentTitle,
        score,
        total: questions.length,
        date: new Date().toISOString(),
      };
      setIsFinished(true);
      onQuizCompleted(result);
      speechService.announce(`Comprehension check complete. You scored ${score} out of ${questions.length}.`);
    }
  };

  const calculateFinalScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) score += 1;
    });
    return score;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-lexend"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 id="quiz-modal-title" className="text-base font-bold text-stone-900">
                Comprehension Check
              </h2>
              <p className="text-xs text-stone-500 truncate max-w-xs">{displayTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 flex items-center justify-center transition-colors"
            aria-label="Close quiz"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
              <p className="text-sm font-semibold text-stone-700">
                Generating 3 comprehension questions with AI...
              </p>
              <p className="text-xs text-stone-500">Checking against your key takeaways</p>
            </div>
          ) : isFinished ? (
            /* Results Screen */
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-inner">
                <Award className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-stone-900">Great Reading!</h3>
                <p className="text-stone-600 text-sm mt-1">
                  You scored <span className="font-bold text-teal-800">{calculateFinalScore()}</span> out of{' '}
                  <span className="font-bold">{questions.length}</span>
                </p>
              </div>

              <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-200 text-xs text-teal-900 text-left space-y-1">
                <p className="font-bold">Score saved to Progress</p>
                <p className="text-teal-800">
                  Your reading session and accuracy score have been updated in your weekly chart and Family dashboard.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 px-5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-sm shadow-md transition-all"
              >
                Back to Reading
              </button>
            </div>
          ) : currentQ ? (
            /* Question flow */
            <div className="space-y-5">
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono">
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </span>
              </div>

              {/* Question text */}
              <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt: string, oIdx: number) => {
                  const isThisSelected = userChoice === oIdx;
                  const isThisCorrect = oIdx === currentQ.correctIndex;

                  let btnStyle = 'border-stone-200 bg-white hover:border-stone-300 text-stone-800';
                  if (showFeedback) {
                    if (isThisCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20';
                    } else if (isThisSelected && !isThisCorrect) {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400/20';
                    } else {
                      btnStyle = 'border-stone-100 bg-stone-50/50 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={showFeedback}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full p-3.5 rounded-xl border-2 text-left font-medium text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                      {showFeedback && isThisCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {showFeedback && isThisSelected && !isThisCorrect && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Feedback Explanation */}
              {showFeedback && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed animate-in fade-in duration-150 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    {isCorrect ? 'Correct!' : 'Good try!'}
                  </p>
                  <p>{currentQ.explanation}</p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {!isLoading && !isFinished && showFeedback && (
          <div className="px-6 py-4 bg-stone-50/80 border-t border-stone-200 flex justify-end">
            <button
              type="button"
              onClick={handleNextQuestion}
              className="py-2.5 px-5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Score'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
