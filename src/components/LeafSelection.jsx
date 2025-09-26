import InfusionButton from './InfusionButton';

const LeafSelection = ({ selectedLeaves, onInfuse, canInfuse, hint }) => {
  const slots = Array.from({ length: 3 }, (_, index) => selectedLeaves[index]);
  const progress = Math.min((selectedLeaves.length / 3) * 100, 100);

  return (
    <div className="selection-panel absolute bottom-10 left-1/2 z-20 w-[min(92vw,36rem)] -translate-x-1/2">
      <div className="selection-panel__halo" aria-hidden="true" />
      <div className="selection-panel__frame">
        <div className="selection-panel__glyph" aria-hidden="true">
          ☾
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center text-center gap-1.5">
            <span className="selection-panel__title">Votre cueillette</span>
            <p className="selection-panel__hint" aria-live="polite">
              {hint}
            </p>
          </div>

          <div className="selection-panel__constellation" aria-hidden="true" />

          <div className="grid gap-3 md:grid-cols-3">
            {slots.map((slot, index) => (
              <div
                key={index}
                className={`selection-slot ${slot ? 'active' : ''}`}
              >
                {slot ? <span>{slot.word}</span> : <span>Feuille {index + 1}</span>}
              </div>
            ))}
          </div>

          <div className="relative mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="selection-panel__footer">
            <span>3 feuilles pour une infusion hypnagogique</span>
            <InfusionButton onClick={onInfuse} disabled={!canInfuse} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeafSelection;
