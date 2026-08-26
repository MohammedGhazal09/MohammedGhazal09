import {
  localTime,
  requestId,
  scenarioDate,
  volunteerId,
  type Assignment,
  type PrivateContact,
  type Request,
  type Scenario,
  type ScenarioPayload,
  type Volunteer,
} from './types.ts';

const note = (text: string) => ({ text, trust: 'UNTRUSTED' }) as const;

const requests = [
  {
    id: requestId('R-101'),
    category: 'FOOD_DELIVERY',
    priority: 'URGENT',
    zone: 'CENTRAL',
    windowStart: localTime('09:00'),
    windowEnd: localTime('10:30'),
    durationMinutes: 45,
    requiredSkills: ['FOOD_DELIVERY'],
    requiredLanguages: ['AR'],
    note: note('Deliver one food box; side entrance.'),
    status: 'OPEN',
  },
  {
    id: requestId('R-102'),
    category: 'SUPPLY_PICKUP',
    priority: 'HIGH',
    zone: 'EAST',
    windowStart: localTime('09:30'),
    windowEnd: localTime('11:00'),
    durationMinutes: 45,
    requiredSkills: ['SUPPLY_PICKUP'],
    requiredLanguages: ['EN'],
    note: note('Collect household essentials from the community desk.'),
    status: 'OPEN',
  },
  {
    id: requestId('R-103'),
    category: 'MOBILITY_SUPPORT',
    priority: 'HIGH',
    zone: 'SOUTH',
    windowStart: localTime('10:00'),
    windowEnd: localTime('11:30'),
    durationMinutes: 60,
    requiredSkills: ['MOBILITY_SUPPORT'],
    requiredLanguages: ['AR'],
    note: note('Non-emergency accompaniment to the community center.'),
    status: 'OPEN',
  },
  {
    id: requestId('R-104'),
    category: 'FOOD_DELIVERY',
    priority: 'URGENT',
    zone: 'NORTH',
    windowStart: localTime('10:00'),
    windowEnd: localTime('11:15'),
    durationMinutes: 45,
    requiredSkills: ['FOOD_DELIVERY'],
    requiredLanguages: ['AR'],
    note: note('Arabic-speaking volunteer requested.'),
    status: 'OPEN',
  },
  {
    id: requestId('R-105'),
    category: 'DIGITAL_HELP',
    priority: 'NORMAL',
    zone: 'CENTRAL',
    windowStart: localTime('11:00'),
    windowEnd: localTime('14:00'),
    durationMinutes: 60,
    requiredSkills: ['DIGITAL_HELP'],
    requiredLanguages: ['EN'],
    note: note('Help configure accessibility settings on a demo tablet.'),
    status: 'OPEN',
  },
  {
    id: requestId('R-106'),
    category: 'TUTORING',
    priority: 'NORMAL',
    zone: 'EAST',
    windowStart: localTime('13:00'),
    windowEnd: localTime('14:30'),
    durationMinutes: 60,
    requiredSkills: ['TUTORING'],
    requiredLanguages: ['EN'],
    note: note('Homework support at the community learning room.'),
    status: 'OPEN',
  },
  {
    id: requestId('R-107'),
    category: 'SUPPLY_PICKUP',
    priority: 'HIGH',
    zone: 'CENTRAL',
    windowStart: localTime('10:30'),
    windowEnd: localTime('12:00'),
    durationMinutes: 45,
    requiredSkills: ['SUPPLY_PICKUP'],
    requiredLanguages: ['AR'],
    note: note('Pick up pantry supplies before noon.'),
    status: 'OPEN',
  },
  {
    id: requestId('R-108'),
    category: 'FOOD_DELIVERY',
    priority: 'HIGH',
    zone: 'SOUTH',
    windowStart: localTime('12:00'),
    windowEnd: localTime('13:30'),
    durationMinutes: 45,
    requiredSkills: ['FOOD_DELIVERY'],
    requiredLanguages: ['UR'],
    note: note('Urdu-speaking volunteer preferred for delivery handoff.'),
    status: 'OPEN',
  },
] as const satisfies readonly Request[];

