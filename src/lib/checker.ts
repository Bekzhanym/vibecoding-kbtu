import type { CheckInput, CheckResult, IntervalIssue, Room } from './types';
import { minutesToLabel, minutesToDurationLabel } from './time';
import { DAY_START, DAY_END, MAX_DURATION_MINUTES } from '@/lib/constants';

export function validateInterval({
  currentTime,
  start,
  end,
}: Omit<CheckInput, 'roomId'>): IntervalIssue[] {
  const issues: IntervalIssue[] = [];

  if (isNaN(start) || isNaN(end) || isNaN(currentTime)) {
    issues.push({
      reason: 'Invalid time input',
      detail: 'Please enter numeric values for all time fields.',
    });
  }

  const outOfRange = {
    reason: 'Out of range',
    detail: `Times must be between 00:00 (${DAY_START}) and 24:00 (${DAY_END}).`,
  };
  if (start < DAY_START) {
    issues.push({ ...outOfRange, warning: `Start must be ≥ ${DAY_START}.` });
  }
  if (end > DAY_END) {
    issues.push({ ...outOfRange, warning: `End must be ≤ ${DAY_END}.` });
  }

  if (start >= end) {
    issues.push({
      reason: 'Invalid interval',
      detail: 'Start time must be earlier than end time.',
      warning: 'Start must be before end.',
    });
  }

  if (start <= currentTime) {
    issues.push({
      reason: 'In the past',
      detail: `Start time (${minutesToLabel(start)}) must be strictly after the current time (${minutesToLabel(currentTime)}).`,
      warning: 'Start must be after current time.',
    });
  }

  const duration = end - start;
  if (duration > MAX_DURATION_MINUTES) {
    issues.push({
      reason: 'Booking too long',
      detail: `Requested duration is ${minutesToDurationLabel(duration)}. The maximum allowed booking is 2 hours (${MAX_DURATION_MINUTES} minutes).`,
      warning: `Booking exceeds ${MAX_DURATION_MINUTES} minutes.`,
    });
  }

  return issues;
}

export function checkAvailabilityById(rooms: Room[], input: CheckInput): CheckResult {
  const room = rooms.find((r) => r.id === input.roomId);

  if (!room) {
    return {
      decision: 'unavailable',
      reason: 'Unknown room',
      detail: 'The selected room does not exist in the campus directory.',
    };
  }

  return checkAvailability(room, input);
}

export function checkAvailability(room: Room, input: Omit<CheckInput, 'roomId'>): CheckResult {
  const { start, end, currentTime } = input;

  const [firstIssue] = validateInterval({ currentTime, start, end });
  if (firstIssue) {
    return { decision: 'unavailable', reason: firstIssue.reason, detail: firstIssue.detail };
  }

  const duration = end - start;

  if (room.blocked) {
    return {
      decision: 'unavailable',
      reason: 'Room is blocked',
      detail: `${room.name} is currently blocked and cannot be booked.`,
    };
  }

  for (const booking of room.bookings) {
    const overlaps = start < booking.end && end > booking.start;
    if (overlaps) {
      return {
        decision: 'unavailable',
        reason: 'Time conflict',
        detail: `Overlaps existing booking ${minutesToLabel(booking.start)}–${minutesToLabel(booking.end)}. Touching endpoints are allowed.`,
      };
    }
  }

  return {
    decision: 'available',
    reason: 'No conflicts found',
    detail: `${room.name} is free from ${minutesToLabel(start)} to ${minutesToLabel(end)} (${minutesToDurationLabel(duration)}).`,
  };
}
