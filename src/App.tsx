import { GraduationCap } from 'lucide-react';
import RoomChecker from '@/components/RoomChecker';
import { DAY_START, DAY_END } from '@/lib/constants';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Steppe Tech University
            </h1>
            <p className="text-xs text-slate-500">Smart Campus Room Availability Checker</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <RoomChecker />
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
        <p className="text-center text-xs text-slate-400">
          Fictional campus data for prototype demonstration. Times are in minutes from midnight ({DAY_START}–{DAY_END}).
        </p>
      </footer>
    </div>
  );
}
