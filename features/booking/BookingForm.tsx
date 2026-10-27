"use client";

import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { availableSlots, formatSlot, groupSlotsByDay } from "@/lib/booking-slots";

interface BookingFormProps {
  listingId: string;
  agentName: string;
}

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "error"; message: string } | { kind: "done"; slot: string };

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900";

export function BookingForm({ listingId, agentName }: BookingFormProps) {
  const nameId = useId();
  const emailId = useId();
  // Slots depend on the current time, so they are computed after mount to keep server and client markup equal.
  const [days, setDays] = useState<ReturnType<typeof groupSlotsByDay>>([]);
  const [booked, setBooked] = useState<ReadonlySet<string>>(new Set());
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    const grouped = groupSlotsByDay(availableSlots());
    const controller = new AbortController();

    fetch(`/api/bookings?listingId=${encodeURIComponent(listingId)}`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<{ booked: string[] }>) : { booked: [] }))
      .then((data) => setBooked(new Set(data.booked)))
      .catch(() => undefined) // availability is best-effort; the server still rejects taken slots
      .finally(() => setDays(grouped));

    return () => controller.abort();
  }, [listingId]);

  const activeDay = useMemo(() => days.find((d) => d.key === dayKey) ?? days[0], [days, dayKey]);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!slot) {
      setStatus({ kind: "error", message: "Please choose a time." });
      return;
    }
    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, name, email, slot }),
      });
      if (res.status === 201) {
        setBooked((prev) => new Set(prev).add(slot));
        setStatus({ kind: "done", slot });
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 409) {
        setBooked((prev) => new Set(prev).add(slot));
        setSlot(null);
      }
      setStatus({ kind: "error", message: data.error ?? "Could not book this viewing." });
    } catch {
      setStatus({ kind: "error", message: "Network error. Please try again." });
    }
  }

  if (status.kind === "done") {
    return (
      <section aria-labelledby="booking-heading" className="rounded-lg border border-teal-600 p-3 text-sm">
        <h2 id="booking-heading" className="mb-1 font-semibold">
          Viewing requested
        </h2>
        <p role="status">
          {agentName} will meet you on {formatSlot(status.slot)}. A confirmation will be sent to {email}.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="booking-heading" className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      <h2 id="booking-heading" className="mb-3 text-sm font-semibold">
        Book a viewing
      </h2>
      {days.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading available times…</p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <fieldset>
            <legend className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Day</legend>
            <div className="flex flex-wrap gap-1.5">
              {days.map((day) => (
                <button
                  key={day.key}
                  type="button"
                  aria-pressed={day.key === activeDay.key}
                  onClick={() => {
                    setDayKey(day.key);
                    setSlot(null);
                  }}
                  className={`rounded-md border px-2.5 py-1 text-xs focus-visible:outline-2 focus-visible:outline-teal-600 ${
                    day.key === activeDay.key
                      ? "border-teal-700 bg-teal-700 text-white"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">Time (SAST)</legend>
            <div className="grid grid-cols-4 gap-1.5">
              {activeDay.slots.map(({ iso, time }) => {
                const taken = booked.has(iso);
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={taken}
                    aria-pressed={slot === iso}
                    aria-label={taken ? `${time} (unavailable)` : time}
                    onClick={() => setSlot(iso)}
                    className={`rounded-md border px-1 py-1 text-xs focus-visible:outline-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:line-through ${
                      slot === iso ? "border-teal-700 bg-teal-700 text-white" : "border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor={nameId} className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Your name
              </label>
              <input id={nameId} required maxLength={100} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={emailId} className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Email
              </label>
              <input id={emailId} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
          </div>

          {status.kind === "error" && (
            <p role="alert" className="text-sm text-rose-700 dark:text-rose-400">
              {status.message}
            </p>
          )}
          <button
            type="submit"
            disabled={status.kind === "submitting"}
            className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-teal-600 disabled:opacity-60"
          >
            {status.kind === "submitting" ? "Booking…" : slot ? `Request viewing: ${formatSlot(slot)}` : "Request viewing"}
          </button>
        </form>
      )}
    </section>
  );
}
