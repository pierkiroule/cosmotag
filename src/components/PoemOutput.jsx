const PoemOutput = ({ poem, onClose }) => {
  if (!poem) return null;

  return (
    <div
      className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center cursor-pointer"
      onClick={onClose}
    >
      <div className="w-full max-w-lg p-8 bg-slate-800/50 rounded-2xl backdrop-blur-lg">
        <p className="text-center text-xl text-teal-100 whitespace-pre-wrap font-serif leading-relaxed">
          {poem}
        </p>
        <p className="text-center text-xs text-gray-400 mt-6 animate-pulse">
          (Cliquez pour fermer)
        </p>
      </div>
    </div>
  );
};

export default PoemOutput;