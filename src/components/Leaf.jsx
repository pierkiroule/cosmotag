const Leaf = ({ leaf, onClick, isSelected }) => {
  const { layout, visual } = leaf;
  const { profile } = visual;

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
    '--leaf-border-color': profile.border,
    '--leaf-vein-color': profile.vein,
    '--leaf-spark-color': profile.spark,
    '--leaf-vein-offset': visual.veinOffset,
    '--leaf-glint-delay': `${visual.glintDelay}s`,
  };

  return (
    <button
      type="button"
      onClick={() => onClick(leaf)}
      aria-pressed={isSelected}
      aria-label={`Feuille ${leaf.word}`}
      className={`leaf-orb leaf-orb--${profile.shape} ${isSelected ? 'is-selected' : ''}`}
      style={style}
    >
      <span className="leaf-orb__aura" aria-hidden="true" />
      <span className="leaf-orb__vein" aria-hidden="true" />
      <span className="leaf-orb__spark" aria-hidden="true" />
      <span className="leaf-orb__label">
        <span>{leaf.word}</span>
      </span>
      <span className="leaf-orb__pulse" aria-hidden="true" />
    </button>
  );
};

export default Leaf;
