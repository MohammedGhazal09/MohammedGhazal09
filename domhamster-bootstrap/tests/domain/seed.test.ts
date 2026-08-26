import { describe, expect, it } from 'vitest';
import { CANONICAL_SCENARIO } from '../../src/domain/seed';

describe('canonical scenario', () => {
  it('contains exactly eight requests and five volunteers with unique stable IDs', () => {
    expect(CANONICAL_SCENARIO.requests).toHaveLength(8);
    expect(CANONICAL_SCENARIO.volunteers).toHaveLength(5);
    expect(new Set(CANONICAL_SCENARIO.requests.map(({ id }) => id)).size).toBe(8);
    expect(new Set(CANONICAL_SCENARIO.volunteers.map(({ id }) => id)).size).toBe(5);
    expect(CANONICAL_SCENARIO.requests.map(({ id }) => id)).toEqual([
      'R-101',
      'R-102',
      'R-103',
      'R-104',
      'R-105',
      'R-106',
      'R-107',
      'R-108',
    ]);
    expect(CANONICAL_SCENARIO.volunteers.map(({ id }) => id)).toEqual([
      'V-01',
      'V-02',
      'V-03',
      'V-04',
      'V-05',
    ]);
  });
});
