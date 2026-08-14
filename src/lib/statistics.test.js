import test from 'node:test'
import assert from 'node:assert/strict'
import { summarizeEvidence } from './statistics.js'

test('starts from a neutral estimate without inventing a raw frequency', () => {
  const result = summarizeEvidence(0, 0)

  assert.equal(result.laplace, 0.5)
  assert.equal(result.naive, null)
  assert.ok(result.lower < 0.03)
  assert.ok(result.upper > 0.97)
})

test('moderates a single win or loss', () => {
  assert.equal(summarizeEvidence(1, 1).laplace, 2 / 3)
  assert.equal(summarizeEvidence(1, 1).naive, 1)
  assert.equal(summarizeEvidence(0, 1).laplace, 1 / 3)
  assert.equal(summarizeEvidence(0, 1).naive, 0)
})

test('credible range narrows as balanced evidence accumulates', () => {
  const smallSample = summarizeEvidence(1, 2)
  const largeSample = summarizeEvidence(50, 100)

  assert.ok((largeSample.upper - largeSample.lower) < (smallSample.upper - smallSample.lower))
})
