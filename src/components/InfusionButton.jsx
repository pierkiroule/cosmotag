const InfusionButton = ({ onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`infusion-button inline-flex items-center gap-2 rounded-full border border-teal-200/40 bg-gradient-to-r from-teal-500/40 via-cyan-500/40 to-indigo-500/40 px-6 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.4em] text-teal-100 shadow-[0_0_25px_rgba(13,148,136,0.25)] transition-all duration-300 hover:shadow-[0_0_32px_rgba(165,243,252,0.45)] focus:outline-none focus:ring-2 focus:ring-teal-200/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:saturate-50`}
      data-active={!disabled}
    >
      <span className="text-base">✧</span>
      <span>Infuser</span>
    </button>
  );
};

export default InfusionButton;
