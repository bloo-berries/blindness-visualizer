import { PersonData, PersonCategory } from './types';
import { contemporaryFigures } from './contemporaryFigures';
import { athletes } from './athletes';
import { scientists } from './scientists';
import { musicians } from './musicians';
import { artists } from './artists';
import { writersActivists } from './writersActivists';
import { historicalFigures } from './historicalFigures';
import { fictionalCharacters } from './fictionalCharacters';

export type { PersonData, PersonCategory };
export { contemporaryFigures };
export { athletes };
export { scientists };
export { musicians };
export { artists };
export { writersActivists };
export { historicalFigures };
export { fictionalCharacters };

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
  { name: "Contemporary Figures", people: ["christine", "lucy", "paul", "haben", "molly", "mila", "judi", "sharon", "chris", "marilee", "fredRogers"] },
  { name: "Athletes", people: ["erik", "marla", "anastasia", "sugar", "stephen", "lex", "davidBrown", "anthonyClarke", "crazzySteve", "tofiri", "ross", "trischa"] },
  { name: "Scientists & Medical Professionals", people: ["mona", "joshua", "geerat", "amyBower", "gustafDalen", "jacobBolotin", "josephPlateau", "euler", "wanda", "abraham"] },
  { name: "Musicians", people: ["ray", "stevie", "bocelli", "casey", "bono", "ella", "allan", "fetty", "slick", "jose", "art", "ronnie", "doc", "jeff", "diane", "nobuyuki", "rahsaan", "blindLemonJefferson", "charlottaSeuerling", "francescoLandini", "garretBarry", "gurrumulYunupingu", "geraldineLawhorn", "heatherHutchison", "joaquinRodrigo", "rachael", "johnKay", "jonnyGreenwood", "amadou"] },
  { name: "Artists", people: ["monet", "georgia", "johnBramblitt"] },
  { name: "Writers, Activists, Politicians", people: ["helen", "ved", "tilly", "sabriye", "borges", "thurber", "levPontryagin", "garyODonoghue", "paterson", "blunkett", "floydMorris", "henryFawcett", "jacquesLusseyran", "tiffany"] },
  { name: "Historical Figures", people: ["milton", "braille", "galileo", "harriet", "moon", "homer", "fanny", "saunderson", "holman", "maryIngalls", "francisCampbell", "belaTheBlind", "johnOfBohemia"] },
  { name: "Fictional Characters", people: ["odin", "daredevil", "geordi", "blindspot", "toph", "kenshi", "neo", "eli", "blinkin", "juliaCarpenter", "mrMagoo", "doctorMidNite", "wallyKarew", "mohammad", "chirrutImwe", "murphyMason", "fujitora"] }
];
