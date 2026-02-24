/**
 * Centralized image path utilities
 * 
 * IMPORTANT: All images must be placed in public/images/people/ (NOT build/images/people/)
 * The build folder is auto-generated from public/ during the build process.
 * During development, files are served from public/ at the root path.
 * 
 * This utility ensures a single source of truth for all image paths.
 */

/**
 * Base URL for public assets (handles both development and production)
 */
const getBaseUrl = (): string => {
  return process.env.PUBLIC_URL || '';
};

/**
 * Base path for people images
 * Source: public/images/people/
 * Served at: /images/people/ (or {PUBLIC_URL}/images/people/ in production)
 */
const PEOPLE_IMAGES_BASE = '/images/people/';

/**
 * Get the full path to a people image
 * @param filename - The image filename (e.g., 'john-milton.webp')
 * @returns Full path to the image (e.g., '/images/people/john-milton.webp')
 */
export const getPeopleImagePath = (filename: string): string => {
  return `${getBaseUrl()}${PEOPLE_IMAGES_BASE}${filename}`;
};

/**
 * Map of person IDs to their image filenames
 * This is the single source of truth for all people image mappings
 */
export const PEOPLE_IMAGE_MAP: Record<string, string> = {
  milton: 'john-milton.webp',
  braille: 'louis-Braille.webp',
  galileo: 'Galileo-Galilei.webp',
  ray: 'ray-charles.webp',
  stevie: 'stevie-wonder.webp',
  helen: 'hellen-keller.webp',
  bocelli: 'Andrea-Bocelli.webp',
  monet: 'claude-monet.webp',
  christine: 'christine-ha.webp',
  ved: 'Ved-Mehta.webp',
  erik: 'Erik-Weihenmayer.webp',
  marla: 'Marla-Runyan.webp',
  mona: 'Mona-Minkara.webp',
  joshua: 'Joshua-Miele.webp',
  lucy: 'Lucy-Edwards.webp',
  paterson: 'David-Paterson.webp',
  paul: 'paul-castle.webp',
  harriet: 'harriet-tubman.webp',
  casey: 'casey-harris.webp',
  haben: 'haben-girma.webp',
  molly: 'molly-burke.webp',
  tilly: 'tilly-aston.webp',
  sabriye: 'Sabriye-Tenberken.webp',
  anastasia: 'Anastasia-Pagonis.webp',
  mila: 'mila-kunis.webp',
  judi: 'judi-dench.webp',
  bono: 'bono.webp',
  georgia: 'Georgia-OKeeffe.webp',
  ella: 'Ella-Fitzgerald.webp',
  sugar: 'sugar-ray-leonard.webp',
  stephen: 'stephen-curry.webp',
  allan: 'allan-pineda-lindo.webp',
  fetty: 'fetty-wap.webp',
  slick: 'slick-rick.webp',
  abraham: 'abraham-nemeth.webp',
  moon: 'william-moon.webp',
  sharon: 'sharon-stone.webp',
  jose: 'Jose-Feliciano.webp',
  art: 'art-tatum.webp',
  ronnie: 'ronnie-milsap.webp',
  doc: 'doc-watson.webp',
  jeff: 'jeff-healy.webp',
  diane: 'Diane-Schuur.webp',
  nobuyuki: 'Nobuyuki-Tsujii.webp',
  rahsaan: 'Rahsaan-Roland-Kirk.webp',
  borges: 'Jorge-Luis-Borges.webp',
  thurber: 'james-thurber.webp',
  fanny: 'Fanny-Crosby.webp',
  homer: 'homer.webp',
  lex: 'lex-gilette.webp',
  davidBrown: 'david-brown.webp',
  blunkett: 'david-blunkett.webp',
  saunderson: 'Nicolas-Saunderson.webp',
  geerat: 'Geerat-Vermeij.webp',
  holman: 'james-holman.webp',
  chris: 'chris-mccausland.webp',
  odin: 'Odin.webp',
  geordi: 'GeordiLaForge.webp',
  toph: 'Toph.webp',
  daredevil: 'mattmurdock.webp',
  blindspot: 'blind-spot.webp',
  kenshi: 'kenshi.webp',
  neo: 'neo.webp',
  eli: 'eli.webp',
  blinkin: 'blinkin.webp',
  juliaCarpenter: 'julia-carpenter.webp',
  mrMagoo: 'mr-magoo.webp',
  doctorMidNite: 'dr-mid-nite.webp',
  wallyKarew: 'wally-karew.webp',
  mohammad: 'mohammad-color-paradise.webp',
  chirrutImwe: 'Chirrut-Îmwe.webp',
  maryIngalls: 'mary-ingalls.webp',
  francisCampbell: 'francis-joseph-campbell.webp',
  anthonyClarke: 'anthony-clarke.webp',
  amyBower: 'amy-bower.webp',
  floydMorris: 'floyd-morris.webp',
  blindLemonJefferson: 'Blindlemonjefferson.webp',
  charlottaSeuerling: 'charlotta-seuerling.webp',
  crazzySteve: 'crazzy-steve.webp',
  belaTheBlind: 'bela-the-blind.webp',
  levPontryagin: 'lev-pontryagin.webp',
  garyODonoghue: 'Gary-ODonoghue.webp',
  francescoLandini: 'francesco-landini.webp',
  garretBarry: 'garret-barry.webp',
  gurrumulYunupingu: 'Geoffrey-Gurrumul-Yunupingu.webp',
  geraldineLawhorn: 'Geraldine-Lawhorn.webp',
  murphyMason: 'murphy-mason.webp',
  fujitora: 'Issho.webp',
  gustafDalen: 'Gustaf-Dalen.webp',
  jacobBolotin: 'jacob-bolotin.webp',
  heatherHutchison: 'Heather-Hutchison.webp',
  joaquinRodrigo: 'Joaquin-Rodrigo.webp',
  johnBramblitt: 'John-Bramblitt.webp',
  jacquesLusseyran: 'Jacques-Lusseyran.webp',
  johnOfBohemia: 'john-of-bohemia.webp',
  josephPlateau: 'joseph-plateau.webp',
  henryFawcett: 'Henry-Fawcett.webp',
  euler: 'Leonhard-Euler.webp',
  marilee: 'marilee-talkington.webp',
  rachael: 'Rachael-Leahcar.webp',
  tiffany: 'Tiffany-Brar.webp',
  ross: 'ross-minor.webp',
  tofiri: 'Tofiri-Kibuuka.webp',
  trischa: 'Trischa-Zorn.webp',
  wanda: 'wanda-diaz-merced.webp',
  fredRogers: 'fred-rogers.webp',
  billGates: 'bill-gates.webp',
  johnKay: 'John-Kay.webp',
  jonnyGreenwood: 'Jonny-Greenwood.webp',
  amadou: 'Amadou-Bagayoko.webp',
  srikanth: 'srikanth-bolla.webp',
  henry: 'henry-wanyoike.webp',
  jamesJoyce: 'james-joyce.webp',
  aldousHuxley: 'aldous-huxley.webp',
  jeanPaulSartre: 'jean-paul-sartre.webp',
  tahaHussein: 'Taha-Hussein.webp',
  nanaMouskouri: 'Nana-Mouskouri.webp',
  esrefArmagan: 'Esref-Armagan.webp',
  moondog: 'moondog.webp',
  zeeshanAbbasi: 'Zeeshan-Abbasi.webp',
  chenGuangcheng: 'Chen-Guangcheng.webp',
  surdas: 'surdas.webp',
  ravindraJain: 'ravindra-jain.webp',
  kimioEto: 'Kimio-Eto.webp',
  dianaGurtskaya: 'Diana-Gurtskaya.webp',
  asikVeysel: 'Asik-Veyel.webp',
  joseCid: 'jose-cid.webp',
  bluay: 'bluay.webp'
};

/**
 * Get the full image path for a person by their ID
 * @param personId - The person's ID (e.g., 'milton', 'stevie')
 * @returns Full path to the person's image, or a placeholder if not found
 */
export const getPersonImagePath = (personId: string): string => {
  const filename = PEOPLE_IMAGE_MAP[personId];
  if (!filename) {
    // Return placeholder if person ID not found
    return `https://via.placeholder.com/300x400/cccccc/666666?text=Image+Not+Found`;
  }
  return getPeopleImagePath(filename);
};

