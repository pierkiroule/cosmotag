import { useEffect, useMemo, useState } from 'react';
import { loadFromStorage, saveToStorage } from './utils/storage';
import {
  determineCycle,
  generateTodaysLeaves,
  getCycleMetadata,
} from './utils/generateLeaves';
import TreeCanvas from './components/TreeCanvas';
import Leaf from './components/Leaf';
import LeafSelection from './components/LeafSelection';
import PoemOutput from './components/PoemOutput';

const colorPalettes = [
  {
    gradient:
      'linear-gradient(135deg, rgba(56, 189, 248, 0.75) 0%, rgba(37, 99, 235, 0.65) 48%, rgba(79, 70, 229, 0.6) 100%)',
    glow: '0 0 32px rgba(37, 99, 235, 0.45)',
  },
  {
    gradient:
      'linear-gradient(150deg, rgba(96, 165, 250, 0.7) 0%, rgba(59, 130, 246, 0.6) 50%, rgba(129, 140, 248, 0.55) 100%)',
    glow: '0 0 30px rgba(96, 165, 250, 0.45)',
  },
  {
    gradient:
      'linear-gradient(140deg, rgba(59, 130, 246, 0.65) 0%, rgba(56, 189, 248, 0.55) 42%, rgba(165, 180, 252, 0.55) 100%)',
    glow: '0 0 30px rgba(165, 180, 252, 0.4)',
  },
  {
    gradient:
      'linear-gradient(160deg, rgba(30, 64, 175, 0.7) 0%, rgba(37, 99, 235, 0.6) 40%, rgba(14, 165, 233, 0.55) 100%)',
    glow: '0 0 28px rgba(59, 130, 246, 0.45)',
  },
  {
    gradient:
      'linear-gradient(145deg, rgba(129, 140, 248, 0.6) 0%, rgba(79, 70, 229, 0.6) 52%, rgba(59, 130, 246, 0.55) 100%)',
    glow: '0 0 28px rgba(129, 140, 248, 0.45)',
  },
];

const getRandomPalette = () =>
  colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

const lowercaseFirst = (value) => {
  if (!value) return '';
  return value.charAt(0).toLocaleLowerCase('fr-FR') + value.slice(1);
};

const toOrdinal = (value) => {
  if (value === 1) return '1ʳᵉ';
  if (value === 2) return '2ᵉ';
  if (value === 3) return '3ᵉ';
  return `${value}ᵉ`;
};

const createLeafVisual = () => {
  const palette = getRandomPalette();
  const scale = (0.85 + Math.random() * 0.7).toFixed(3);
  const rotation = (Math.random() * 40 - 20).toFixed(2);
  const floatDuration = 14 + Math.random() * 8;
  const floatDelay = -(Math.random() * 6);
  const floatX = `${(Math.random() * 8 - 4).toFixed(2)}%`;
  const floatY = `${(Math.random() * 6 - 3).toFixed(2)}%`;
  const floatSway = `${(Math.random() * 8 - 4).toFixed(2)}%`;
  const floatRise = `${(14 + Math.random() * 20).toFixed(2)}px`;
  const floatTilt = `${((Math.random() * 4 + 1.5) * (Math.random() > 0.5 ? 1 : -1)).toFixed(2)}deg`;
  const haloDelay = Math.random() * 6;
  const opacity = 0.65 + Math.random() * 0.3;
  const zIndex = 5 + Math.floor(Math.random() * 12);

  return {
    palette,
    scale,
    rotation,
    floatDuration,
    floatDelay,
    floatX,
    floatY,
    floatSway,
    floatRise,
    floatTilt,
    haloDelay,
    opacity,
    zIndex,
  };
};

