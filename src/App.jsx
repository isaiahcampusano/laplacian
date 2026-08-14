import { useCallback, useEffect, useRef, useState } from 'react'
import Controls from './components/Controls.jsx'
import BetaChart from './components/BetaChart.jsx'
import ConvergenceChart from './components/ConvergenceChart.jsx'
import ComparisonBar from './components/ComparisonBar.jsx'
import { summarizeEvidence } from './lib/statistics.js'

const TAKEAWAY = 'When data is scarce, raw percentages can fool you. Start with a cautious 50/50 assumption and let evidence gradually outweigh it.'

const DEMO_SEQUENCE = [
  false, false, false, false, false,
  true, true, true, true, true,
  true, false, false, true, false, true, false, false, true, false,
]

const emptyExperiment = () => ({ n: 0, k: 0, history: [], lastOutcome: null })

const makeBalancedHistory = (draws, wins, trueProb) => {
  if (!draws) return []

  return Array.from({ length: draws }, (_, index) => {
    const drawIndex = index + 1
    const runningWins = Math.round((wins * drawIndex) / draws)
    return {
      drawIndex,
      wins: runningWins,
      ...summarizeEvidence(runningWins, drawIndex),
      trueProb,
    }
  })
}

const narrativeFor = (n, k, lastOutcome) => {
  if (n === 0) {
    return 'No tickets yet. Laplace begins at 50% because we have no evidence; raw frequency has no estimate at all.'
  }
  if (n === 1 && lastOutcome === 'win') {
    return 'One win makes the naive guess jump to 100%. Laplace says 67%, protecting you from betting everything on one lucky draw.'
  }
  if (n === 1 && lastOutcome === 'loss') {
    return 'One loss makes the naive guess fall to 0%. Laplace says 33%, because one loss cannot prove that winning is impossible.'
  }
  if (n <= 10) {
    return `With only ${n} draws, Laplace pulls extreme raw percentages back toward 50%. It listens to the data without pretending the sample is conclusive.`
  }
  if (n >= 50) {
    return 'With substantial evidence, the cautious and raw estimates are now close. The starting assumption matters less as real data accumulates.'
  }
  return 'The evidence is taking control. Notice how the gap between the cautious and raw estimates generally shrinks as the sample grows.'
}

