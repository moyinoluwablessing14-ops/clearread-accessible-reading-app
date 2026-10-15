export interface SampleTextItem {
  id: string;
  title: string;
  category: string;
  sourcePreview: string;
  fullText: string;
}

export const SAMPLE_TEXTS: SampleTextItem[] = [
  {
    id: 'photosynthesis',
    title: 'How Plants Make Food (Photosynthesis)',
    category: 'Science & Nature',
    sourcePreview: 'Photosynthesis is the biochemical process by which photoautotrophic organisms synthesize organic compounds...',
    fullText: `Photosynthesis is the fundamental biochemical process by which photoautotrophic organisms—primarily green plants, algae, and cyanobacteria—synthesize high-energy organic compounds, predominantly glucose, from atmospheric carbon dioxide and water. This endothermic transformation is catalyzed by solar electromagnetic radiation absorbed by specialized chlorophyll pigments housed inside cellular organelles designated as chloroplasts.

During the light-dependent phase, photon capture initiates photolysis of H2O molecules within the thylakoid membranes, yielding molecular oxygen (O2) as an atmospheric byproduct alongside reducing agents ATP and NADPH. Subsequently, during the light-independent Calvin cycle within the stroma, ribulose-1,5-bisphosphate carboxylase-oxygenase (RuBisCO) mediates the fixation of carbon dioxide, eventually polymerizing triose phosphates into starches and sugars essential for metabolic respiration and biological biomass accumulation across terrestrial trophic cascades.`,
  },
  {
    id: 'ancient-egypt',
    title: 'The Great Pyramids of Giza',
    category: 'History & Culture',
    sourcePreview: 'Erected along the plateau of the western bank of the Nile during the fourth dynasty of the Old Kingdom...',
    fullText: `Erected along the arid limestone plateau bordering the western bank of the Nile River during the fourth dynasty of Egypt's Old Kingdom (c. 2580–2560 BCE), the Great Pyramid of Giza constitutes monumental funerary architecture commissioned by Pharaoh Khufu. Comprising an estimated 2.3 million megalithic limestone and granite blocks, the structure originally ascended to approximately 146.6 meters under an exterior casing of polished Tura limestone.

Historical archaeological scholarship has repudiated earlier misconceptions of enslaved labor, demonstrating instead that the workforce comprised tens of thousands of skilled artisans, stonemasons, and seasonal agrarian conscripts supported by rigorous bureaucratic rationing and state-sponsored communal barracks. The precise celestial alignment with true geographic north demonstrates advanced empiricism in stellar observation and astronomical surveying prior to the advent of contemporary geospatial instrumentation.`,
  },
  {
    id: 'ocean-depths',
    title: 'Life in the Deep Ocean Trenches',
    category: 'Marine Biology',
    sourcePreview: 'The abyssal and hadal zones of oceanic basins represent some of the most extreme thermodynamic environments...',
    fullText: `The abyssal and hadal zones of oceanic basins represent some of the most extreme thermodynamic environments on Earth, characterized by ambient temperatures hovering barely above freezing, hydrostatic pressures exceeding one thousand atmospheres, and complete absence of photosynthetic solar penetration. Despite these formidable physiological impediments, diverse biological communities flourish around hydrothermal vent ecosystems fueled by chemoautotrophic sulfur-oxidizing bacteria.

Endemic organisms exhibit specialized biochemical adaptations, including flexible unsaturated phospholipid cell membranes and elevated intracellular concentrations of trimethylamine N-oxide (TMAO) that counteract pressure-induced protein denaturation. Bioluminescence serves critical functions for predation, intraspecific signaling, and optical counterillumination camouflage in this vast perpetual abyss.`,
  },
];
