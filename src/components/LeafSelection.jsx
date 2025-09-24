const LeafSelection = ({ selectedLeaves }) => {
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-black/30 rounded-xl backdrop-blur-sm">
      <h3 className="text-center text-teal-200 mb-2">Votre cueillette</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {selectedLeaves.length > 0 ? (
          selectedLeaves.map(leaf => (
            <div key={leaf.id} className="bg-teal-500/40 px-3 py-1 rounded-md">
              {leaf.word}
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">Cliquez sur les feuilles qui tombent...</p>
        )}
      </div>
    </div>
  );
};

export default LeafSelection;