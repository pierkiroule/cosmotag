const Leaf = ({ leaf, onClick, isSelected }) => {
  const { layout, visual } = leaf;

  const style = {
    top: layout.top,
    left: layout.left,
    zIndex: visual.zIndex,
    background: visual.palette.gradient,
    boxShadow: visual.palette.glow,
    opacity: visual.opacity,
    '--leaf-rotation': `${visual.rotation}deg`,
    '--leaf-scale': visual.scale,
    '--float-duration': `${visual.floatDuration}s`,
    '--float-delay': `${visual.floatDelay}s`,
    '--float-x': visual.floatX,
    '--float-y': visual.floatY,
    '--float-sway': visual.floatSway,
    '--float-rise': visual.floatRise,
    '--float-tilt': visual.floatTilt,
    '--halo-delay': `${visual.haloDelay}s`,
  };

  return (
    <button
      type="button"
      onClick={() => onClick(leaf)}
      aria-pressed={isSelected}
      aria-label={`Feuille ${leaf.word}`}
      className={`leaf-orb ${isSelected ? 'is-selected' : ''}`}
      style={style}
    >
      <span className="relative z-[1] block text-xs font-semibold tracking-[0.25em] drop-shadow-[0_2px_8px_rgba(8,47,73,0.65)]">
        {leaf.word}
      </span>
      <span className="leaf-orb__pulse" aria-hidden="true" />
    </button>
  );
};

export default Leaf;
