/**
 * Utilities for famous people page - simulation mapping and website links
 */

import React from 'react';
import { ConditionType } from '../types/visualEffects';

/**
 * Maps simulation types to actual condition IDs for navigation
 * Uses standard vision condition effect IDs that have working YouTube overlays
 */
const simulationMapDef = {
    // ===== COMPLETE BLINDNESS / NO LIGHT PERCEPTION =====
    'complete-blindness': ['completeBlindness'],
    'abraham-dual-attack-blindness': ['nemethComplete'],
    'moon-complete-blindness': ['completeBlindness'],
    'doc-light-perception': ['blurryVision', 'lossOfContrast', 'tunnelVision'],
    'nobuyuki-congenital-blindness': ['completeBlindness'],
    'rahsaan-childhood-blindness': ['completeBlindness'],
    'fanny-iatrogenic-blindness': ['completeBlindness'],
    'homer-traditional-blindness': ['completeBlindness'],
    'david-brown-kawasaki': ['davidKawasakiGlaucomaComplete'],
    'blunkett-congenital-blindness': ['completeBlindness'],
    'saunderson-smallpox-blindness': ['completeBlindness'],
    'holman-complete-blindness': ['completeBlindness'],
    'tiffany-complete-blindness': ['completeBlindness'],
    'ross-complete-blindness': ['completeBlindness'],
    'tofiri-b1-blindness': ['tofiriComplete'],
    'joshua-complete-blindness': ['completeBlindness'],
    'ved-spatial-awareness': ['completeBlindness'],
    'srikanth-complete-blindness': ['completeBlindness'],
    'henry-stroke-blindness': ['completeBlindness'],
    'tilly-complete-blindness': ['completeBlindness'],
    'sabriye-complete-blindness': ['completeBlindness'],
    'haben-deafblind': ['completeBlindness'],

    // ===== RETINITIS PIGMENTOSA (Tunnel Vision) =====
    'paul-retinitis-pigmentosa': ['retinitisPigmentosa', 'nightBlindness'],
    'casey-retinitis-pigmentosa': ['retinitisPigmentosa', 'nightBlindness'],
    'molly-complete-blindness': ['mollyBurkeBlindness'],
    'chris-retinitis-pigmentosa': ['retinitisPigmentosa', 'nightBlindness'],
    'rachael-retinitis-pigmentosa': ['retinitisPigmentosa', 'nightBlindness'],
    'minkara-end-stage-complete': ['retinitisPigmentosa', 'nightBlindness', 'tunnelVision'],
    'erik-retinoschisis-islands': ['retinitisPigmentosa', 'scotoma'],
    'anastasia-stargardt': ['stargardt', 'scotoma', 'lossOfContrast'],

    // ===== GLAUCOMA =====
    'glaucoma-halos progressive-loss': ['glaucoma', 'halos', 'tunnelVision'],
    'acute-glaucoma-attacks': ['glaucoma', 'halos', 'blurryVision'],
    'geerat-congenital-glaucoma': ['glaucoma', 'tunnelVision'],
    'bono-glaucoma-sensitivity': ['glaucoma', 'halos', 'glare'],
    'borges-progressive-blindness': ['glaucoma', 'tunnelVision', 'lossOfContrast'],
    'euler-asymmetric-blindness': ['eulerComplete'],
    'fetty-glaucoma-prosthetic': ['glaucoma', 'blindnessLeftEye'],

    // ===== CATARACTS =====
    'cataracts color-distortion': ['cataracts', 'glare', 'lossOfContrast'],
    'mila-iritis-cataracts': ['milaCompleteVision'],
    'amadou-cataract-progression': ['amadouCataractProgression'],

    // ===== NMO / OPTIC NEURITIS (Christine Ha, Lucy Edwards) =====
    'christine-nmo-complete': ['christineNMOComplete', 'christineFluctuatingVision'],
    'lucy-complete-vision': ['lucyCompleteVision'],

    // ===== MACULAR DEGENERATION / STARGARDT =====
    'judi-amd-progression': ['judiAMDComplete'],
    'georgia-amd-central-loss': ['amd', 'scotoma', 'lossOfContrast'],
    'marla-stargardt-complete': ['stargardt', 'scotoma', 'lossOfContrast'],

    // ===== DIABETIC RETINOPATHY =====
    'ella-diabetic-retinopathy': ['diabeticRetinopathy'],
    'wanda-diabetic-retinopathy': ['diabeticRetinopathy', 'visualFloaters', 'blurryVision'],

    // ===== LIGHT PERCEPTION ONLY =====
    'heather-light-perception': ['heatherLightPerceptionComplete'],

    // ===== FICTIONAL / ENHANCED PERCEPTION =====
    'daredevil-radar-sense': ['daredevilRadarSenseComplete'],
    'geordi-visor-sense': ['geordiVisorSenseComplete'],
    'blindspot-sonar-sense': ['blindspotSonarSenseComplete'],
    'kenshi-telekinetic-sense': ['kenshiTelekineticSenseComplete'],

    // ===== RETINAL DETACHMENT =====
    'sugar-retinal-detachment': ['sugarRetinalDetachmentComplete'],
    'lex-rop': ['lexRecurrentDetachmentCycle'],

    // ===== HEMIANOPIA / PARTIAL VISION LOSS =====
    'david-hemispheric-vision': ['hemianopiaRight', 'blurryVision'],
    'slick-rick-blindness': ['blindnessRightEye'],
    'thurber-eye-injury': ['blindnessLeftEye', 'blurryVision'],
    'jose-cid-monocular': ['joseCidMonocularVision'],

    // ===== KERATOCONUS / ASTIGMATISM =====
    'stephen-keratoconus': ['stephenKeratoconusComplete'],
    'allan-nystagmus': ['astigmatism', 'blurryVision'],

    // ===== TUNNEL VISION (Non-RP) =====
    'harriet-tunnel-vision': ['tunnelVision', 'blurryVision'],

    // ===== VISUAL DISTURBANCES =====
    'sharon-stroke-visual-distortions': ['visualAura', 'hallucinations', 'visualFloaters'],

    // ===== ANIRIDIA =====
    'trischa-aniridia': ['glare', 'blurryVision', 'lossOfContrast'],

    // ===== APHAKIA + GLAUCOMA =====
    'crazzySteve-aphakia-glaucoma': ['crazzysteveComplete', 'tunnelVision'],

    // ===== SOLAR RETINOPATHY =====
    'plateau-solar-retinopathy': ['plateauComplete'],

    // ===== COLOR BLINDNESS =====
    'fred-rogers-deuteranopia': ['deuteranopia'],
    'john-kay-achromatopsia': ['monochromacy'],
    'jonny-greenwood-color-blindness': ['deuteranomaly'],

    // ===== LEGAL BLINDNESS / LOW VISION =====
    'marilee-legal-blindness': ['blurryVision', 'lossOfContrast', 'glare'],

    // ===== OCULAR MYASTHENIA GRAVIS =====
    'anselmo-ocular-myasthenia': ['anselmoOcularMyastheniaComplete'],

    // ===== COMPLEX MULTI-CONDITION =====
    'joyce-progressive-eye-disease': ['glaucoma', 'cataracts', 'blurryVision', 'glare', 'lossOfContrast'],
    'huxley-keratitis': ['cataracts', 'blurryVision', 'glare', 'lossOfContrast', 'blindnessLeftEye'],
    'sartre-monocular-vision': ['blindnessRightEye'],
    'taha-complete-blindness': ['completeBlindness'],
    'nana-myopia-astigmatism': ['astigmatism'],
    'esref-congenital-blindness': ['completeBlindness'],
    'moondog-complete-blindness': ['completeBlindness'],
    'zeeshan-b2-partial-blindness': ['blurryVision', 'lossOfContrast', 'tunnelVision'],
    'chen-complete-blindness': ['completeBlindness'],
    'surdas-complete-blindness': ['completeBlindness'],
    'ravindra-complete-blindness': ['completeBlindness'],
    'kimio-complete-blindness': ['completeBlindness'],
    'diana-complete-blindness': ['completeBlindness'],
    'asik-complete-blindness': ['completeBlindness'],

    // ===== FICTIONAL CHARACTERS (Non-Complete Blindness) =====
    'odin-monocular-vision': ['blindnessLeftEye'],
    'doctor-midnite-photophobia': ['glare', 'blurryVision', 'lossOfContrast'],
    'magoo-severe-myopia': ['blurryVision'],
    'murphy-rp-complete': ['retinitisPigmentosa', 'nightBlindness', 'tunnelVision'],
    'toph-seismic-sense': ['tophSeismicSenseComplete'],
    'neo-matrix-code-vision': ['neoMatrixCodeVisionComplete'],

    // ===== CORRECTED MUSICIANS =====
    'art-partial-blindness': ['cataracts', 'blurryVision', 'glare', 'blindnessLeftEye'],
    'diane-complete-blindness': ['completeBlindness'],
    'jose-complete-blindness': ['completeBlindness'],
    'ronnie-complete-blindness': ['completeBlindness'],
    'jeff-complete-blindness': ['completeBlindness'],

    // ===== OPTIC NEURITIS =====
    'olga-optic-neuritis-blindness': ['completeBlindness'],

    // ===== AGE-RELATED BLINDNESS =====
    'maria-anna-cataracts-blindness': ['cataracts', 'blurryVision', 'lossOfContrast'],

    // ===== BRAZILIAN ATHLETES =====
    'terezinha-rp-blindness': ['retinitisPigmentosa', 'nightBlindness', 'tunnelVision'],
    'silvania-stargardt': ['stargardt', 'scotoma', 'lossOfContrast'],
    'lucia-toxoplasmosis': ['amd', 'scotoma', 'blurryVision'],

    // ===== BRAZILIAN WRITERS =====
    'glauco-glaucoma-blindness': ['glaucoma', 'tunnelVision', 'lossOfContrast'],

    // ===== BULGARIAN =====
    'petko-sympathetic-ophthalmia': ['completeBlindness'],

    // ===== CHILEAN =====
    'cisternas-retinitis-pigmentosa': ['retinitisPigmentosa', 'nightBlindness', 'tunnelVision'],

    // ===== CZECH =====
    'jezek-severe-cataracts': ['cataracts', 'blurryVision', 'lossOfContrast', 'glare'],

    // ===== COLOMBIAN =====
    'mosquera-age-blindness': ['cataracts', 'blurryVision', 'lossOfContrast'],

    // ===== CORRECTED SCIENTISTS =====
    'amy-amd-rp': ['amd', 'scotoma', 'retinitisPigmentosa', 'nightBlindness'],

    // ===== DUTCH =====
    'christina-rubella-blindness': ['cataracts', 'blurryVision', 'lossOfContrast', 'glare', 'blindnessRightEye'],
    'rumphius-glaucoma-blindness': ['glaucoma', 'tunnelVision', 'lossOfContrast'],

    // ===== EGYPTIAN =====
    'harara-traumatic-blindness': ['completeBlindness'],

    // ===== FINNISH =====
    'arvonen-progressive-blindness': ['cataracts', 'amd', 'blurryVision', 'blindnessRightEye'],

    // ===== GUATEMALAN =====
    'larue-legal-blindness': ['blurryVision', 'lossOfContrast'],

    // ===== ICELANDIC =====
    'saeland-cortical-impairment': ['blurryVision', 'lossOfContrast', 'tunnelVision', 'glare'],

    // ===== ISRAELI =====
    'roni-congenital-blindness': ['blindnessLeftEye', 'blurryVision'],

    // ===== MALAWIAN =====
    'taonere-cataract-blindness': ['cataracts', 'blurryVision', 'lossOfContrast'],

    // ===== NEW ZEALAND =====
    'jock-partial-blindness': ['blurryVision', 'glare', 'lossOfContrast'],
    'eddie-congenital-blindness': ['cataracts', 'blurryVision', 'blindnessRightEye'],

    // ===== PAKISTANI =====
    'pirzada-glaucoma': ['glaucoma', 'tunnelVision', 'lossOfContrast'],

    // ===== PERUVIAN =====
    'reiche-progressive-blindness': ['cataracts', 'blurryVision', 'lossOfContrast'],

    // ===== RUSSIAN =====
    'dyozhkin-monocular-vision': ['blindnessLeftEye'],
    'lysova-low-vision': ['blurryVision', 'lossOfContrast'],

    // ===== SOUTH KOREAN =====
    'kwak-monocular-blindness': ['blindnessLeftEye'],

    // ===== SPANISH =====
    'arce-albinism-vision': ['blurryVision', 'lossOfContrast', 'glare'],
    'casinos-diabetic-retinopathy': ['diabeticRetinopathy', 'completeBlindness'],
    'congost-optic-atrophy': ['blurryVision', 'lossOfContrast', 'scotoma'],
    'espina-progressive-blindness': ['cataracts', 'blurryVision', 'lossOfContrast'],
    'margarita-congenital-blindness': ['margaritaLightPerceptionComplete'],

    // ===== SRI LANKAN =====
    'peiris-traumatic-blindness': ['completeBlindness'],

    // ===== SWEDISH =====
    'reichard-retinitis-pigmentosa': ['retinitisPigmentosa', 'tunnelVision', 'lossOfContrast'],
    'tammelin-progressive-blindness': ['blurryVision', 'lossOfContrast', 'cataracts'],

    // ===== SWISS =====
    'huber-progressive-blindness': ['blurryVision', 'lossOfContrast', 'cataracts'],

    // ===== ADDITIONAL MUSICIANS =====
    'dmadness-congenital-blindness': ['completeBlindness'],

    // ===== ADDITIONAL FICTIONAL CHARACTERS =====
    'mo-legal-blindness': ['blurryVision', 'lossOfContrast'],
    'suNianQin-corneal-opacity': ['cataracts', 'blurryVision', 'lossOfContrast'],
    // ===== FICTIONAL ENHANCED PERCEPTION =====
    'fujitora-observation-haki': ['fujitoraObservationHakiComplete'],
    'chirrut-force-perception': ['chirrutForcePerceptionComplete'],
    'julia-carpenter-psychic-web': ['juliaCarpenterPsychicWebComplete'],

    // ===== ANITA LEE BLAIR =====
    'anita-lee-blair-blindness': ['completeBlindness'],

    // ===== YIH-HSING PAO =====
    'yihHsingPao-retinitis-pigmentosa': ['retinitisPigmentosa', 'nightBlindness', 'lossOfContrast'],

    // ===== LEE KAI-LIN =====
    'lee-b2-low-vision': ['blurryVision', 'lossOfContrast'],

    // ===== SERKAN YILDIRIM =====
    'serkan-t12-low-vision': ['blurryVision', 'lossOfContrast'],

    // ===== SEVERE VISION LOSS =====
    'bluay-severe-vision-loss': ['blurryVision', 'lossOfContrast', 'blindnessRightEye']
} as const satisfies Record<string, readonly ConditionType[]>;

