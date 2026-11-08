import type { Room } from './types';

export const SAMPLE_ROOMS: Room[] = [
  {
    id: 'a-101',
    name: 'A-101 Lecture Hall',
    building: 'A Building',
    capacity: 120,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'b-204',
    name: 'B-204 Computer Lab',
    building: 'B Building',
    capacity: 40,
    blocked: false,
    bookings: [{ start: 780, end: 840 }],
  },
  {
    id: 'c-310',
    name: 'C-310 Seminar Room',
    building: 'C Building',
    capacity: 16,
    blocked: false,
    bookings: [],
  },
  {
    id: 'd-002',
    name: 'D-002 Media Studio',
    building: 'D Building',
    capacity: 8,
    blocked: true,
    bookings: [],
  },
];
