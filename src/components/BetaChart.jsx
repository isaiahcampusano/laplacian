import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { jStat } from 'jstat'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const markers = {
  id: 'probabilityMarkers',
  afterDraw(chart, _args, options) {
    const { ctx, chartArea, scales: { x } } = chart
    options.markers.forEach(({ value, color, label, dash }) => {
      if (value === null) return
      const position = x.getPixelForValue(value)
      ctx.save(); ctx.strokeStyle = color; ctx.setLineDash(dash); ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(position, chartArea.top); ctx.lineTo(position, chartArea.bottom); ctx.stroke()
      ctx.fillStyle = color; ctx.font = '600 11px system-ui'; ctx.fillText(label, Math.min(position + 4, chartArea.right - 45), chartArea.top + 14); ctx.restore()
    })
  },
}

export default function BetaChart({ n, k, trueProb, laplace, naive }) {
  const points = Array.from({ length: 101 }, (_, index) => index / 100)
  const alpha = k + 1; const beta = n - k + 1
  const posterior = points.map((p) => jStat.beta.pdf(p === 0 ? 0.00001 : p === 1 ? 0.99999 : p, alpha, beta))
  return <div className="chart-wrap beta-wrap"><Line data={{ labels: points, datasets: [
    { label: 'Flat prior Beta(1, 1)', data: points.map(() => 1), borderColor: '#aab6c5', borderDash: [6, 5], borderWidth: 1.5, pointRadius: 0 },
    { label: `Posterior Beta(${alpha}, ${beta})`, data: posterior, borderColor: '#69a7df', backgroundColor: 'rgba(57, 132, 208, .28)', fill: true, borderWidth: 2.4, pointRadius: 0 },
  ] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#dce8f5', usePointStyle: true } }, tooltip: { callbacks: { label: (item) => `${item.dataset.label}: ${item.raw.toFixed(2)}` }, displayColors: false }, probabilityMarkers: { markers: [ { value: laplace, color: '#F5C542', label: 'Laplace', dash: [5, 3] }, { value: naive, color: '#b7c0ca', label: 'Naive', dash: [2, 3] }, { value: trueProb, color: '#ef6b73', label: 'Truth', dash: [6, 3] } ] } }, scales: { x: { type: 'linear', min: 0, max: 1, title: { display: true, text: 'Chance of a winning ticket', color: '#b7c7da' }, ticks: { color: '#b7c7da', callback: (value) => Number(value).toFixed(1) }, grid: { color: 'rgba(183,199,218,.1)' } }, y: { beginAtZero: true, title: { display: true, text: 'Probability density', color: '#b7c7da' }, ticks: { color: '#b7c7da' }, grid: { color: 'rgba(183,199,218,.1)' } } } }} plugins={[markers]} /></div>
}