/** All valid simulation keys used by PersonData.simulation */
export type SimulationKey = keyof typeof simulationMapDef;

export const simulationMap: Record<SimulationKey, readonly ConditionType[]> = simulationMapDef;

const DEFAULT_FALLBACK_CONDITIONS: ConditionType[] = ['blurryVision', 'lossOfContrast'];

export const getSimulationConditions = (simulation: string): readonly ConditionType[] => {
  return simulationMap[simulation as SimulationKey] || DEFAULT_FALLBACK_CONDITIONS;
};

/**
 * Consolidated person-specific URLs, keyed by personId → domain → URL.
 * Previously scattered across 5 separate maps (TEAM_USA, IMDB, PARALYMPIC, ISHOF, WIKIPEDIA).
 */
const PERSON_LINKS: Record<string, Record<string, string>> = {
  monet: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Claude_Monet' },
  braille: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Louis_Braille' },
  milton: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/John_Milton' },
  galileo: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Galileo_Galilei' },
  tilly: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Tilly_Aston' },
  sabriye: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Sabriye_Tenberken' },
  harriet: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Harriet_Tubman' },
  moon: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/William_Moon' },
  jose: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/José_Feliciano' },
  art: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Art_Tatum' },
  ronnie: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Ronnie_Milsap' },
  doc: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Doc_Watson' },
  jeff: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Jeff_Healey' },
  diane: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Diane_Schuur' },
  nobuyuki: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Nobuyuki_Tsujii' },
  rahsaan: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Rahsaan_Roland_Kirk' },
  borges: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Jorge_Luis_Borges' },
  thurber: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/James_Thurber' },
  fanny: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Fanny_Crosby' },
  homer: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Homer' },
  blunkett: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/David_Blunkett' },
  saunderson: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Nicholas_Saunderson' },
  geerat: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Geerat_Vermeij' },
  gustafDalen: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Gustaf_Dal%C3%A9n' },
  holman: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/James_Holman' },
  jacobBolotin: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Jacob_Bolotin' },
  josephPlateau: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Joseph_Plateau' },
  chris: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Chris_McCausland' },
  blindspot: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Blindspot_(DC_Comics)' },
  kenshi: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Kenshi_(Mortal_Kombat)' },
  neo: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Neo_(The_Matrix)' },
  blinkin: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Robin_Hood:_Men_in_Tights' },
  mrMagoo: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Mr._Magoo' },
  doctorMidNite: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Doctor_Mid-Nite' },
  wallyKarew: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/See_No_Evil,_Hear_No_Evil_(film)' },
  mohammad: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/The_Color_of_Paradise' },
  maryIngalls: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Mary_Ingalls' },
  francisCampbell: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Francis_Joseph_Campbell' },
  anthonyClarke: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Anthony_Clarke_(judoka)' },
  amyBower: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Amy_Bower' },
  floydMorris: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Floyd_Morris' },
  henryFawcett: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Henry_Fawcett' },
  jacquesLusseyran: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Jacques_Lusseyran' },
  belaTheBlind: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/B%C3%A9la_II_of_Hungary' },
  johnOfBohemia: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/John_of_Bohemia' },
  blindLemonJefferson: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Blind_Lemon_Jefferson' },
  charlottaSeuerling: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Charlotta_Seuerling' },
  levPontryagin: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Lev_Pontryagin' },
  garyODonoghue: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Gary_O%27Donoghue' },
  francescoLandini: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Francesco_Landini' },
  garretBarry: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Garret_Barry_(piper)' },
  gurrumulYunupingu: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Geoffrey_Gurrumul_Yunupingu' },
  geraldineLawhorn: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Geraldine_Lawhorn' },
  odin: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Odin' },
  geordi: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Geordi_La_Forge' },
  toph: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Toph_Beifong' },
  chirrutImwe: { 'en.wikipedia.org': 'https://starwars.fandom.com/wiki/Chirrut_%C3%8Emwe', 'starwars.fandom.com': 'https://starwars.fandom.com/wiki/Chirrut_%C3%8Emwe' },
  euler: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Leonhard_Euler' },
  rachael: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Rachael_Leahcar' },
  tiffany: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Tiffany_Brar' },
  wanda: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Wanda_D%C3%ADaz-Merced' },
  fredRogers: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Fred_Rogers' },
  billGates: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Bill_Gates' },
  johnKay: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/John_Kay_(musician)' },
  joaquinRodrigo: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Joaqu%C3%ADn_Rodrigo' },
  jonnyGreenwood: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Jonny_Greenwood' },
  crazzySteve: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Crazzy_Steve' },
  mila: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Mila_Kunis' },
  judi: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Judi_Dench' },
  bono: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Bono' },
  georgia: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Georgia_O%27Keeffe' },
  ella: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Ella_Fitzgerald' },
  sugar: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Sugar_Ray_Leonard' },
  stephen: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Stephen_Curry' },
  allan: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Apl.de.ap' },
  fetty: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Fetty_Wap' },
  slick: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Slick_Rick' },
  abraham: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Abraham_Nemeth' },
  sharon: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Sharon_Stone' },
  daredevil: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Matt_Murdock_(Marvel_Cinematic_Universe)' },
  amadou: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Amadou_%26_Mariam' },
  anselmoRalph: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Anselmo_Ralph' },
  // Fictional characters with movie/show wiki URLs
  moComeAsYouAre: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Come_as_You_Are_(2019_film)', 'imdb.com': 'https://www.imdb.com/title/tt6722726/' },
  suNianQin: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Crush_(2021_TV_series)', 'imdb.com': 'https://www.imdb.com/title/tt15173012/' },
  sofiaInDarkness: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/In_Darkness_(2018_film)' },
  solomonTethered: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Tethered_(film)', 'imdb.com': 'https://www.imdb.com/title/tt14112080/' },
  michelleMcNally: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Black_(2005_film)', 'imdb.com': 'https://www.imdb.com/title/tt0375611/' },
  leonardoWayHeLooks: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/The_Way_He_Looks', 'imdb.com': 'https://www.imdb.com/title/tt1702014/' },
  blindGirlCityLights: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/City_Lights', 'imdb.com': 'https://www.imdb.com/title/tt0021749/' },
  frankSlade: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Scent_of_a_Woman_(1992_film)', 'imdb.com': 'https://www.imdb.com/title/tt0105323/' },
  // Team USA athletes
  marla: { 'en.wikipedia.org': 'https://en.wikipedia.org/wiki/Claude_Monet', 'teamusa.com': 'https://www.teamusa.com/profiles/marla-runyan' },
  anastasia: { 'teamusa.com': 'https://www.teamusa.com/profiles/anastasia-pagonis-1136100' },
  lex: { 'teamusa.com': 'https://www.teamusa.com/profiles/lex-gillette' },
  davidBrown: { 'teamusa.com': 'https://www.teamusa.com/profiles/david-brown' },
  // IMDB-only
  marilee: { 'imdb.com': 'https://www.imdb.com/name/nm3411258/' },
  // Paralympic
  tofiri: { 'paralympic.org': 'https://www.paralympic.org/news/throwback-thursday-uganda-s-tofiri-kibuuka' },
  // ISHOF
  trischa: { 'ishof.org': 'https://ishof.org/honoree/trischa-zorn' },
};

