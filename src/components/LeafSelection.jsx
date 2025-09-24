import InfusionButton from './InfusionButton';

const LeafSelection = ({ selectedLeaves, onInfuse, canInfuse, hint }) => {
  const slots = Array.from({ length: 3 }, (_, index) => selectedLeaves[index]);
  const progress = Math.min((selectedLeaves.length / 3) * 100, 100);

  return (
    <div className="selection-panel absolute bottom-10 left-1/2 z-20 w-[min(92vw,34rem)] -translate-x-1/2 rounded-3xl px-6 py-6 md:px-8 md:py-7">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center text-center">
          <span className="text-[0.65rem] uppercase tracking-[0.4em] text-teal-200/70">Votre cueillette</span>
          <p className="mt-2 max-w-xl text-xs text-slate-200/80 md:text-sm" aria-live="polite">
            {hint}
          </p>
        </div>

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

        <div className="flex flex-col items-center justify-between gap-3 pt-2 text-[0.7rem] uppercase tracking-[0.32em] text-slate-300/70 md:flex-row">
          <span>3 feuilles pour une infusion hypnagogique</span>
          <InfusionButton onClick={onInfuse} disabled={!canInfuse} />
        </div>
      </div>
    </div>
  );
};

export default LeafSelection;
