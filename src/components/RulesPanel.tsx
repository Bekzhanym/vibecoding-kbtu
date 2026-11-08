import { DAY_START, DAY_END, MAX_DURATION_MINUTES } from '@/lib/constants';

const RULES = [
  <>
    {DAY_START} ≤ start &lt; end ≤ {DAY_END}, and start must be after current time
  </>,
  <>Maximum booking duration: {MAX_DURATION_MINUTES} minutes</>,
  <>Blocked rooms are always rejected</>,
  <>Touching endpoints (e.g. 600–660 and 660–720) are allowed</>,
];

export default function RulesPanel() {
  return (
    <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Booking Rules
      </p>
      <ul className="space-y-1 text-xs text-slate-600">
        {RULES.map((rule, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 text-slate-400">·</span>
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}
