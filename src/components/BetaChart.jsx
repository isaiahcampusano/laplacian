import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import jStat from 'jstat'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const credibleBand = {
  id: 'credibleBand',
  beforeDatasetsDraw(chart, _args, options) {
    const { ctx, chartArea, scales: { x } } = chart
    const left = x.getPixelForValue(options.lower)
    const right = x.getPixelForValue(options.upper)
    ctx.save()
    ctx.fillStyle = 'rgba(87, 172, 255, .16)'
    ctx.fillRect(left, chartArea.top, right - left, chartArea.bottom - chartArea.top)
    ctx.strokeStyle = 'rgba(105, 183, 255, .55)'
    ctx.setLineDash([4, 4])
    ctx.strokeRect(left, chartArea.top, right - left, chartArea.bottom - chartArea.top)
    ctx.restore()
  },
}

const probabilityMarkers = {
  id: 'probabilityMarkers',
  afterDraw(chart, _args, options) {
    const { ctx, chartArea, scales: { x } } = chart
    options.markers.forEach(({ value, color, label, dash, width = 2 }) => {
      if (value === null) return
      const position = x.getPixelForValue(value)
      ctx.save()
      ctx.strokeStyle = color
      ctx.setLineDash(dash)
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(position, chartArea.top)
      ctx.lineTo(position, chartArea.bottom)
      ctx.stroke()
      ctx.fillStyle = color
      ctx.font = '700 11px system-ui'
      ctx.fillText(label, Math.min(position + 5, chartArea.right - 104), chartArea.top + 15)
      ctx.restore()
    })
  },
}

export default function BetaChart({ n, k, trueProb, laplace, naive, lower, upper }) {
  const points = Array.from({ length: 201 }, (_, index) => index / 200)
  const alpha = k + 1
  const beta = n - k + 1
  const posterior = points.map((p) => jStat.beta.pdf(p === 0 ? 0.00001 : p === 1 ? 0.99999 : p, alpha, beta))

  return <div className="chart-wrap beta-wrap"><Line data={{ labels: points, datasets: [
    { label: 'Plausibility after these draws', data: posterior, borderColor: '#69b7ff', backgroundColor: 'rgba(57, 132, 208, .20)', fill: true, borderWidth: 3, pointRadius: 0 },
  ] }} options={{ responsive: true, maintainAspectRatio: false, plugins: {
    legend: { labels: { color: '#dce8f5', usePointStyle: true } },
    tooltip: { callbacks: { title: (items) => `${Math.round(items[0].parsed.x * 100)}% winning chance`, label: () => 'Relative plausibility' }, displayColors: false },
    credibleBand: { lower, upper },
    probabilityMarkers: { markers: [
      { value: laplace, color: '#69b7ff', label: 'Cautious guess', dash: [], width: 3.5 },
      { value: naive, color: '#ff7b83', label: 'Raw guess', dash: [6, 4], width: 2.5 },
      { value: trueProb, color: '#73df9f', label: 'Actual chance', dash: [2, 4], width: 2 },
    ] },
  }, scales: {
    x: { type: 'linear', min: 0, max: 1, title: { display: true, text: 'Possible winning chance', color: '#b7c7da' }, ticks: { color: '#b7c7da', callback: (value) => `${Math.round(Number(value) * 100)}%` }, grid: { color: 'rgba(183,199,218,.1)' } },
    y: { beginAtZero: true, title: { display: true, text: 'Relative plausibility', color: '#b7c7da' }, ticks: { display: false }, grid: { color: 'rgba(183,199,218,.1)' } },
  } }} plugins={[credibleBand, probabilityMarkers]} /></div>
}
