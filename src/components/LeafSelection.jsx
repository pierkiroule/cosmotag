import InfusionButton from './InfusionButton';

const INFUSION_CHOICES = [5, 7];

const LeafSelection = ({
  selectedLeaves,
  onInfuse,
  canInfuse,
  hint,
  infusionLength,
  onInfusionLengthChange,
  suggestions = [],
  dayCycleLabel,
  dayCycleDescription,
  onReset,
  nextMeter,
}) => {
  const slots = Array.from({ length: infusionLength }, (_, index) => selectedLeaves[index]);
  const progress = Math.min((selectedLeaves.length / infusionLength) * 100, 100);
  const cadenceText = nextMeter ? `${nextMeter} syllabes attendues` : 'constellation prête';

  return (
    <div className="selection-panel absolute bottom-10 left-1/2 z-20 w-[min(92vw,38rem)] -translate-x-1/2 rounded-3xl px-6 py-6 md:px-8 md:py-7">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="selection-badge">Rituel — {dayCycleLabel}</span>
          <p className="selection-description">{dayCycleDescription}</p>

          <div
            className="length-toggle"
            role="group"
            aria-label="Durée de l'infusion"
          >
            {INFUSION_CHOICES.map((choice) => {
              const isActive = choice === infusionLength;
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => onInfusionLengthChange(choice)}
                  className={`length-toggle__option ${isActive ? 'is-active' : ''}`}
                  aria-pressed={isActive}
                >
                  {choice} strophes
                </button>
              );
            })}
          </div>

          <p className="selection-hint" aria-live="polite">
            {hint}
          </p>
        </div>

        <div className={`selection-grid ${infusionLength > 5 ? 'is-extended' : ''}`}>
          {slots.map((slot, index) => {
            const expected = index % 2 === 0 ? 5 : 7;
            return (
              <div
                key={`slot-${index}`}
                className={`selection-slot ${slot ? 'active' : ''}`}
              >
                <span className="selection-slot__index">Strophe {index + 1}</span>
                <span className="selection-slot__fragment">
                  {slot ? slot.fragment : 'En attente'}
                </span>
                <span className="selection-slot__meta">
                  {slot
                    ? `${slot.meter} syllabes · ${slot.cluster}`
                    : `${expected} syllabes pressenties`}
                </span>
              </div>
            );
          })}
        </div>

        {suggestions.length > 0 && (
          <div className="suggestion-strip" aria-live="polite">
            <span className="suggestion-strip__title">Transitions suggérées</span>
            <div className="suggestion-strip__list">
              {suggestions.slice(0, 3).map((item) => (
                <span key={item.id} className="suggestion-chip">
                  <strong>{item.fragment}</strong>
                  <small>{item.resonanceLabel}</small>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="relative mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="selection-progress" style={{ width: `${progress}%` }} />
        </div>

        <div className="selection-actions">
          <span className="selection-actions__meta">
            {infusionLength} strophes · {cadenceText}
          </span>
          <div className="selection-actions__buttons">
            <button
              type="button"
              onClick={onReset}
              className="selection-reset"
              disabled={selectedLeaves.length === 0}
            >
              Réinitialiser
            </button>
            <InfusionButton onClick={onInfuse} disabled={!canInfuse} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeafSelection;
