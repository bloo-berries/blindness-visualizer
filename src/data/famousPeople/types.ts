export interface PersonData {
  name: string;
  achievement?: string;
  condition: string;
  years: string;
  onset: string;
  simulation: string;
  description: string;
  wikiUrl?: string;
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
