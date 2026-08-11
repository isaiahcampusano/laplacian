import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function ComparisonBar({ laplace, naive, trueProb }) {
  return <div className="chart-wrap comparison-wrap"><Bar data={{ labels: ['Laplace', 'Naive', 'True probability'], datasets: [{ label: 'Chance of winning', data: [laplace, naive, trueProb], backgroundColor: ['#F5C542', '#9ba9b8', '#ef6b73'], borderRadius: 7, borderSkipped: false }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (item) => item.raw === null ? 'No estimate yet' : `${(item.raw * 100).toFixed(0)}%` } } }, scales: { x: { ticks: { color: '#dce8f5' }, grid: { display: false } }, y: { min: 0, max: 1, ticks: { color: '#b7c7da', callback: (value) => `${Math.round(value * 100)}%` }, grid: { color: 'rgba(183,199,218,.12)' } } } }} /></div>
}