const volunteers = [
  {
    id: volunteerId('V-01'),
    displayName: 'Aisha',
    availabilityStart: localTime('08:30'),
    availabilityEnd: localTime('12:30'),
    skills: ['FOOD_DELIVERY', 'SUPPLY_PICKUP'],
    languages: ['AR', 'EN'],
    serviceZones: ['CENTRAL', 'NORTH'],
    taskLimit: 3,
  },
  {
    id: volunteerId('V-02'),
    displayName: 'Omar',
    availabilityStart: localTime('09:00'),
    availabilityEnd: localTime('14:00'),
    skills: ['MOBILITY_SUPPORT', 'FOOD_DELIVERY'],
    languages: ['AR', 'EN'],
    serviceZones: ['SOUTH', 'CENTRAL', 'NORTH'],
    taskLimit: 3,
  },
  {
    id: volunteerId('V-03'),
    displayName: 'Sara',
    availabilityStart: localTime('10:30'),
    availabilityEnd: localTime('15:00'),
    skills: ['DIGITAL_HELP', 'TUTORING'],
    languages: ['EN'],
    serviceZones: ['CENTRAL', 'EAST'],
    taskLimit: 3,
  },
  {
    id: volunteerId('V-04'),
    displayName: 'Bilal',
    availabilityStart: localTime('09:00'),
    availabilityEnd: localTime('14:00'),
    skills: ['FOOD_DELIVERY', 'SUPPLY_PICKUP'],
    languages: ['EN', 'UR'],
    serviceZones: ['EAST', 'SOUTH'],
    taskLimit: 3,
  },
  {
    id: volunteerId('V-05'),
    displayName: 'Noor',
    availabilityStart: localTime('09:00'),
    availabilityEnd: localTime('15:00'),
    skills: ['TUTORING', 'SUPPLY_PICKUP'],
    languages: ['AR', 'EN'],
    serviceZones: ['CENTRAL', 'EAST', 'NORTH'],
    taskLimit: 3,
  },
] as const satisfies readonly Volunteer[];

const privateContacts = requests.map(
  (request): PrivateContact => ({
    fictional: true,
    requestId: request.id,
    recipientAlias: `Demo recipient ${request.id}`,
    fictionalLocation: `Demo location ${request.id} — ${request.zone.toLowerCase()} handoff point`,
    fictionalContactChannel: `demo-channel-${request.id.toLowerCase()}`,
    boundedInstructions: request.note.text,
  }),
);

export const CANONICAL_SCENARIO_PAYLOAD = {
  fixtureVersion: '2026-09-01.1',
  scenarioDate: scenarioDate('2026-09-01'),
  timeZone: 'Asia/Riyadh',
  policy: {
    maxTasksPerVolunteer: 3,
    priorityOrder: ['URGENT', 'HIGH', 'NORMAL'],
    unassignedRequestsAllowed: true,
    unassignedRequestsProduceWarnings: true,
  },
  requests,
  volunteers,
  privateContacts,
} as const satisfies ScenarioPayload;

export const EXPECTED_CANONICAL_HASH = '0'.repeat(64);

function deepFreeze<Value>(value: Value): Value {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreeze(child);
  }

  return Object.freeze(value);
}

export const CANONICAL_SCENARIO: Scenario = deepFreeze({
  ...CANONICAL_SCENARIO_PAYLOAD,
  canonicalHash: EXPECTED_CANONICAL_HASH,
});

export const CANONICAL_BASELINE_ASSIGNMENTS: readonly Assignment[] = deepFreeze([
  {
    requestId: requestId('R-101'),
    volunteerId: volunteerId('V-01'),
    startTime: localTime('09:00'),
    endTime: localTime('09:45'),
  },
  {
    requestId: requestId('R-102'),
    volunteerId: volunteerId('V-04'),
    startTime: localTime('09:30'),
    endTime: localTime('10:15'),
  },
  {
    requestId: requestId('R-103'),
    volunteerId: volunteerId('V-02'),
    startTime: localTime('10:00'),
    endTime: localTime('11:00'),
  },
  {
    requestId: requestId('R-104'),
    volunteerId: volunteerId('V-01'),
    startTime: localTime('10:00'),
    endTime: localTime('10:45'),
  },
  {
    requestId: requestId('R-105'),
    volunteerId: volunteerId('V-03'),
    startTime: localTime('11:00'),
    endTime: localTime('12:00'),
  },
  {
    requestId: requestId('R-106'),
    volunteerId: volunteerId('V-03'),
    startTime: localTime('13:00'),
    endTime: localTime('14:00'),
  },
  {
    requestId: requestId('R-107'),
    volunteerId: volunteerId('V-05'),
    startTime: localTime('10:30'),
    endTime: localTime('11:15'),
  },
  {
    requestId: requestId('R-108'),
    volunteerId: volunteerId('V-04'),
    startTime: localTime('12:00'),
    endTime: localTime('12:45'),
  },
]);
