export interface Booking {
  start: number; // minutes from midnight
  end: number;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  bookings: Booking[];
}

export type Decision = 'available' | 'unavailable';

export interface CheckResult {
  decision: Decision;
  reason: string;
  detail?: string;
}

export interface CheckInput {
  roomId: string;
  currentTime: number;
  start: number;
  end: number;
}

export interface IntervalIssue {
  reason: string;
  detail: string;
  warning?: string;
}
