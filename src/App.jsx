import { useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from './utils/storage';
import { generateTodaysLeaves } from './utils/generateLeaves';
import TreeCanvas from './components/TreeCanvas';
import Leaf from './components/Leaf';
import LeafSelection from './components/LeafSelection';
import InfusionButton from './components/InfusionButton';
import PoemOutput from './components/PoemOutput';

function App() {
  const [todaysLeaves, setTodaysLeaves] = useState([]);
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [poem, setPoem] = useState('');

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
    // Ajout de positions aléatoires pour l'affichage
    setTodaysLeaves(leavesToUse.map(leaf => ({
      ...leaf,
      style: {
        top: `${Math.random() * 60 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
      }
    })));
  }, []);

  const handleLeafClick = (leaf) => {
    setSelectedLeaves(prev =>
      prev.find(l => l.id === leaf.id)
        ? prev.filter(l => l.id !== leaf.id) // Déselectionner
        : [...prev, leaf] // Sélectionner
    );
  };

  const handleInfuseClick = () => {
    const words = selectedLeaves.map(l => l.word);
    // Algorithme de génération de poème très simple pour commencer
    const poemText = `Dans le souffle de ${words[0]},\nune ${words[1]} abandonne sa ${words[2]}...\n\n... infusion d'ombre et de ciel.`;
    setPoem(poemText);
  };

  const handleClosePoem = () => {
    setPoem('');
    setSelectedLeaves([]);
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans overflow-hidden">
      <header className="absolute top-0 left-0 p-4 z-10">
        <h1 className="text-2xl font-bold">HypnoTea</h1>
      </header>

      <TreeCanvas>
        {todaysLeaves.map(leaf => (
          <Leaf
            key={leaf.id}
            leaf={leaf}
            onClick={handleLeafClick}
            style={leaf.style}
          />
        ))}
      </TreeCanvas>

      <LeafSelection selectedLeaves={selectedLeaves} />

      <InfusionButton
        onClick={handleInfuseClick}
        disabled={selectedLeaves.length < 3}
      />

      <PoemOutput poem={poem} onClose={handleClosePoem} />
    </div>
  )
}

export default App
