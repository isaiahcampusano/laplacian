import jStat from 'jstat'

export const summarizeEvidence = (wins, draws) => {
  const alpha = wins + 1
  const beta = draws - wins + 1

  return {
    alpha,
    beta,
    laplace: alpha / (alpha + beta),
    naive: draws ? wins / draws : null,
    lower: jStat.beta.inv(0.025, alpha, beta),
    upper: jStat.beta.inv(0.975, alpha, beta),
  }
}
