const PoemOutput = ({ poem, onClose }) => {
  if (!poem) return null;

  const handleCardClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-xl" aria-hidden="true" />
      <div className="starfield" aria-hidden="true" />
      <div className="starfield starfield--slow" aria-hidden="true" />
      <div className="constellation-overlay" aria-hidden="true" />

      <div
        role="dialog"
        aria-live="polite"
        className="poem-card relative z-10 w-[min(92vw,34rem)] rounded-3xl px-8 py-10 text-center"
        onClick={handleCardClick}
      >
        <div className="absolute -top-14 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border border-sky-100/40 bg-gradient-to-br from-sky-400/30 via-blue-400/20 to-indigo-500/40 text-3xl text-sky-100 shadow-[0_0_35px_rgba(96,165,250,0.35)]">
          ✦
        </div>

        <div className="mt-6 whitespace-pre-wrap text-left font-serif text-lg leading-relaxed text-sky-100 drop-shadow-[0_4px_24px_rgba(15,23,42,0.65)]">
          {poem}
        </div>

        <p className="mt-8 text-[0.65rem] uppercase tracking-[0.5em] text-slate-200/70">
          Touchez la nuit ou fermez le sceau pour dissiper l'infusion
        </p>

        <button
          type="button"
          onClick={onClose}
          className="poem-close"
        >
          Refermer le sceau
        </button>
      </div>
    </div>
  );
};

export default PoemOutput;
