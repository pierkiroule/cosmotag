import { useEffect, useMemo, useState } from 'react';
import { syncGraphControls } from './TagNetworkControls';

const TagGraph = ({ storage }) => {
  const initialState = useMemo(() => storage?.load?.() ?? null, [storage]);
  const [graphState, setGraphState] = useState(initialState);

  useEffect(() => {
    syncGraphControls({
      getState: () => graphState,
      resetState: () => setGraphState(storage?.load?.() ?? null),
    });

    return () => {
      syncGraphControls({
        getState: () => null,
        resetState: () => {},
      });
    };
  }, [graphState, storage]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-800/60 text-sm text-slate-300">
      <div className="space-y-2 text-center">
        <p className="font-medium text-slate-100/80">Tag Graph en préparation</p>
        <p className="text-xs text-slate-400">
          L&apos;interface réseau sera bientôt interactive. En attendant, vos sauvegardes et remises à zéro sont prêtes.
        </p>
      </div>
    </div>
  );
};

export default TagGraph;
