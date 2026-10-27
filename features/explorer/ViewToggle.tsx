"use client";

export type MobileView = "map" | "list";

interface ViewToggleProps {
  view: MobileView;
  count: number;
  onChange: (view: MobileView) => void;
}

const OPTIONS: { value: MobileView; label: string }[] = [
  { value: "map", label: "Map" },
  { value: "list", label: "List" },
];

/** Floating Map/List switch for small screens; on desktop both panes are always visible. */
export function ViewToggle({ view, count, onChange }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Switch between map and list"
      className="fixed bottom-4 left-1/2 z-[1100] flex -translate-x-1/2 overflow-hidden rounded-full bg-zinc-900 text-sm font-medium text-white shadow-lg lg:hidden"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          onClick={() => onChange(option.value)}
          className={`px-5 py-2.5 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${
            view === option.value ? "bg-teal-700" : "hover:bg-zinc-800"
          }`}
        >
          {option.label}
          {option.value === "list" ? ` (${count})` : ""}
        </button>
      ))}
    </div>
  );
}
