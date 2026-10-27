// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MortgageCalculator } from "./MortgageCalculator";

afterEach(cleanup);

const digits = (el: HTMLElement): number => Number((el.textContent ?? "").replace(/\D/g, ""));

describe("MortgageCalculator", () => {
  it("starts with a 10% deposit and a computed repayment", () => {
    render(<MortgageCalculator price={2_000_000} />);
    expect((screen.getByLabelText("Deposit (R)") as HTMLInputElement).value).toBe("200000");
    expect(digits(screen.getByTestId("loan-amount"))).toBe(1_800_000);
    expect(digits(screen.getByTestId("monthly-payment"))).toBeGreaterThan(0);
  });

  it("recalculates when the interest rate changes", () => {
    render(<MortgageCalculator price={2_000_000} />);
    const before = digits(screen.getByTestId("monthly-payment"));
    fireEvent.change(screen.getByLabelText("Interest rate (%)"), { target: { value: "5" } });
    expect(digits(screen.getByTestId("monthly-payment"))).toBeLessThan(before);
  });

  it("recalculates when the deposit or term changes", () => {
    render(<MortgageCalculator price={2_000_000} />);
    fireEvent.change(screen.getByLabelText("Deposit (R)"), { target: { value: "1000000" } });
    expect(digits(screen.getByTestId("loan-amount"))).toBe(1_000_000);

    const short = digits(screen.getByTestId("monthly-payment"));
    fireEvent.change(screen.getByLabelText("Term"), { target: { value: "30" } });
    expect(digits(screen.getByTestId("monthly-payment"))).toBeLessThan(short);
  });

  it("shows R 0 instead of NaN when inputs are cleared or the deposit covers the price", () => {
    render(<MortgageCalculator price={1_000_000} />);
    fireEvent.change(screen.getByLabelText("Deposit (R)"), { target: { value: "1500000" } });
    expect(digits(screen.getByTestId("monthly-payment"))).toBe(0);

    fireEvent.change(screen.getByLabelText("Interest rate (%)"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Deposit (R)"), { target: { value: "" } });
    expect(screen.getByTestId("monthly-payment").textContent).not.toMatch(/NaN/);
  });
});