/**
 * Static website URLs that don't require personId (domain → URL)
 */
const STATIC_WEBSITE_URLS: Record<string, string> = {
  'paulcastlestudio.com': 'https://paulcastlestudio.com',
  'theblindcook.com': 'https://www.theblindcook.com/',
  'lucyedwards.com': 'https://www.lucyedwards.com/',
  'governordavidpaterson.com': 'https://governordavidpaterson.com/',
  'nytimes.com': 'https://www.nytimes.com/2013/03/03/nyregion/40-years-after-an-acid-attack-a-life-well-lived.html',
  'monaminkara.com': 'https://monaminkara.com/',
  'erikweihenmayer.com': 'https://erikweihenmayer.com/',
  'womenshistory.org': 'https://www.womenshistory.org/education-resources/biographies/helen-keller',
  'andreabocelli.com': 'https://www.andreabocelli.com/',
  'steviewonder.net': 'https://www.steviewonder.net/',
  'raycharles.com': 'https://raycharles.com/',
  'newyorker.com': 'https://www.newyorker.com/culture/postscript/ved-mehta-1934-2021',
  'disabilitytalent.org': 'https://www.disabilitytalent.org/single-post/2018/10/01/a-vision-for-the-future-an-interview-with-casey-harris-of-x-ambassadors',
  'habengirma.com': 'https://habengirma.com/',
  'mollyburkeofficial.com': 'https://www.mollyburkeofficial.com/',
  'book-of-eli.fandom.com': 'https://book-of-eli.fandom.com/wiki/The_Book_of_Eli',
  'marvel.com': 'https://www.marvel.com/characters/arachne-julia-carpenter',
  'rachaelleahcar.com.au': 'https://rachaelleahcar.com.au/',
  'rossminor.com': 'https://rossminor.com/',
  'misterrogers.org': 'https://www.misterrogers.org/',
  'steppenwolf.com': 'https://steppenwolf.com/pages/john-kay-biography',
  'in-the-dark-cw.fandom.com': 'https://in-the-dark-cw.fandom.com/wiki/Murphy_Mason',
  'onepiece.fandom.com': 'https://onepiece.fandom.com/wiki/Issho',
  'heather-hutchison.com': 'https://www.heather-hutchison.com/',
  'bramblitt.com': 'https://bramblitt.com/',
  'kenyanheroes.com': 'https://kenyanheroes.com/hero/henry-wanyoike/'
};

