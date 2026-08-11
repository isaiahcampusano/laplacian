import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function ConvergenceChart({ history, trueProb }) {
  const labels = history.length ? history.map((point) => point.drawIndex) : [0]
  const data = history.length ? history : [{ laplace: 0.5, naive: null }]
  return <div className="chart-wrap convergence-wrap"><Line data={{ labels, datasets: [
    { label: 'Laplace estimate', data: data.map((point) => point.laplace), borderColor: '#F5C542', backgroundColor: '#F5C542', borderWidth: 2.8, tension: .28, pointRadius: history.length > 20 ? 0 : 3 },
    { label: 'Naive estimate', data: data.map((point) => point.naive), borderColor: '#b7c0ca', backgroundColor: '#b7c0ca', borderWidth: 2, tension: .28, pointRadius: history.length > 20 ? 0 : 3, spanGaps: true },
    { label: 'Hidden true probability', data: labels.map(() => trueProb), borderColor: '#ef6b73', borderDash: [7, 5], borderWidth: 1.8, pointRadius: 0 },
  ] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#dce8f5', usePointStyle: true } } }, scales: { x: { title: { display: true, text: 'Draw number', color: '#b7c7da' }, ticks: { color: '#b7c7da' }, grid: { color: 'rgba(183,199,218,.1)' } }, y: { min: 0, max: 1, title: { display: true, text: 'Estimated chance of winning', color: '#b7c7da' }, ticks: { color: '#b7c7da' }, grid: { color: 'rgba(183,199,218,.1)' } } } }} /></div>
}
