export interface MortgageInput {
  price: number;
  deposit: number;
  /** Nominal annual rate as a percentage, e.g. 11.5 */
  annualRatePercent: number;
  termYears: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

const EMPTY: MortgageResult = { loanAmount: 0, monthlyPayment: 0, totalPaid: 0, totalInterest: 0 };

/** Standard amortised repayment: P·r / (1 − (1 + r)^−n), compounded monthly. */
export function calculateMortgage({ price, deposit, annualRatePercent, termYears }: MortgageInput): MortgageResult {
  const inputs = [price, deposit, annualRatePercent, termYears];
  if (inputs.some((n) => !Number.isFinite(n)) || price < 0 || deposit < 0 || annualRatePercent < 0 || termYears <= 0) {
    return EMPTY;
  }

  const loanAmount = Math.max(price - deposit, 0);
  if (loanAmount === 0) return EMPTY;

  const months = Math.round(termYears * 12);
  const monthlyRate = annualRatePercent / 100 / 12;
  const monthlyPayment =
    monthlyRate === 0 ? loanAmount / months : (loanAmount * monthlyRate) / (1 - (1 + monthlyRate) ** -months);

  const totalPaid = monthlyPayment * months;
  return { loanAmount, monthlyPayment, totalPaid, totalInterest: totalPaid - loanAmount };
}