export default function App() {
  const [experiment, setExperiment] = useState(emptyExperiment)
  const [trueProb, setTrueProb] = useState(0.4)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [demoRunning, setDemoRunning] = useState(false)
  const [showTakeaway, setShowTakeaway] = useState(false)
  const demoTimer = useRef(null)
  const { n, k, history, lastOutcome } = experiment
  const { laplace, naive, lower, upper } = summarizeEvidence(k, n)

  const addOutcome = useCallback((won, probability = trueProb) => {
    setExperiment((current) => {
      const nextN = current.n + 1
      const nextK = current.k + (won ? 1 : 0)
      const nextEstimates = summarizeEvidence(nextK, nextN)
      return {
        n: nextN,
        k: nextK,
        lastOutcome: won ? 'win' : 'loss',
        history: [...current.history, {
          drawIndex: nextN,
          wins: nextK,
          ...nextEstimates,
          trueProb: probability,
        }],
      }
    })
  }, [trueProb])

  const drawTicket = useCallback(() => {
    addOutcome(Math.random() < trueProb)
  }, [addOutcome, trueProb])

  useEffect(() => {
    if (!isPlaying || demoRunning) return undefined
    const timer = window.setInterval(drawTicket, 800)
    return () => window.clearInterval(timer)
  }, [demoRunning, drawTicket, isPlaying])

  useEffect(() => () => {
    if (demoTimer.current) window.clearInterval(demoTimer.current)
  }, [])

  const updateScenario = (nextN, nextK) => {
    const safeN = Math.max(0, Number(nextN))
    const safeK = Math.min(safeN, Math.max(0, Number(nextK)))
    setExperiment({
      n: safeN,
      k: safeK,
      history: makeBalancedHistory(safeN, safeK, trueProb),
      lastOutcome: null,
    })
  }

  const stopDemo = () => {
    if (demoTimer.current) window.clearInterval(demoTimer.current)
    demoTimer.current = null
    setDemoRunning(false)
  }

  const reset = () => {
    setIsPlaying(false)
    stopDemo()
    setExperiment(emptyExperiment())
    setShowIntro(true)
    setShowTakeaway(false)
  }

  const changeTrueProbability = (value) => {
    setIsPlaying(false)
    stopDemo()
    setTrueProb(Number(value))
    setExperiment(emptyExperiment())
    setShowIntro(true)
  }

  const drawFirstTicket = () => {
    setShowIntro(false)
    drawTicket()
  }

  const runDemo = () => {
    setIsPlaying(false)
    stopDemo()
    setShowIntro(false)
    setShowTakeaway(false)
    setTrueProb(0.4)
    setExperiment(emptyExperiment())
    setDemoRunning(true)

    let index = 0
    demoTimer.current = window.setInterval(() => {
      addOutcome(DEMO_SEQUENCE[index], 0.4)
      index += 1
      if (index === DEMO_SEQUENCE.length) {
        window.clearInterval(demoTimer.current)
        demoTimer.current = null
        setDemoRunning(false)
        setShowTakeaway(true)
      }
    }, 360)
  }

  const narrative = narrativeFor(n, k, lastOutcome)

  return (
    <main className="app-shell">
      <section className="hero container-xl">
        <p className="eyebrow">A SHIELD AGAINST SMALL-SAMPLE OVERCONFIDENCE</p>
        <h1>Laplace’s Rule: Why you shouldn’t trust small samples.</h1>
        <p className="hero-copy">Draw tickets from a mystery box and compare a raw percentage with a cautious forecast.</p>
        <p className="living-takeaway" aria-live="polite">{n === 0 ? TAKEAWAY : narrative}</p>
      </section>

      <div className="container-xl pb-5">
        {showIntro && (
          <section className="cold-open" role="dialog" aria-labelledby="cold-open-title" aria-modal="true">
            <span className="cold-open-count">0</span>
            <div>
              <p className="formula-label">BEFORE THE EVIDENCE</p>
              <h2 id="cold-open-title">You have drawn zero tickets.</h2>
              <p>You have no clue whether the box is full of winners or losers. Laplace begins at <strong>50%</strong>. Raw frequency is <strong>undefined</strong>. Which starting point is more honest?</p>
              <button className="btn draw-btn first-draw-btn" onClick={drawFirstTicket}>Draw first ticket</button>
            </div>
          </section>
        )}

        <Controls
          n={n} k={k} trueProb={trueProb} isPlaying={isPlaying}
          disabled={showIntro} demoRunning={demoRunning}
          onDraw={drawTicket} onTogglePlay={() => setIsPlaying((playing) => !playing)}
          onReset={reset} onRunDemo={runDemo}
          onNChange={(value) => updateScenario(value, Math.min(k, value))}
          onKChange={(value) => updateScenario(n, value)} onTrueProbChange={changeTrueProbability}
        />

        <section className="narrative card-panel" aria-live="polite">
          <span className="formula-label">WHAT THE NUMBERS ARE SAYING</span>
          <p className="narrative-lead">{narrative}</p>
          <div className="forecast-grid">
            <div><span>Laplace’s cautious guess</span><strong>{Math.round(laplace * 100)}%</strong></div>
            <div><span>Raw, overconfident guess</span><strong>{naive === null ? '—' : `${Math.round(naive * 100)}%`}</strong></div>
            <div><span>95% plausible range</span><strong>{Math.round(lower * 100)}–{Math.round(upper * 100)}%</strong></div>
          </div>
          <p className="formula-copy">Behind the scenes: ({k} + 1) ÷ ({n} + 2) = {laplace.toFixed(2)}. The extra imagined win and loss prevent tiny samples from producing absolute certainty.</p>
        </section>

        <div className="row g-4 chart-grid">
          <div className="col-12 col-xl-7"><section className="card-panel chart-card"><h2>What winning chances remain plausible?</h2><p className="section-intro">The blue curve shows what the evidence supports. The shaded band contains the middle 95% of plausible chances.</p><BetaChart n={n} k={k} trueProb={trueProb} laplace={laplace} naive={naive} lower={lower} upper={upper} /></section></div>
          <div className="col-12 col-xl-5"><section className="card-panel chart-card star-card"><span className="star-badge">RIGHT NOW</span><h2>Three different answers</h2><ComparisonBar laplace={laplace} naive={naive} trueProb={trueProb} /><p className="annotation">The actual chance is visible because this is a simulation. In a real problem, you would only see the draws and would have to estimate it.</p></section></div>
          <div className="col-12"><section className="card-panel chart-card"><h2>Watch confidence grow</h2><p className="section-intro">The blue range narrows as evidence accumulates. The cautious and raw guesses gradually move closer together.</p><ConvergenceChart history={history} trueProb={trueProb} /></section></div>
        </div>
      </div>

      <footer><span>Built to make a 200-year-old idea tangible.</span><a href="https://github.com/isaiahcampusano/laplacian" target="_blank" rel="noreferrer">Explore the project ↗</a><span>Model assumption: a uniform Beta(1, 1) prior.</span></footer>

      {showTakeaway && (
        <div className="takeaway-backdrop" role="dialog" aria-modal="true" aria-labelledby="takeaway-title">
          <section className="takeaway-modal">
            <span className="success-check" aria-hidden="true">✓</span>
            <p className="formula-label">DEMO COMPLETE</p>
            <h2 id="takeaway-title">{TAKEAWAY}</h2>
            <button className="btn draw-btn" onClick={() => setShowTakeaway(false)}>Got it!</button>
          </section>
        </div>
      )}
    </main>
  )
}
