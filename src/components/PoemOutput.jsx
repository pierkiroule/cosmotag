const PoemOutput = ({ poem, onClose }) => {
  if (!poem) return null;

  const handleCardClick = (event) => {
    event.stopPropagation();
  };

  const metadata = [
    { label: 'Accords', value: poem.aromaTrail?.join(' • ') ?? '' },
    { label: 'Constellations', value: poem.clusters?.join(' • ') ?? '' },
    { label: 'Textures', value: poem.textures?.join(' • ') ?? '' },
  ].filter((item) => item.value);

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" aria-hidden="true" />
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

        <h2 className="poem-title">{poem.title}</h2>
        {poem.subtitle && <p className="poem-subtitle">{poem.subtitle}</p>}

        {metadata.length > 0 && (
          <div className="poem-metadata">
            {metadata.map((item) => (
              <div key={item.label} className="poem-metadata__item">
                <span>{item.label}</span>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="poem-lines">
          {poem.lines.map((line, index) => (
            <p key={`${line}-${index}`} className="poem-line">
              {line}
            </p>
          ))}
        </div>

        {poem.transitions?.length > 0 && (
          <div className="poem-footnotes">
            <span className="poem-footnotes__title">Fil aromatique</span>
            <ul>
              {poem.transitions.map((transition, index) => (
                <li key={`${transition.from}-${transition.to}-${index}`}>
                  <strong>{transition.from}</strong>
                  <span aria-hidden="true"> → </span>
                  <strong>{transition.to}</strong>
                  <span className="poem-footnotes__detail">{transition.transition}</span>
                  <span className="poem-footnotes__aroma">{transition.aroma}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

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
