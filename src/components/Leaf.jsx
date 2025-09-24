const Leaf = ({ leaf, onClick, style }) => {
  return (
    <button
      onClick={() => onClick(leaf)}
      className="absolute bg-green-500/30 backdrop-blur-sm border border-green-500/50 text-white font-serif p-4 rounded-full hover:bg-green-400/50 transition-all duration-300"
      style={style}
    >
      {leaf.word}
    </button>
  );
};

export default Leaf;