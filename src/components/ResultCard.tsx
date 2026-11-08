import { CheckCircle2, DoorOpen, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CheckResult, Decision } from '@/lib/types';

interface DecisionStyle {
  label: string;
  Icon: LucideIcon;
  card: string;
  badge: string;
  title: string;
  text: string;
}

const DECISION_STYLES: Record<Decision, DecisionStyle> = {
  available: {
    label: 'Available',
    Icon: CheckCircle2,
    card: 'bg-emerald-50 border border-emerald-200',
    badge: 'bg-emerald-500 text-white',
    title: 'text-emerald-700',
    text: 'text-emerald-600',
  },
  unavailable: {
    label: 'Unavailable',
    Icon: XCircle,
    card: 'bg-rose-50 border border-rose-200',
    badge: 'bg-rose-500 text-white',
    title: 'text-rose-700',
    text: 'text-rose-600',
  },
};

interface ResultCardProps {
  result: CheckResult | null;
  isStale: boolean;
}

export default function ResultCard({ result, isStale }: ResultCardProps) {
  if (result === null) {
    return (
      <div className="flex h-full min-h-[140px] flex-col items-center justify-center text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <DoorOpen size={26} className="text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">
          Fill in the details and click <span className="font-semibold text-slate-700">Check Availability</span>
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Your decision will appear here without modifying any booking data.
        </p>
      </div>
    );
  }

  const style = DECISION_STYLES[result.decision];
  const { Icon } = style;

  return (
    <>
      <div className={`flex items-start gap-4 rounded-xl p-4 transition ${style.card}`}>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${style.badge}`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${style.title}`}>{style.label}</h3>
          <p className={`text-sm font-medium ${style.text}`}>{result.reason}</p>
          {result.detail && (
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">{result.detail}</p>
          )}
        </div>
      </div>
      {isStale && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
          Times changed since the last check — click Check Availability again.
        </p>
      )}
    </>
  );
}
