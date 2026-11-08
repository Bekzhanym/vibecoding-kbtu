import type { ReactNode } from 'react';
import { DAY_START, DAY_END } from '@/lib/constants';

interface TimeFieldProps {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  icon: ReactNode;
  displayValue: string | null;
}

export default function TimeField({
  label,
  hint,
  value,
  onChange,
  icon,
  displayValue,
}: TimeFieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-xs font-semibold text-slate-600">{label}</label>
        <span className="text-[10px] text-slate-400">{hint}</span>
      </div>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        <input
          type="number"
          min={DAY_START}
          max={DAY_END}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`${DAY_START}–${DAY_END}`}
          className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-20 py-2.5 text-sm text-slate-800 font-medium tabular-nums outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
        />
        {displayValue && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 tabular-nums">
            {displayValue}
          </span>
        )}
      </div>
    </div>
  );
}
