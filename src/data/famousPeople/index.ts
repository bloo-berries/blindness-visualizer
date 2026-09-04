import { PersonData, PersonCategory } from './types';
import { contemporaryFigures } from './contemporaryFigures';
import { athletes } from './athletes';
import { scientists } from './scientists';
import { musicians } from './musicians';
import { artists } from './artists';
import { writersActivists } from './writersActivists';
import { historicalFigures } from './historicalFigures';
import { fictionalCharacters } from './fictionalCharacters';

export type { PersonData };

export const personData: Record<string, PersonData> = {
  ...contemporaryFigures,
  ...athletes,
  ...scientists,
  ...musicians,
  ...artists,
  ...writersActivists,
  ...historicalFigures,
  ...fictionalCharacters
};

export const categories: PersonCategory[] = [
  { id: "contemporaryFigures", name: "Contemporary Figures", people: Object.keys(contemporaryFigures) },
  { id: "athletes", name: "Athletes", people: Object.keys(athletes) },
  { id: "scientists", name: "Scientists & Medical Professionals", people: Object.keys(scientists) },
  { id: "musicians", name: "Musicians", people: Object.keys(musicians) },
  { id: "artists", name: "Artists", people: Object.keys(artists) },
  { id: "writersActivists", name: "Writers, Activists, Politicians", people: Object.keys(writersActivists) },
  { id: "historicalFigures", name: "Historical Figures", people: Object.keys(historicalFigures) },
  { id: "fictionalCharacters", name: "Fictional Characters", people: Object.keys(fictionalCharacters) }
];
