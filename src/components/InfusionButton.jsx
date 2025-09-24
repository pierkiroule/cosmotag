const InfusionButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute bottom-5 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full font-bold text-lg
                  bg-indigo-600 hover:bg-indigo-500 text-white
                  transition-all duration-300 transform hover:scale-105
                  disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100`}
    >
      Infuser
    </button>
  );
};

export default InfusionButton;