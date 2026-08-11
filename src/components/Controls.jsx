export default function Controls({ n, k, trueProb, isPlaying, onDraw, onTogglePlay, onReset, onNChange, onKChange, onTrueProbChange }) {
  return (
    <section className="controls card-panel">
      <div className="control-heading"><div><span className="formula-label">RUN THE EXPERIMENT</span><h2>Set the world, then draw.</h2></div><div className="live-status"><i className={isPlaying ? 'pulse active' : 'pulse'} />{isPlaying ? 'Auto-play running' : 'Ready'}</div></div>
      <div className="row g-4 align-items-end">
        <div className="col-12 col-lg-4"><label htmlFor="truth">Hidden true probability <output>{trueProb.toFixed(2)}</output></label><input id="truth" className="form-range gold-range" type="range" min="0" max="1" step="0.01" value={trueProb} onChange={(event) => onTrueProbChange(event.target.value)} /><small>This decides every randomly drawn ticket.</small></div>
        <div className="col-6 col-lg-2"><label htmlFor="draws">Draws <output>{n}</output></label><input id="draws" className="form-range" type="range" min="0" max="50" value={n} onChange={(event) => onNChange(event.target.value)} /></div>
        <div className="col-6 col-lg-2"><label htmlFor="wins">Winners <output>{k}</output></label><input id="wins" className="form-range" type="range" min="0" max={n} value={k} disabled={n === 0} onChange={(event) => onKChange(event.target.value)} /></div>
        <div className="col-12 col-lg-4 button-row"><button className="btn draw-btn" onClick={onDraw}>Draw ticket</button><button className="btn outline-btn" onClick={onTogglePlay}>{isPlaying ? 'Pause' : 'Auto-play'}</button><button className="btn reset-btn" onClick={onReset}>Reset</button></div>
      </div>
      <div className="stat-strip"><div><span>Draws</span><strong>{n}</strong></div><div><span>Winning tickets</span><strong>{k}</strong></div><div><span>Laplace forecast</span><strong>{((k + 1) / (n + 2)).toFixed(2)}</strong></div></div>
    </section>
  )
}
