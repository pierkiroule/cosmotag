const TreeCanvas = ({ children }) => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Fond étoilé et arbre cosmique seront ajoutés ici */}
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default TreeCanvas;