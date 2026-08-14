export default function Controls({
  n, k, trueProb, isPlaying, disabled, demoRunning,
  onDraw, onTogglePlay, onReset, onRunDemo, onNChange, onKChange, onTrueProbChange,
}) {
  const controlsDisabled = disabled || demoRunning

  return (
    <section className={`controls card-panel${disabled ? ' controls-locked' : ''}`} aria-label="Experiment controls">
      <div className="control-heading">
        <div><span className="formula-label">RUN THE EXPERIMENT</span><h2>Set the box, then draw.</h2></div>
        <div className="live-status"><i className={isPlaying || demoRunning ? 'pulse active' : 'pulse'} />{demoRunning ? 'Demo running' : isPlaying ? 'Auto-draw running' : disabled ? 'Draw the first ticket above' : 'Ready'}</div>
      </div>
      <div className="row g-4 align-items-end">
        <div className="col-12 col-lg-4">
          <label htmlFor="truth">The box’s actual winning chance <output>{Math.round(trueProb * 100)}%</output></label>
          <input id="truth" className="form-range gold-range" type="range" min="0" max="1" step="0.01" value={trueProb} disabled={controlsDisabled} onChange={(event) => onTrueProbChange(event.target.value)} />
          <small>Changing the box starts a fresh experiment.</small>
        </div>
        <div className="col-6 col-lg-2"><label htmlFor="draws">Draws <output>{n}</output></label><input id="draws" className="form-range" type="range" min="0" max="50" value={Math.min(n, 50)} disabled={controlsDisabled} onChange={(event) => onNChange(event.target.value)} /></div>
        <div className="col-6 col-lg-2"><label htmlFor="wins">Winners <output>{k}</output></label><input id="wins" className="form-range" type="range" min="0" max={n} value={k} disabled={controlsDisabled || n === 0} onChange={(event) => onKChange(event.target.value)} /></div>
        <div className="col-12 col-lg-4 button-row">
          <button className="btn draw-btn" disabled={controlsDisabled} onClick={onDraw}>Draw ticket</button>
          <button className="btn outline-btn" disabled={controlsDisabled} onClick={onTogglePlay}>{isPlaying ? 'Pause' : 'Auto-draw'}</button>
          <button className="btn demo-btn" disabled={disabled || demoRunning} onClick={onRunDemo}>{demoRunning ? 'Running…' : 'Run the demo'}</button>
          <button className="btn reset-btn" disabled={controlsDisabled} onClick={onReset}>Reset</button>
        </div>
      </div>
      <div className="stat-strip"><div><span>Draws</span><strong>{n}</strong></div><div><span>Winning tickets</span><strong>{k}</strong></div><div><span>Cautious forecast</span><strong>{Math.round(((k + 1) / (n + 2)) * 100)}%</strong></div></div>
    </section>
  )
}
