import { describe, expect, it } from "vitest";
import { calculateMortgage } from "./mortgage";

describe("calculateMortgage", () => {
  it("matches a known amortisation (R1,000,000 at 6% over 30 years)", () => {
    const result = calculateMortgage({ price: 1_000_000, deposit: 0, annualRatePercent: 6, termYears: 30 });
    expect(result.monthlyPayment).toBeCloseTo(5995.51, 2);
    expect(result.totalPaid).toBeCloseTo(2_158_381.89, 1);
    expect(result.totalInterest).toBeCloseTo(result.totalPaid - 1_000_000, 6);
  });

  it("subtracts the deposit from the loan amount", () => {
    const result = calculateMortgage({ price: 2_000_000, deposit: 500_000, annualRatePercent: 10, termYears: 20 });
    expect(result.loanAmount).toBe(1_500_000);
    expect(result.monthlyPayment).toBeCloseTo(14_475.2, 0);
  });

  it("splits evenly over the term when the rate is 0%", () => {
    const result = calculateMortgage({ price: 1_200_000, deposit: 0, annualRatePercent: 0, termYears: 10 });
    expect(result.monthlyPayment).toBeCloseTo(10_000, 6);
    expect(result.totalInterest).toBeCloseTo(0, 6);
  });

  it("returns zeros when the deposit covers the whole price", () => {
    const result = calculateMortgage({ price: 1_000_000, deposit: 1_500_000, annualRatePercent: 8, termYears: 20 });
    expect(result).toEqual({ loanAmount: 0, monthlyPayment: 0, totalPaid: 0, totalInterest: 0 });
  });

  it.each([
    ["zero term", { termYears: 0 }],
    ["negative rate", { annualRatePercent: -1 }],
    ["negative price", { price: -5 }],
    ["NaN rate", { annualRatePercent: Number.NaN }],
    ["infinite price", { price: Number.POSITIVE_INFINITY }],
  ])("returns zeros for invalid input (%s)", (_name, override) => {
    const result = calculateMortgage({ price: 1_000_000, deposit: 0, annualRatePercent: 8, termYears: 20, ...override });
    expect(result.monthlyPayment).toBe(0);
    expect(result.loanAmount).toBe(0);
  });

  it("costs more interest at a longer term", () => {
    const base = { price: 1_500_000, deposit: 150_000, annualRatePercent: 11 };
    const short = calculateMortgage({ ...base, termYears: 15 });
    const long = calculateMortgage({ ...base, termYears: 30 });
    expect(long.monthlyPayment).toBeLessThan(short.monthlyPayment);
    expect(long.totalInterest).toBeGreaterThan(short.totalInterest);
  });
});
