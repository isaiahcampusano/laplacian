import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function ComparisonBar({ laplace, naive, trueProb }) {
  return <div className="chart-wrap comparison-wrap"><Bar data={{
    labels: ['Cautious guess', 'Raw guess', 'Actual chance'],
    datasets: [{ label: 'Winning chance', data: [laplace, naive, trueProb], backgroundColor: ['#69b7ff', '#ff7b83', '#73df9f'], borderRadius: 7, borderSkipped: false }],
  }} options={{ responsive: true, maintainAspectRatio: false, plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (item) => item.raw === null ? 'No estimate yet' : `${Math.round(item.raw * 100)}%` } },
  }, scales: {
    x: { ticks: { color: '#dce8f5' }, grid: { display: false } },
    y: { min: 0, max: 1, ticks: { color: '#b7c7da', callback: (value) => `${Math.round(value * 100)}%` }, grid: { color: 'rgba(183,199,218,.12)' } },
  } }} /></div>
}
