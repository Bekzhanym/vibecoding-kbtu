import { describe, it, expect } from 'vitest';
import { checkAvailabilityById as checkAvailability } from '@/lib/checker';
import { SAMPLE_ROOMS } from '@/lib/data';

const check = (roomId: string, currentTime: number, start: number, end: number) =>
  checkAvailability(SAMPLE_ROOMS, { roomId, currentTime, start, end });

describe('AC1: time range and ordering', () => {
  it('rejects a start equal to the current time', () => {
    expect(check('c-310', 540, 540, 570)).toMatchObject({
      decision: 'unavailable',
      reason: 'In the past',
    });
  });

  it('accepts a start one minute after the current time', () => {
    expect(check('c-310', 540, 541, 570)).toMatchObject({ decision: 'available' });
  });

  it('rejects an end time after 1440', () => {
    expect(check('c-310', 480, 1400, 1441)).toMatchObject({
      decision: 'unavailable',
      reason: 'Out of range',
    });
  });

  it('rejects a start equal to the end', () => {
    expect(check('c-310', 480, 600, 600)).toMatchObject({
      decision: 'unavailable',
      reason: 'Invalid interval',
    });
  });

  it('rejects a start later than the end', () => {
    expect(check('c-310', 480, 700, 650)).toMatchObject({
      decision: 'unavailable',
      reason: 'Invalid interval',
    });
  });
});

describe('AC2: maximum booking length', () => {
  it('accepts a 120 minute booking', () => {
    expect(check('c-310', 480, 720, 840)).toMatchObject({ decision: 'available' });
  });

  it('rejects a 121 minute booking', () => {
    expect(check('c-310', 480, 720, 841)).toMatchObject({
      decision: 'unavailable',
      reason: 'Booking too long',
    });
  });
});

describe('AC3: blocked rooms', () => {
  it('rejects any booking in blocked room D-002', () => {
    expect(check('d-002', 480, 660, 720)).toMatchObject({
      decision: 'unavailable',
      reason: 'Room is blocked',
    });
  });
});

describe('AC4: overlapping bookings', () => {
  it('accepts a booking that starts exactly when an existing booking ends', () => {
    expect(check('a-101', 480, 660, 720)).toMatchObject({ decision: 'available' });
  });

  it('rejects a booking that overlaps an existing booking', () => {
    expect(check('a-101', 480, 630, 690)).toMatchObject({
      decision: 'unavailable',
      reason: 'Time conflict',
    });
  });
});

describe('AC5: booking data is never changed', () => {
  it('leaves SAMPLE_ROOMS identical after several checks', () => {
    const before = structuredClone(SAMPLE_ROOMS);

    check('a-101', 480, 630, 690);
    check('a-101', 480, 660, 720);
    check('d-002', 480, 660, 720);
    check('c-310', 540, 541, 570);
    check('c-310', 480, 720, 841);
    check('unknown', 480, 600, 660);

    expect(SAMPLE_ROOMS).toEqual(before);
  });
});
