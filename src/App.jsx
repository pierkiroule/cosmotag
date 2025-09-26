import { useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from './utils/storage';
import { generateTodaysLeaves } from './utils/generateLeaves';
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

function App() {
  const [todaysLeaves, setTodaysLeaves] = useState([]);
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [poem, setPoem] = useState('');
  const [showAura, setShowAura] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const storedData = loadFromStorage('hypnotea-data');

    let leavesToUse;
    if (storedData && storedData.date === today) {
      leavesToUse = storedData.leaves;
    } else {
      leavesToUse = generateTodaysLeaves();
      saveToStorage('hypnotea-data', { date: today, leaves: leavesToUse });
    }

    setTodaysLeaves(
      leavesToUse.map((leaf) => ({
        ...leaf,
        layout: {
          top: `${12 + Math.random() * 60}%`,
          left: `${8 + Math.random() * 80}%`,
        },
        visual: createLeafVisual(),
      })),
    );

    const auraTimeout = setTimeout(() => {
      setShowAura(true);
    }, 400);

    return () => {
      clearTimeout(auraTimeout);
    };
  }, []);

  const handleLeafClick = (leaf) => {
    setSelectedLeaves((previous) => {
      const alreadySelected = previous.some((item) => item.id === leaf.id);
      if (alreadySelected) {
        return previous.filter((item) => item.id !== leaf.id);
      }

      if (previous.length >= 3) {
        return previous;
      }

      return [...previous, leaf];
    });
  };

  const handleInfuseClick = () => {
    if (selectedLeaves.length < 3) return;

    const [first, second, third] = selectedLeaves.map((leaf) => leaf.word);
    const poemText = [
      `Dans le halo de ${first},`,
      `une ${second} murmure sa ${third}.`,
      '',
      "Des constellations infusent l'aube,",
      'et les songes se laissent boire.',
    ].join('\n');

    setPoem(poemText);
  };

  const handleClosePoem = () => {
    setPoem('');
    setSelectedLeaves([]);
  };

  const selectionHint = [
    'Repérez la première feuille qui vous appelle.',
    'Laissez la deuxième feuille résonner avec la première.',
    "Scellez l'infusion avec une dernière étincelle.",
    'Prêtes ? Infusez votre constellation poétique.',
  ][selectedLeaves.length];

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      <TreeCanvas showAura={showAura}>
        {todaysLeaves.map((leaf) => (
          <Leaf
            key={leaf.id}
            leaf={leaf}
            onClick={handleLeafClick}
            isSelected={selectedLeaves.some((selected) => selected.id === leaf.id)}
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
          Chaque feuille capturée est une note dans votre infusion cosmique. Composez trois accords et laissez l&apos;aurore dévoiler votre poème.
        </p>
      </header>

      <LeafSelection
        selectedLeaves={selectedLeaves}
        onInfuse={handleInfuseClick}
        canInfuse={selectedLeaves.length === 3}
        hint={selectionHint}
      />

      <PoemOutput poem={poem} onClose={handleClosePoem} />
    </div>
  );
}

export default App;
