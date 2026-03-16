import { useState, useCallback } from 'react'

const fmt = (n) =>
  n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function parseNum(val) {
  const n = parseFloat(val)
  return isNaN(n) ? null : n
}

function calculate(mode, amount, rate, incentivePct) {
  const remittanceRate = incentivePct / 100

  if (mode === 'send') {
    const convertedBDT = amount * rate
    const incentiveBDT = convertedBDT * remittanceRate
    const finalReceivedBDT = convertedBDT + incentiveBDT
    return { convertedBDT, incentiveBDT, finalReceivedBDT, audRequired: null }
  } else {
    const convertedBDT = amount / (1 + remittanceRate)
    const incentiveBDT = convertedBDT * remittanceRate
    const audRequired = convertedBDT / rate
    const finalReceivedBDT = convertedBDT + incentiveBDT
    return { convertedBDT, incentiveBDT, finalReceivedBDT, audRequired }
  }
}

function InputField({ label, helper, value, onChange, placeholder, error }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {helper && <span className="field-helper">{helper}</span>}
      <input
        className={`field-input${error ? ' field-input--error' : ''}`}
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}

function ResultRow({ label, value, primary }) {
  return (
    <div className={`result-row${primary ? ' result-row--primary' : ''}`}>
      <span className="result-label">{label}</span>
      <span className="result-value">{value}</span>
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState('send')
  const [amount, setAmount] = useState('')
  const [rate, setRate] = useState('87.5')
  const [incentive, setIncentive] = useState('2.5')

  const amountNum = parseNum(amount)
  const rateNum = parseNum(rate)
  const incentiveNum = parseNum(incentive)

  const amountError =
    amount !== '' && amountNum === null ? 'Enter a valid number' : null
  const rateError =
    rate !== '' && (rateNum === null || rateNum <= 0)
      ? 'Enter a valid rate greater than 0'
      : null
  const incentiveError =
    incentive !== '' && (incentiveNum === null || incentiveNum < 0)
      ? 'Enter a valid percentage'
      : null

  const isValid =
    amountNum !== null &&
    amountNum > 0 &&
    rateNum !== null &&
    rateNum > 0 &&
    incentiveNum !== null &&
    incentiveNum >= 0

  const result = isValid ? calculate(mode, amountNum, rateNum, incentiveNum) : null

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode)
    setAmount('')
  }, [])

  return (
    <div className="page">
      <div className="card">
        {/* Header */}
        <div className="card-header">
          <h1 className="app-title">AusTaka</h1>
          <p className="app-subtitle">Australia → Bangladesh Remittance Calculator</p>
        </div>

        {/* Mode selector */}
        <div className="mode-selector">
          <button
            className={`mode-btn${mode === 'send' ? ' mode-btn--active' : ''}`}
            onClick={() => handleModeChange('send')}
          >
            Send AUD
          </button>
          <button
            className={`mode-btn${mode === 'target' ? ' mode-btn--active' : ''}`}
            onClick={() => handleModeChange('target')}
          >
            Target BDT
          </button>
        </div>

        {/* Inputs */}
        <div className="form">
          <InputField
            label={mode === 'send' ? 'AUD Amount' : 'Target BDT Amount'}
            value={amount}
            onChange={setAmount}
            placeholder={mode === 'send' ? 'e.g. 1000' : 'e.g. 2500000'}
            error={amountError}
          />
          <div className="form-row">
            <InputField
              label="Exchange Rate"
              helper="1 AUD = X BDT"
              value={rate}
              onChange={setRate}
              placeholder="e.g. 87.5"
              error={rateError}
            />
            <InputField
              label="Remittance Incentive (%)"
              value={incentive}
              onChange={setIncentive}
              placeholder="e.g. 2.5"
              error={incentiveError}
            />
          </div>
        </div>

        {/* Results */}
        {result ? (
          <div className="results">
            {mode === 'send' ? (
              <>
                <div className="results-primary">
                  <span className="results-primary-label">Final received in Bangladesh</span>
                  <span className="results-primary-value">৳ {fmt(result.finalReceivedBDT)}</span>
                </div>
                <div className="results-breakdown">
                  <ResultRow label="AUD sent" value={`A$ ${fmt(amountNum)}`} />
                  <ResultRow label="Exchange rate" value={`1 AUD = ৳ ${fmt(rateNum)}`} />
                  <ResultRow label="Converted amount" value={`৳ ${fmt(result.convertedBDT)}`} />
                  <ResultRow label="Remittance incentive" value={`+ ৳ ${fmt(result.incentiveBDT)}`} />
                  <ResultRow label="Total received" value={`৳ ${fmt(result.finalReceivedBDT)}`} primary />
                </div>
              </>
            ) : (
              <>
                <div className="results-primary">
                  <span className="results-primary-label">AUD required</span>
                  <span className="results-primary-value">A$ {fmt(result.audRequired)}</span>
                </div>
                <div className="results-breakdown">
                  <ResultRow label="Target amount" value={`৳ ${fmt(amountNum)}`} />
                  <ResultRow label="Exchange rate" value={`1 AUD = ৳ ${fmt(rateNum)}`} />
                  <ResultRow label="Converted amount before incentive" value={`৳ ${fmt(result.convertedBDT)}`} />
                  <ResultRow label="Remittance incentive" value={`+ ৳ ${fmt(result.incentiveBDT)}`} />
                  <ResultRow label="Final received" value={`৳ ${fmt(result.finalReceivedBDT)}`} primary />
                </div>
              </>
            )}
          </div>
        ) : (
          amount !== '' && !isValid && !amountError ? null : (
            <div className="results-empty">
              {amount === ''
                ? `Enter ${mode === 'send' ? 'an AUD amount' : 'a target BDT amount'} to see the calculation`
                : null}
            </div>
          )
        )}

        <p className="disclaimer">
          Results are estimates. Actual amounts may vary based on provider fees and rate fluctuations.
        </p>
      </div>
    </div>
  )
}
