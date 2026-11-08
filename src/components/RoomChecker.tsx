import { useState, useMemo } from 'react';
import {
  Building2,
  Clock,
  DoorOpen,
  Timer,
  CheckCircle2,
  CalendarClock,
  ChevronDown,
  Users,
  Ban,
  Info,
} from 'lucide-react';
import { SAMPLE_ROOMS } from '@/lib/data';
import { checkAvailability, validateInterval } from '@/lib/checker';
import { MAX_DURATION_MINUTES } from '@/lib/constants';
import { minutesToLabel, minutesToDurationLabel } from '@/lib/time';
import type { CheckResult } from '@/lib/types';
import Timeline from './Timeline';
import TimeField from './TimeField';
import ResultCard from './ResultCard';
import RulesPanel from './RulesPanel';

interface CheckSnapshot {
  currentTime: number;
  start: number;
  end: number;
  result: CheckResult;
}

function parseNum(v: string): number {
  const n = parseInt(v, 10);
  return isNaN(n) ? NaN : n;
}

export default function RoomChecker() {
  const [roomId, setRoomId] = useState(SAMPLE_ROOMS[0].id);
  const [currentTime, setCurrentTime] = useState('540');
  const [start, setStart] = useState('540');
  const [end, setEnd] = useState('600');
  const [snapshot, setSnapshot] = useState<CheckSnapshot | null>(null);

  const selectedRoom = SAMPLE_ROOMS.find((r) => r.id === roomId)!;

  const startNum = parseNum(start);
  const endNum = parseNum(end);
  const currentNum = parseNum(currentTime);

  const duration = !isNaN(startNum) && !isNaN(endNum) && endNum > startNum ? endNum - startNum : null;

  const isStale =
    snapshot !== null &&
    !(
      Object.is(snapshot.currentTime, currentNum) &&
      Object.is(snapshot.start, startNum) &&
      Object.is(snapshot.end, endNum)
    );

  const liveWarnings = useMemo(
    () =>
      validateInterval({ currentTime: currentNum, start: startNum, end: endNum }).flatMap((issue) =>
        issue.warning ? [issue.warning] : []
      ),
    [startNum, endNum, currentNum]
  );

  const handleCheck = () => {
    const input = { currentTime: currentNum, start: startNum, end: endNum };
    setSnapshot({ ...input, result: checkAvailability(selectedRoom, input) });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
      {/* Form panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <DoorOpen size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Check Availability</h2>
            <p className="text-xs text-slate-500">Enter booking details below</p>
          </div>
        </div>

        {/* Room selector */}
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Room</label>
        <div className="relative mb-4">
          <select
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
              setSnapshot(null);
            }}
            className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 font-medium outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          >
            {SAMPLE_ROOMS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        {/* Room info card */}
        <div className="mb-5 rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Building2 size={14} className="text-slate-400" />
            <span>{selectedRoom.building}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Users size={14} className="text-slate-400" />
            <span>Capacity: {selectedRoom.capacity}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {selectedRoom.blocked ? (
              <span className="inline-flex items-center gap-1.5 text-rose-600 font-medium">
                <Ban size={14} /> Blocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                <CheckCircle2 size={14} /> Operational
              </span>
            )}
            {!selectedRoom.blocked && selectedRoom.bookings.length > 0 && (
              <span className="text-slate-400">· {selectedRoom.bookings.length} existing booking{selectedRoom.bookings.length > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {/* Time inputs */}
        <div className="space-y-4">
          <TimeField
            label="Current Time"
            hint="minutes from midnight"
            value={currentTime}
            onChange={setCurrentTime}
            icon={<Clock size={15} />}
            displayValue={!isNaN(currentNum) ? minutesToLabel(currentNum) : null}
          />
          <TimeField
            label="Start"
            hint="minutes from midnight"
            value={start}
            onChange={setStart}
            icon={<CalendarClock size={15} />}
            displayValue={!isNaN(startNum) ? minutesToLabel(startNum) : null}
          />
          <TimeField
            label="End"
            hint="minutes from midnight"
            value={end}
            onChange={setEnd}
            icon={<CalendarClock size={15} />}
            displayValue={!isNaN(endNum) ? minutesToLabel(endNum) : null}
          />
        </div>

        {/* Duration badge */}
        <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Timer size={14} className="text-slate-400" />
            Duration
          </span>
          <span
            className={`text-sm font-bold tabular-nums ${
              duration === null
                ? 'text-slate-400'
                : duration > MAX_DURATION_MINUTES
                  ? 'text-rose-600'
                  : 'text-slate-800'
            }`}
          >
            {duration !== null ? minutesToDurationLabel(duration) : '—'}
            {duration !== null && duration > MAX_DURATION_MINUTES && (
              <span className="ml-1.5 text-[10px] font-medium text-rose-500">over limit</span>
            )}
          </span>
        </div>

        {/* Live validation warnings */}
        {liveWarnings.length > 0 && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
            <ul className="space-y-1">
              {liveWarnings.map((w, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-amber-700">
                  <Info size={13} className="mt-0.5 shrink-0 text-amber-500" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-5 flex gap-2.5">
          <button
            onClick={handleCheck}
            className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            Check Availability
          </button>
          <button
            onClick={() => setSnapshot(null)}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Right column: timeline + result */}
      <div className="space-y-5">
        <Timeline
          bookings={selectedRoom.bookings}
          blocked={selectedRoom.blocked}
          candidateStart={snapshot?.start ?? null}
          candidateEnd={snapshot?.end ?? null}
          result={snapshot?.result ?? null}
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm min-h-[180px]">
          <ResultCard result={snapshot?.result ?? null} isStale={isStale} />
          <RulesPanel />
        </div>
      </div>
    </div>
  );
}
