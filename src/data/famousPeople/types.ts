export interface PersonData {
  name: string;
  condition: string;
  years: string;
  onset: string;
  simulation: string;
  description: string;
  wikiUrl?: string;
}

export interface PersonCategory {
  id: string;
  name: string;
  people: string[];
}
