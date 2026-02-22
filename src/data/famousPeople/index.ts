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
  { id: "contemporaryFigures", name: "Contemporary Figures", people: ["christine", "lucy", "paul", "haben", "molly", "mila", "judi", "sharon", "chris", "marilee", "fredRogers", "srikanth"] },
  { id: "athletes", name: "Athletes", people: ["erik", "marla", "anastasia", "sugar", "stephen", "lex", "davidBrown", "anthonyClarke", "crazzySteve", "tofiri", "ross", "trischa", "henry", "zeeshanAbbasi"] },
  { id: "scientists", name: "Scientists & Medical Professionals", people: ["mona", "joshua", "geerat", "amyBower", "gustafDalen", "jacobBolotin", "josephPlateau", "euler", "wanda", "abraham"] },
  { id: "musicians", name: "Musicians", people: ["ray", "stevie", "bocelli", "casey", "bono", "ella", "allan", "fetty", "slick", "jose", "art", "ronnie", "doc", "jeff", "diane", "nobuyuki", "rahsaan", "blindLemonJefferson", "charlottaSeuerling", "francescoLandini", "garretBarry", "gurrumulYunupingu", "geraldineLawhorn", "heatherHutchison", "joaquinRodrigo", "rachael", "johnKay", "jonnyGreenwood", "amadou", "nanaMouskouri", "moondog", "ravindraJain", "kimioEto", "dianaGurtskaya", "asikVeysel"] },
  { id: "artists", name: "Artists", people: ["monet", "georgia", "johnBramblitt", "esrefArmagan"] },
  { id: "writersActivists", name: "Writers, Activists, Politicians", people: ["helen", "ved", "tilly", "sabriye", "borges", "thurber", "levPontryagin", "garyODonoghue", "paterson", "blunkett", "floydMorris", "henryFawcett", "jacquesLusseyran", "tiffany", "jamesJoyce", "aldousHuxley", "jeanPaulSartre", "tahaHussein", "chenGuangcheng"] },
  { id: "historicalFigures", name: "Historical Figures", people: ["milton", "braille", "galileo", "harriet", "moon", "homer", "fanny", "saunderson", "holman", "maryIngalls", "francisCampbell", "belaTheBlind", "johnOfBohemia", "surdas"] },
  { id: "fictionalCharacters", name: "Fictional Characters", people: ["odin", "daredevil", "geordi", "blindspot", "toph", "kenshi", "neo", "eli", "blinkin", "juliaCarpenter", "mrMagoo", "doctorMidNite", "wallyKarew", "mohammad", "chirrutImwe", "murphyMason", "fujitora"] }
];
