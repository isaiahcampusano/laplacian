# Laplace’s Ticket Lab

An interactive Vite + React visual explanation of **Laplace’s Rule of Succession**. Set a hidden winning probability, draw tickets, and compare a raw-frequency estimate with Laplace’s posterior prediction.

## Run locally

```bash
npm install
npm run dev
```

Build a production version with `npm run build`, then preview it with `npm run preview`.

## Deploy to GitHub Pages

The project includes `gh-pages` and a portable Vite base path. After committing the project to a GitHub repository:

```bash
npm install
npm run deploy
```

This publishes `dist/` to the repository’s `gh-pages` branch. In GitHub repository settings, set Pages to deploy from that branch if it is not enabled automatically.

## The idea

For `k` winning tickets out of `n` draws, the rule of succession assigns a uniform Beta(1, 1) prior and forecasts the next ticket as:

```
(k + 1) / (n + 2)
```

The two added observations act as a gentle guardrail against overconfidence when only a few tickets have been seen.
