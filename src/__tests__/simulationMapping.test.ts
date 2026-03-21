import { getSimulationConditions, simulationMap } from '../utils/famousPeopleUtils';
import { VISUAL_EFFECTS } from '../data/visualEffects';
import { personData } from '../data/famousPeople';

const validEffectIds = new Set(VISUAL_EFFECTS.map(e => e.id));

describe('Simulation Mapping', () => {
  test('every person simulation key returns at least one condition', () => {
    const people = Object.entries(personData);
    expect(people.length).toBeGreaterThan(0);

    for (const [, person] of people) {
      const conditions = getSimulationConditions(person.simulation);
      expect(conditions.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('every mapped condition ID resolves to an actual effect', () => {
    const people = Object.entries(personData);
    const unmapped: string[] = [];

    for (const [personId, person] of people) {
      const conditions = getSimulationConditions(person.simulation);
      for (const conditionId of conditions) {
        if (!validEffectIds.has(conditionId)) {
          unmapped.push(`${personId} (simulation="${person.simulation}"): "${conditionId}" not in VISUAL_EFFECTS`);
        }
      }
    }

    expect(unmapped).toEqual([]);
  });

  test('unknown simulation keys return a fallback, not an empty array', () => {
    const fallback = getSimulationConditions('nonexistent-simulation-key');
    expect(fallback.length).toBeGreaterThan(0);
    for (const id of fallback) {
      expect(validEffectIds.has(id)).toBe(true);
    }
  });

  test('every person simulation key exists in the simulation map', () => {
    const missing: string[] = [];

    for (const [personId, person] of Object.entries(personData)) {
      if (!(person.simulation in simulationMap)) {
        missing.push(`${personId} (simulation="${person.simulation}")`);
      }
    }

    expect(missing).toEqual([]);
  });
});
