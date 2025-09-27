import { useCallback, useEffect, useMemo } from 'react';
import TagGraph, { resetGraph, saveGraph } from './components/TagNetwork';
import { loadFromStorage, saveToStorage } from './utils/storage';

const STORAGE_KEY = 'hypnotea-tag-graph';

function App() {
  const storageApi = useMemo(
    () => ({
      load: () => loadFromStorage(STORAGE_KEY),
      save: (value) => saveToStorage(STORAGE_KEY, value),
    }),
    [],
  );

  const handleSave = useCallback(() => {
    saveGraph(storageApi);
  }, [storageApi]);

  const handleReset = useCallback(() => {
    resetGraph(storageApi);
  }, [storageApi]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isSaveShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';

      if (!isSaveShortcut) {
        return;
      }

      event.preventDefault();
      handleSave();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSave]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-800 text-slate-100">
      <header className="border-b border-slate-800/60 bg-slate-800/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6 px-6 py-10">
          <div className="max-w-xl space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-300/60">Atelier Hypnotique</p>
            <h1 className="text-4xl font-semibold text-sky-100 md:text-5xl">HypnoTea</h1>
            <p className="text-sm text-slate-300/80 md:text-base">
              Naviguez entre les constellations de tags, sauvegardez vos explorations et repartez d&apos;une page cosmique vierge
              quand vous le souhaitez.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-slate-700/70 px-6 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-sky-500/90 px-6 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400"
            >
              Save
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-stretch justify-center px-4 pb-8 pt-6">
        <div className="relative h-full w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-800/70 shadow-[0_30px_90px_rgba(15,23,42,0.45)]">
          <TagGraph storage={storageApi} />
        </div>
      </main>
    </div>
  );
}

export default App;
