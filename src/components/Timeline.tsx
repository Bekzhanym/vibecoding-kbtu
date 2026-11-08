import { minutesToLabel } from '@/lib/time';
import { DAY_END } from '@/lib/constants';
import type { Booking, CheckResult } from '@/lib/types';

interface TimelineProps {
  bookings: Booking[];
  blocked: boolean;
  candidateStart: number | null;
  candidateEnd: number | null;
  result: CheckResult | null;
}

const HOUR_MARKS = Array.from({ length: 25 }, (_, i) => i * 60);

export default function Timeline({
  bookings,
  blocked,
  candidateStart,
  candidateEnd,
  result,
}: TimelineProps) {
  const toPct = (min: number) => (min / DAY_END) * 100;

  const candidateColor =
    result?.decision === 'available'
      ? 'bg-emerald-500'
      : result?.decision === 'unavailable'
        ? 'bg-rose-500'
        : 'bg-sky-400';

  const candidateOpacity = result ? '' : 'opacity-60';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Today&apos;s Schedule</h3>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-slate-400" />
            Existing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-slate-800" />
            Blocked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-sky-400" />
            Candidate
          </span>
        </div>
      </div>

      {/* Timeline track */}
      <div className="relative h-12 rounded-lg bg-slate-100 overflow-hidden">
        {/* Existing bookings */}
        {bookings.map((b, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 bg-slate-400/80 flex items-center justify-center"
            style={{ left: `${toPct(b.start)}%`, width: `${toPct(b.end - b.start)}%` }}
          >
            <span className="text-[9px] font-medium text-white truncate px-1">
              {minutesToLabel(b.start)}–{minutesToLabel(b.end)}
            </span>
          </div>
        ))}

        {/* Blocked overlay */}
        {blocked && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #334155 0px, #334155 6px, #475569 6px, #475569 12px)',
            }}
          >
            <span className="text-[10px] font-bold text-white tracking-widest uppercase px-2 py-0.5 rounded bg-slate-900/50">
              Blocked
            </span>
          </div>
        )}

        {/* Candidate interval */}
        {candidateStart !== null && candidateEnd !== null && candidateStart < candidateEnd && (
          <div
            className={`absolute top-0 bottom-0 ${candidateColor} ${candidateOpacity} border-2 border-white/70 flex items-center justify-center`}
            style={{ left: `${toPct(candidateStart)}%`, width: `${toPct(candidateEnd - candidateStart)}%` }}
          >
            <span className="text-[9px] font-semibold text-white truncate px-1">
              {minutesToLabel(candidateStart)}–{minutesToLabel(candidateEnd)}
            </span>
          </div>
        )}
      </div>

      {/* Hour scale */}
      <div className="relative mt-1.5 h-5">
        {HOUR_MARKS.filter((_, i) => i % 2 === 0).map((min) => (
          <div
            key={min}
            className="absolute -translate-x-1/2 text-[9px] text-slate-400 tabular-nums"
            style={{ left: `${toPct(min)}%` }}
          >
            {minutesToLabel(min)}
          </div>
        ))}
      </div>
    </div>
  );
}
