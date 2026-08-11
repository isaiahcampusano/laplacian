import { useCallback, useEffect, useState } from 'react'
import Controls from './components/Controls.jsx'
import BetaChart from './components/BetaChart.jsx'
import ConvergenceChart from './components/ConvergenceChart.jsx'
import ComparisonBar from './components/ComparisonBar.jsx'

const estimate = (wins, draws) => ({
  laplace: (wins + 1) / (draws + 2),
  naive: draws ? wins / draws : null,
})

const makeSyntheticHistory = (draws, wins, trueProb) => {
  if (!draws) return []
  return Array.from({ length: draws }, (_, index) => {
    const drawIndex = index + 1
    const runningWins = Math.min(wins, drawIndex)
    const estimates = estimate(runningWins, drawIndex)
    return { drawIndex, ...estimates, trueProb }
  })
}

export default function App() {
  const [experiment, setExperiment] = useState({ n: 0, k: 0, history: [] })
  const [trueProb, setTrueProb] = useState(0.4)
  const [isPlaying, setIsPlaying] = useState(false)
  const { n, k, history } = experiment
  const { laplace, naive } = estimate(k, n)

  const drawTicket = useCallback(() => {
    setExperiment((current) => {
      const won = Math.random() < trueProb
      const next = { n: current.n + 1, k: current.k + (won ? 1 : 0) }
      const nextEstimates = estimate(next.k, next.n)
      return {
        ...next,
        history: [...current.history, { drawIndex: next.n, ...nextEstimates, trueProb }],
      }
    })
  }, [trueProb])

  useEffect(() => {
    if (!isPlaying) return undefined
    const timer = window.setInterval(drawTicket, 800)
    return () => window.clearInterval(timer)
  }, [drawTicket, isPlaying])

  const updateScenario = (nextN, nextK) => {
    const safeN = Math.max(0, Number(nextN))
    const safeK = Math.min(safeN, Math.max(0, Number(nextK)))
    setExperiment({ n: safeN, k: safeK, history: makeSyntheticHistory(safeN, safeK, trueProb) })
  }

  const reset = () => {
    setIsPlaying(false)
    setExperiment({ n: 0, k: 0, history: [] })
  }

  const changeTrueProbability = (value) => {
    const nextProbability = Number(value)
    setTrueProb(nextProbability)
    setExperiment((current) => ({
      ...current,
      history: current.history.map((point) => ({ ...point, trueProb: nextProbability })),
    }))
  }

  const laplaceDistance = Math.abs(laplace - trueProb)
  const naiveDistance = naive === null ? null : Math.abs(naive - trueProb)
  const isLaplaceCloser = naiveDistance !== null && laplaceDistance < naiveDistance

  return (
    <main className="app-shell">
      <section className="hero container-xl">
        <p className="eyebrow">BAYESIAN INTUITION, ONE TICKET AT A TIME</p>
        <h1>Laplace’s Ticket Lab</h1>
        <p className="hero-copy">Can a handful of tickets tell you what happens next? Compare raw frequency with Laplace’s cautious rule of succession.</p>
      </section>

      <div className="container-xl pb-5">
        <Controls
          n={n} k={k} trueProb={trueProb} isPlaying={isPlaying}
          onDraw={drawTicket} onTogglePlay={() => setIsPlaying((playing) => !playing)}
          onReset={reset} onNChange={(value) => updateScenario(value, Math.min(k, value))}
          onKChange={(value) => updateScenario(n, value)} onTrueProbChange={changeTrueProbability}
        />

        <section className="explanation card-panel" aria-live="polite">
          <span className="formula-label">THE NEXT-TICKET FORECAST</span>
          <p>You have drawn <strong>{k}</strong> winner{k === 1 ? '' : 's'} out of <strong>{n}</strong> ticket{n === 1 ? '' : 's'}.</p>
          <p>Laplace adds one imagined win and one imagined loss: <span className="gold-formula">({k} + 1) / ({n} + 2) = {laplace.toFixed(2)}</span>.</p>
          <p className="naive-copy">{naive === null ? 'No draws yet — a raw-frequency estimate has nothing to say.' : <>Naive frequency would say <strong>{naive.toFixed(2)}</strong> ({k}/{n}).</>}</p>
        </section>

        <div className="row g-4 chart-grid">
          <div className="col-12 col-xl-7"><section className="card-panel chart-card"><h2>What probabilities remain plausible?</h2><p className="section-intro">The blue posterior begins flat, then concentrates as evidence arrives.</p><BetaChart n={n} k={k} trueProb={trueProb} laplace={laplace} naive={naive} /></section></div>
          <div className="col-12 col-xl-5"><section className="card-panel chart-card star-card"><span className="star-badge">KEY COMPARISON</span><h2>Who makes the safer call?</h2><ComparisonBar laplace={laplace} naive={naive} trueProb={trueProb} /><p className="annotation">{n === 0 ? 'Laplace starts at 0.50: it recognizes that no evidence is still evidence of uncertainty.' : isLaplaceCloser ? 'Laplace is more cautious — it pulls estimates toward 0.5 when data is scarce.' : 'More data will usually narrow the gap; with this sample, compare the bars before deciding.'}</p></section></div>
          <div className="col-12"><section className="card-panel chart-card"><h2>Watch the estimates learn</h2><p className="section-intro">Each point is the forecast after that draw. The red line is the hidden truth you chose.</p><ConvergenceChart history={history} trueProb={trueProb} /></section></div>
        </div>
      </div>

      <footer><span>Built to make a 200-year-old idea tangible.</span><a href="https://github.com/isaiahcampusano/laplacian" target="_blank" rel="noreferrer">Explore the project ↗</a><span>Laplace’s rule uses a uniform Beta(1, 1) prior.</span></footer>
    </main>
  )
}