const calculateAvailability = (graph, selection, infusionLength, cycle) => {
  const availableIds = new Set();
  const highlightedIds = new Set();
  const suggestions = [];
  const nodeLookup = new Map(graph.nodes.map((node) => [node.id, node]));
  const takenIds = new Set(selection.map((leaf) => leaf.id));
  const expectedMeter = selection.length % 2 === 0 ? 5 : 7;

  if (!graph.nodes.length || selection.length >= infusionLength) {
    return { availableIds, highlightedIds, suggestions, expectedMeter };
  }

  if (selection.length === 0) {
    const entryNodes = graph.nodes.filter((node) => node.entry);
    entryNodes.forEach((node) => {
      if (!takenIds.has(node.id)) {
        availableIds.add(node.id);
      }
    });

    entryNodes
      .slice()
      .sort((a, b) => (b.dailyPulse ?? 0) - (a.dailyPulse ?? 0))
      .slice(0, 3)
      .forEach((node) => {
        highlightedIds.add(node.id);
        suggestions.push(node);
      });

    return { availableIds, highlightedIds, suggestions, expectedMeter };
  }

  const lastLeaf = selection[selection.length - 1];
  const edges = graph.edges[lastLeaf.id] ?? [];

  const annotated = edges
    .map((edge) => {
      const target = nodeLookup.get(edge.target);
      if (!target || takenIds.has(target.id)) {
        return null;
      }

      const cycleBonus = edge.cycles?.includes(cycle) ? 0.12 : 0;
      const meterBonus = target.meter === expectedMeter ? 0.08 : 0;
      const pulseBonus = (target.dailyPulse ?? 0) * 0.2;
      const weight = (edge.weight ?? 0.5) + cycleBonus + meterBonus + pulseBonus;

      return { target, weight };
    })
    .filter(Boolean)
    .sort((a, b) => b.weight - a.weight);

  annotated.forEach(({ target }) => {
    availableIds.add(target.id);
  });

  annotated.slice(0, 3).forEach(({ target }) => {
    highlightedIds.add(target.id);
    suggestions.push(target);
  });

  return { availableIds, highlightedIds, suggestions, expectedMeter };
};

const composePoem = (path, infusionLength, cycleMetadata, edges) => {
  const unique = (collection) => Array.from(new Set(collection.filter(Boolean)));
  const lines = path.map((leaf) => leaf.fragment);
  const aromas = unique(path.map((leaf) => leaf.aroma));
  const clusters = unique(path.map((leaf) => leaf.cluster));
  const textures = unique(path.flatMap((leaf) => leaf.textures ?? []));
  const transitions = path.slice(1).map((leaf, index) => {
    const from = path[index];
    const edge = (edges[from.id] ?? []).find((item) => item.target === leaf.id);
    return {
      from: from.fragment,
      to: leaf.fragment,
      transition: edge?.transition ?? 'Résonance libre',
      aroma: edge?.aroma ?? leaf.infusionNote,
    };
  });

  return {
    title: `Infusion ${infusionLength} strophes`,
    subtitle: `${cycleMetadata.label} — ${cycleMetadata.description}`,
    aromaTrail: aromas,
    clusters,
    textures,
    lines,
    transitions,
  };
};

const buildSelectionHint = ({
  count,
  infusionLength,
  cycleLabel,
  lastSelected,
  suggestions,
}) => {
  if (count === 0) {
    return `Choisissez la première strophe pour ouvrir l’infusion ${cycleLabel}.`;
  }

  if (count >= infusionLength) {
    return 'Infusez pour révéler la constellation complète.';
  }

  if (count === infusionLength - 1) {
    return `Scellez l’infusion ${cycleLabel} avec une dernière strophe.`;
  }

  const nextOrdinal = toOrdinal(count + 1);
  const suggestion = suggestions[0];
  const nextFragment = suggestion ? lowercaseFirst(suggestion.fragment) : null;
  const previousFragment = lowercaseFirst(lastSelected?.fragment ?? 'la strophe précédente');

  if (nextFragment) {
    return `Depuis ${previousFragment}, laissez ${nextFragment} guider la ${nextOrdinal} strophe.`;
  }

  return `Poursuivez le fil depuis ${previousFragment} vers la ${nextOrdinal} strophe.`;
};

