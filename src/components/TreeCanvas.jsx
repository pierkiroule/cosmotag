const TreeCanvas = ({ children, showAura }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="cosmic-gradient" aria-hidden="true" />
      <div className="starfield" aria-hidden="true" />
      <div className="starfield starfield--slow" aria-hidden="true" />
      <div className="cosmic-halo" aria-hidden="true" />
      <div className={`cosmic-tree ${showAura ? 'is-awakening' : ''}`} aria-hidden="true" />
      <div className={`cosmic-branches ${showAura ? 'is-visible' : ''}`} aria-hidden="true" />

      <div className="relative z-[1] h-full w-full">{children}</div>
    </div>
  );
};

export default TreeCanvas;
