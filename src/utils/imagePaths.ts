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
 * @param filename - The image filename (e.g., 'john-milton.jpg')
 * @returns Full path to the image (e.g., '/images/people/john-milton.jpg')
 */
export const getPeopleImagePath = (filename: string): string => {
  return `${getBaseUrl()}${PEOPLE_IMAGES_BASE}${filename}`;
};

/**
 * Map of person IDs to their image filenames
 * This is the single source of truth for all people image mappings
 */
export const PEOPLE_IMAGE_MAP: Record<string, string> = {
  milton: 'john-milton.jpg',
  braille: 'louis-Braille.jpg',
  galileo: 'Galileo-Galilei.jpg',
  ray: 'ray-charles.jpg',
  stevie: 'stevie-wonder.jpg',
  helen: 'hellen-keller.jpg',
  bocelli: 'Andrea-Bocelli.jpg',
  monet: 'claude-monet.jpg',
  christine: 'christine-ha.webp',
  ved: 'Ved-Mehta.png',
  erik: 'Erik-Weihenmayer.webp',
  marla: 'Marla-Runyan.webp',
  mona: 'Mona-Minkara.webp',
  joshua: 'Joshua-Miele.webp',
  lucy: 'Lucy-Edwards.webp',
  paterson: 'David-Paterson.webp',
  paul: 'paul-castle.png',
  harriet: 'harriet-tubman.png',
  casey: 'casey-harris.png',
  haben: 'haben-girma.png',
  molly: 'molly-burke.png',
  tilly: 'tilly-aston.png',
  sabriye: 'Sabriye-Tenberken.png',
  anastasia: 'Anastasia-Pagonis.png',
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
  moon: 'william-moon.jpg',
  sharon: 'sharon-stone.webp',
  jose: 'Jose-Feliciano.jpg',
  art: 'art-tatum.jpg',
  ronnie: 'ronnie-milsap.webp',
  doc: 'doc-watson.jpg',
  jeff: 'jeff-healy.webp',
  diane: 'Diane-Schuur.webp',
  nobuyuki: 'Nobuyuki-Tsujii.webp',
  rahsaan: 'Rahsaan-Roland-Kirk.jpg',
  borges: 'Jorge-Luis-Borges.jpg',
  thurber: 'james-thurber.jpg',
  fanny: 'Fanny-Crosby.jpg',
  homer: 'homer.jpg',
  lex: 'lex-gilette.jpeg',
  davidBrown: 'david-brown.avif',
  blunkett: 'david-blunkett.jpg',
  saunderson: 'Nicolas-Saunderson.jpg',
  geerat: 'Geerat-Vermeij.webp',
  holman: 'james-holman.jpg',
  chris: 'chris-mccausland.webp',
  odin: 'Odin.jpg',
  geordi: 'GeordiLaForge.jpg',
  toph: 'Toph.webp',
  daredevil: 'mattmurdock.webp',
  blindspot: 'blind-spot.png',
  kenshi: 'kenshi.webp',
  neo: 'neo.webp',
  eli: 'eli.webp',
  blinkin: 'blinkin.webp',
  juliaCarpenter: 'julia-carpenter.webp',
  mrMagoo: 'mr-magoo.webp',
  doctorMidNite: 'dr-mid-nite.webp',
  wallyKarew: 'wally-karew.png',
  mohammad: 'mohammad-color-paradise.webp',
  chirrutImwe: 'Chirrut-Îmwe.webp',
  maryIngalls: 'mary-ingalls.jpg',
  francisCampbell: 'francis-joseph-campbell.webp',
  anthonyClarke: 'anthony-clarke.jpg',
  amyBower: 'amy-bower.jpg',
  floydMorris: 'floyd-morris.jpeg',
  blindLemonJefferson: 'Blindlemonjefferson.jpg',
  charlottaSeuerling: 'charlotta-seuerling.webp',
  crazzySteve: 'crazzy-steve.webp',
  belaTheBlind: 'bela-the-blind.jpg',
  levPontryagin: 'lev-pontryagin.webp',
  garyODonoghue: 'Gary-ODonoghue.webp',
  francescoLandini: 'francesco-landini.webp',
  garretBarry: 'garret-barry.jpg',
  gurrumulYunupingu: 'Geoffrey-Gurrumul-Yunupingu.webp',
  geraldineLawhorn: 'Geraldine-Lawhorn.jpg',
  murphyMason: 'murphy-mason.webp',
  fujitora: 'Issho.webp',
  gustafDalen: 'Gustaf-Dalen.jpg',
  jacobBolotin: 'jacob-bolotin.jpg',
  heatherHutchison: 'Heather-Hutchison.webp',
  joaquinRodrigo: 'Joaquin-Rodrigo.webp',
  johnBramblitt: 'John-Bramblitt.webp',
  jacquesLusseyran: 'Jacques-Lusseyran.png',
  johnOfBohemia: 'john-of-bohemia.jpg',
  josephPlateau: 'joseph-plateau.webp',
  henryFawcett: 'Henry-Fawcett.jpg',
  euler: 'Leonhard-Euler.jpg',
  marilee: 'marilee-talkington.webp',
  rachael: 'Rachael-Leahcar.webp',
  tiffany: 'Tiffany-Brar.jpg',
  ross: 'ross-minor.jpeg',
  tofiri: 'Tofiri-Kibuuka.webp',
  trischa: 'Trischa-Zorn.jpeg'
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

