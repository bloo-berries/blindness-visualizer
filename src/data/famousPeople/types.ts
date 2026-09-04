import type { SimulationKey } from '../../utils/famousPeopleUtils';

export interface PersonData {
  name: string;
  achievement?: string;
  condition: string;
  years: string;
  onset: string;
  simulation: SimulationKey;
  description: string;
  wikiUrl?: string;
  /** Per-person URL map: domain → full URL, used for description link-ification */
  links?: Record<string, string>;
  nationality: {
    country: string;
    flag: string;
  };
}

export interface PersonCategory {
  id: string;
  name: string;
  people: string[];
}
