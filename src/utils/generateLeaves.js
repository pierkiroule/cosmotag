import { POETIC_CYCLES, poeticEdges, poeticNodes } from './poeticGraph';

const INFUSION_NOTES = [
  'solaire',
  'nocturne',
  'florale',
  'minérale',
  'aquatique',
  'boisée',
  'gourmande',
];

const INFUSION_TEXTURES = [
  'spirale',
  'halo',
  'battement',
  'sillage',
  'respiration',
  'poussière',
  'filigrane',
];

const INFUSION_ELEMENTS = ['air', 'feu', 'eau', 'terre', 'éther'];

const CYCLE_LABELS = {
  night: 'nuit profonde',
  dawn: 'aurore',
  morning: 'matin cristallin',
  day: 'zénith',
  twilight: 'crépuscule',
};

const CYCLE_DESCRIPTIONS = {
  night: 'la lenteur des constellations',
  dawn: "la bruine irisée de l'aube",
  morning: 'le souffle clair du matin',
  day: 'la réverbération solaire',
  twilight: 'la lueur suspendue du soir',
};

const hashString = (value) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
  }
  return hash >>> 0;
};

const mulberry32 = (seed) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pickFrom = (random, collection) =>
  collection[Math.floor(random() * collection.length) % collection.length];

const buildDailyNode = (random, node, index) => {
  const pulse = 0.45 + random() * 0.5 + (index % 3) * 0.03;
  const infusionNote = pickFrom(random, INFUSION_NOTES);
  const infusionTexture = pickFrom(random, INFUSION_TEXTURES);
  const element = pickFrom(random, INFUSION_ELEMENTS);

  return {
    ...node,
    dailyPulse: Number(pulse.toFixed(3)),
    infusionNote,
    infusionTexture,
    element,
    resonanceLabel: `${infusionNote} ${infusionTexture}`,
    signature: `${node.cluster} · ${element}`,
  };
};

export const determineCycle = (date = new Date()) => {
  const hours = date.getHours();

  if (hours >= 5 && hours < 8) {
    return 'dawn';
  }
  if (hours >= 8 && hours < 12) {
    return 'morning';
  }
  if (hours >= 12 && hours < 18) {
    return 'day';
  }
  if (hours >= 18 && hours < 22) {
    return 'twilight';
  }
  return 'night';
};

export const getCycleMetadata = (cycle) => ({
  label: CYCLE_LABELS[cycle] ?? CYCLE_LABELS.night,
  description: CYCLE_DESCRIPTIONS[cycle] ?? CYCLE_DESCRIPTIONS.night,
});

export const generateTodaysLeaves = (dateSeed) => {
  const seed = hashString(dateSeed ?? new Date().toISOString().slice(0, 10));
  const random = mulberry32(seed);

  const nodes = poeticNodes.map((node, index) => buildDailyNode(random, node, index));

  return {
    nodes,
    edges: poeticEdges,
    cycles: POETIC_CYCLES,
  };
};
