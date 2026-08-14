import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

export default function ConvergenceChart({ history, trueProb }) {
  const labels = history.length ? history.map((point) => point.drawIndex) : [0]
  const data = history.length ? history : [{ laplace: 0.5, naive: null, lower: 0.025, upper: 0.975 }]

  return <div className="chart-wrap convergence-wrap"><Line data={{ labels, datasets: [
    { label: 'Upper plausible limit', data: data.map((point) => point.upper), borderColor: 'transparent', backgroundColor: 'rgba(105, 183, 255, .16)', pointRadius: 0, fill: '+1' },
    { label: '95% plausible range', data: data.map((point) => point.lower), borderColor: 'transparent', backgroundColor: 'rgba(105, 183, 255, .16)', pointRadius: 0, fill: false },
    { label: 'Laplace’s cautious guess', data: data.map((point) => point.laplace), borderColor: '#69b7ff', backgroundColor: '#69b7ff', borderWidth: 3.2, tension: .25, pointRadius: history.length > 20 ? 0 : 3 },
    { label: 'Raw frequency guess', data: data.map((point) => point.naive), borderColor: '#ff7b83', backgroundColor: '#ff7b83', borderDash: [7, 5], borderWidth: 2.2, tension: .25, pointRadius: history.length > 20 ? 0 : 3, spanGaps: true },
    { label: 'The box’s actual chance', data: labels.map(() => trueProb), borderColor: '#73df9f', borderDash: [2, 5], borderWidth: 2, pointRadius: 0 },
  ] }} options={{ responsive: true, maintainAspectRatio: false, plugins: {
    legend: { labels: { color: '#dce8f5', usePointStyle: true, filter: (item) => item.text !== 'Upper plausible limit' } },
    tooltip: { filter: (item) => item.dataset.label !== 'Upper plausible limit', callbacks: { label: (item) => `${item.dataset.label}: ${Math.round(item.raw * 100)}%` } },
  }, scales: {
    x: { title: { display: true, text: 'Draw number', color: '#b7c7da' }, ticks: { color: '#b7c7da' }, grid: { color: 'rgba(183,199,218,.1)' } },
    y: { min: 0, max: 1, title: { display: true, text: 'Estimated winning chance', color: '#b7c7da' }, ticks: { color: '#b7c7da', callback: (value) => `${Math.round(value * 100)}%` }, grid: { color: 'rgba(183,199,218,.1)' } },
  } }} /></div>
}