const DEFAULT_WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/Claude_Monet';
const DEFAULT_TEAM_USA_URL = 'https://www.teamusa.com/profiles/marla-runyan';

/**
 * Builds the complete website map including person-specific URLs.
 * Memoized by personId to avoid rebuilding on repeated calls.
 */
const websiteMapCache = new Map<string, Record<string, string>>();

const buildWebsiteMap = (personId: string): Record<string, string> => {
  const cached = websiteMapCache.get(personId);
  if (cached) return cached;

  const personLinks = PERSON_LINKS[personId] || {};
  const wikiUrl = personLinks['en.wikipedia.org'] || DEFAULT_WIKIPEDIA_URL;
  const map: Record<string, string> = {
    ...STATIC_WEBSITE_URLS,
    'teamusa.com': personLinks['teamusa.com'] || DEFAULT_TEAM_USA_URL,
    'en.wikipedia.org': wikiUrl,
    'starwars.fandom.com': personLinks['starwars.fandom.com'] || wikiUrl,
    'imdb.com': personLinks['imdb.com'] || '',
    'paralympic.org': personLinks['paralympic.org'] || '',
    'ishof.org': personLinks['ishof.org'] || '',
  };
  websiteMapCache.set(personId, map);
  return map;
};

/**
 * Maps website domains to full URLs for person descriptions
 */
export const getWebsiteUrl = (domain: string, personId: string): string => {
  const websiteMap = buildWebsiteMap(personId);
  return websiteMap[domain] || '';
};

/**
 * Parses description text and converts website domains to clickable links
 */
export const parseDescriptionWithLinks = (description: string, personId: string): React.ReactNode[] => {
  const websiteMap = buildWebsiteMap(personId);

  const domainPattern = Object.keys(websiteMap)
    .map(domain => domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  
  const regex = new RegExp(`\\b(${domainPattern})\\b`, 'g');
  
  return description.split(regex).map((part, index) => {
    if (websiteMap[part]) {
      return (
        <a 
          key={index}
          href={websiteMap[part]} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: '#60A5FA', textDecoration: 'underline' }}
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

