const Leaf = ({ leaf, onClick, isSelected, isAvailable = true, isHighlighted = false }) => {
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
    '--leaf-pulse': leaf.dailyPulse ?? 0.6,
  };

  const className = [
    'leaf-orb',
    isSelected ? 'is-selected' : '',
    !isAvailable && !isSelected ? 'is-unavailable' : '',
    isHighlighted ? 'is-highlighted' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      onClick={() => onClick(leaf)}
      aria-pressed={isSelected}
      aria-label={`Fragment ${leaf.fragment}`}
      className={className}
      style={style}
      disabled={!isAvailable && !isSelected}
      data-available={isAvailable}
      data-meter={leaf.meter}
    >
      <span className="leaf-orb__cluster" aria-hidden="true">
        {leaf.cluster}
      </span>
      <span className="leaf-orb__fragment">{leaf.fragment}</span>
      <span className="leaf-orb__meta" aria-hidden="true">
        <span>{`${leaf.meter} syllabes · ${leaf.element}`}</span>
        <span>{leaf.resonanceLabel}</span>
      </span>
      <span className="leaf-orb__pulse" aria-hidden="true" />
    </button>
  );
};

export default Leaf;