function App() {
  const [poeticGraph, setPoeticGraph] = useState({ nodes: [], edges: {} });
  const [baseGraph, setBaseGraph] = useState(null);
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [poem, setPoem] = useState(null);
  const [showAura, setShowAura] = useState(false);
  const [sessionDate, setSessionDate] = useState('');
  const [infusionLength, setInfusionLength] = useState(5);
  const [dayCycle, setDayCycle] = useState(determineCycle(new Date()));

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const storedData = loadFromStorage('hypnotea-data');

    let graphData;
    let storedSelection = [];
    let storedInfusionLength = 5;

    if (storedData && storedData.date === today && storedData.graph) {
      graphData = storedData.graph;
      storedSelection = storedData.selection ?? [];
      storedInfusionLength = storedData.infusionLength ?? 5;
    } else {
      graphData = generateTodaysLeaves(today);
      saveToStorage('hypnotea-data', {
        date: today,
        graph: graphData,
        selection: [],
        infusionLength: storedInfusionLength,
      });
    }

    setSessionDate(today);
    setBaseGraph(graphData);
    setInfusionLength(storedInfusionLength);

    const nodesWithPresentation = graphData.nodes.map((leaf) => ({
      ...leaf,
      layout: {
        top: `${12 + Math.random() * 60}%`,
        left: `${8 + Math.random() * 80}%`,
      },
      visual: createLeafVisual(),
    }));

    const nodeMap = new Map(nodesWithPresentation.map((node) => [node.id, node]));

    setPoeticGraph({
      nodes: nodesWithPresentation,
      edges: graphData.edges,
    });

    setSelectedLeaves(storedSelection.map((id) => nodeMap.get(id)).filter(Boolean));

    const auraTimeout = setTimeout(() => {
      setShowAura(true);
    }, 400);

    return () => {
      clearTimeout(auraTimeout);
    };
  }, []);

  useEffect(() => {
    const updateCycle = () => {
      setDayCycle(determineCycle(new Date()));
    };

    const interval = setInterval(updateCycle, 1000 * 60 * 5);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!baseGraph || !sessionDate) return;

    saveToStorage('hypnotea-data', {
      date: sessionDate,
      graph: baseGraph,
      selection: selectedLeaves.map((leaf) => leaf.id),
      infusionLength,
    });
  }, [selectedLeaves, infusionLength, baseGraph, sessionDate]);

  const availability = useMemo(
    () => calculateAvailability(poeticGraph, selectedLeaves, infusionLength, dayCycle),
    [poeticGraph, selectedLeaves, infusionLength, dayCycle],
  );

  const cycleMetadata = useMemo(() => getCycleMetadata(dayCycle), [dayCycle]);

  const handleInfusionLengthChange = (length) => {
    setInfusionLength(length);
    setSelectedLeaves((previous) => previous.slice(0, length));
  };

  const handleLeafClick = (leaf) => {
    setSelectedLeaves((previous) => {
      const existingIndex = previous.findIndex((item) => item.id === leaf.id);

      if (existingIndex !== -1) {
        return previous.slice(0, existingIndex);
      }

      if (previous.length >= infusionLength) {
        return previous;
      }

      const nextAvailability = calculateAvailability(
        poeticGraph,
        previous,
        infusionLength,
        dayCycle,
      );

      if (!nextAvailability.availableIds.has(leaf.id)) {
        return previous;
      }

      return [...previous, leaf];
    });
  };

  const handleInfuseClick = () => {
    if (selectedLeaves.length !== infusionLength) return;

    const composition = composePoem(
      selectedLeaves,
      infusionLength,
      cycleMetadata,
      poeticGraph.edges,
    );

    setPoem(composition);
  };

  const handleClosePoem = () => {
    setPoem(null);
    setSelectedLeaves([]);
  };

  const handleResetSelection = () => {
    setSelectedLeaves([]);
  };

  const selectionHint = buildSelectionHint({
    count: selectedLeaves.length,
    infusionLength,
    cycleLabel: cycleMetadata.label,
    lastSelected: selectedLeaves[selectedLeaves.length - 1],
    suggestions: availability.suggestions,
  });

  const nextMeter =
    selectedLeaves.length < infusionLength ? availability.expectedMeter : null;

  const activeIds = new Set(selectedLeaves.map((leaf) => leaf.id));

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      <TreeCanvas showAura={showAura}>
        {poeticGraph.nodes.map((leaf) => (
          <Leaf
            key={leaf.id}
            leaf={leaf}
            onClick={handleLeafClick}
            isSelected={activeIds.has(leaf.id)}
            isAvailable={
              activeIds.has(leaf.id) || availability.availableIds.has(leaf.id)
            }
            isHighlighted={availability.highlightedIds.has(leaf.id)}
          />
        ))}
      </TreeCanvas>

      <header className="relative z-20 mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 pt-16 text-center">
        <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.5em] text-sky-200/70">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-sky-200/50 bg-sky-500/20 text-[0.6rem] text-sky-50 shadow-[0_0_20px_rgba(59,130,246,0.35)]">
            ✺
          </span>
          <span>Atelier Hypnotique</span>
        </div>
        <h1 className="bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-200 bg-clip-text text-4xl font-serif text-transparent drop-shadow-[0_10px_45px_rgba(30,64,175,0.35)] md:text-[3.6rem]">
          HypnoTea
        </h1>
        <p className="max-w-2xl text-sm text-slate-200/85 md:text-base">
          Chaque feuille capturée est une note dans votre infusion cosmique. Composez un parcours de 5 ou 7 strophes et laissez l&apos;aurore dévoiler votre poème.
        </p>
      </header>

      <LeafSelection
        selectedLeaves={selectedLeaves}
        onInfuse={handleInfuseClick}
        canInfuse={selectedLeaves.length === infusionLength}
        hint={selectionHint}
        infusionLength={infusionLength}
        onInfusionLengthChange={handleInfusionLengthChange}
        suggestions={availability.suggestions}
        dayCycleLabel={cycleMetadata.label}
        dayCycleDescription={cycleMetadata.description}
        onReset={handleResetSelection}
        nextMeter={nextMeter}
      />

      <PoemOutput poem={poem} onClose={handleClosePoem} />
    </div>
  );
}

export default App;
