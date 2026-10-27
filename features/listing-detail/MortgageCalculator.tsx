"use client";

import { useId, useState } from "react";
import { formatPrice } from "@/lib/format";
import { calculateMortgage } from "@/lib/mortgage";

interface MortgageCalculatorProps {
  price: number;
}

const TERMS = [10, 15, 20, 25, 30];
const DEFAULT_DEPOSIT_RATIO = 0.1;
const DEFAULT_RATE = "11.75";

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900";

interface FieldProps {
  label: string;
  children: (id: string) => React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      {children(id)}
    </div>
  );
}

export function MortgageCalculator({ price }: MortgageCalculatorProps) {
  const [priceInput, setPriceInput] = useState(String(price));
  const [depositInput, setDepositInput] = useState(String(Math.round(price * DEFAULT_DEPOSIT_RATIO)));
  const [rateInput, setRateInput] = useState(DEFAULT_RATE);
  const [termYears, setTermYears] = useState(20);

  const result = calculateMortgage({
    price: Number(priceInput),
    deposit: Number(depositInput),
    annualRatePercent: Number(rateInput),
    termYears,
  });

  return (
    <section aria-labelledby="mortgage-heading" className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      <h2 id="mortgage-heading" className="mb-3 text-sm font-semibold">
        Mortgage estimator
      </h2>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Price (R)">
          {(id) => (
            <input id={id} type="number" inputMode="numeric" min={0} value={priceInput} onChange={(e) => setPriceInput(e.target.value)} className={inputClass} />
          )}
        </Field>
        <Field label="Deposit (R)">
          {(id) => (
            <input id={id} type="number" inputMode="numeric" min={0} value={depositInput} onChange={(e) => setDepositInput(e.target.value)} className={inputClass} />
          )}
        </Field>
        <Field label="Interest rate (%)">
          {(id) => (
            <input id={id} type="number" inputMode="decimal" min={0} step={0.05} value={rateInput} onChange={(e) => setRateInput(e.target.value)} className={inputClass} />
          )}
        </Field>
        <Field label="Term">
          {(id) => (
            <select id={id} value={termYears} onChange={(e) => setTermYears(Number(e.target.value))} className={inputClass}>
              {TERMS.map((years) => (
                <option key={years} value={years}>
                  {years} years
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <div aria-live="polite" className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">Estimated monthly repayment</p>
        <p data-testid="monthly-payment" className="text-2xl font-semibold">
          {formatPrice(result.monthlyPayment)}
        </p>
        <dl className="mt-2 grid grid-cols-2 gap-x-2 text-xs text-zinc-700 dark:text-zinc-300">
          <dt>Loan amount</dt>
          <dd className="text-right" data-testid="loan-amount">
            {formatPrice(result.loanAmount)}
          </dd>
          <dt>Total interest</dt>
          <dd className="text-right" data-testid="total-interest">
            {formatPrice(result.totalInterest)}
          </dd>
        </dl>
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">Indicative only. Excludes transfer costs, bond fees and insurance.</p>
    </section>
  );
}
