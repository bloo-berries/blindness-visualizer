/**
 * Utilities for famous people page - simulation mapping and website links
 */

import React from 'react';

/**
 * Maps simulation types to actual condition IDs for navigation
 * Uses standard vision condition effect IDs that have working YouTube overlays
 */
export const getSimulationConditions = (simulation: string): string[] => {
  const simulationMap: Record<string, string[]> = {
    // ===== COMPLETE BLINDNESS / NO LIGHT PERCEPTION =====
    'complete-blindness': ['completeBlindness'],
    'abraham-congenital-blindness': ['completeBlindness'],
    'moon-complete-blindness': ['completeBlindness'],
    'doc-eye-infection': ['completeBlindness'],
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
    'tofiri-complete-blindness': ['completeBlindness'],
    'joshua-complete-blindness': ['completeBlindness'],
    'ved-spatial-awareness': ['completeBlindness'],
    'srikanth-complete-blindness': ['completeBlindness'],
    'henry-stroke-blindness': ['completeBlindness'],

    // ===== RETINITIS PIGMENTOSA (Tunnel Vision) =====
    'paul-retinitis-pigmentosa': ['retinitisPigmentosa', 'nightBlindness'],
    'casey-retinitis-pigmentosa': ['retinitisPigmentosa', 'nightBlindness'],
    'molly-retinitis-pigmentosa': ['retinitisPigmentosa', 'nightBlindness'],
    'chris-retinitis-pigmentosa': ['retinitisPigmentosa', 'nightBlindness'],
    'rachael-retinitis-pigmentosa': ['retinitisPigmentosa', 'nightBlindness'],
    'peripheral-islands progressive-loss': ['retinitisPigmentosa', 'nightBlindness'],
    'progressive-loss tunnel-vision': ['retinitisPigmentosa', 'nightBlindness', 'lossOfContrast'],
    'minkara-end-stage-complete': ['retinitisPigmentosa', 'nightBlindness', 'tunnelVision'],
    'erik-retinoschisis-islands': ['retinitisPigmentosa', 'scotoma'],

    // ===== GLAUCOMA =====
    'glaucoma-halos progressive-loss': ['glaucoma', 'halos', 'tunnelVision'],
    'acute-glaucoma-attacks': ['glaucoma', 'halos', 'blurryVision'],
    'tunnel-vision glaucoma-halos': ['glaucoma', 'halos', 'tunnelVision'],
    'jose-congenital-glaucoma': ['glaucoma', 'tunnelVision'],
    'ronnie-congenital-glaucoma': ['glaucoma', 'tunnelVision'],
    'geerat-congenital-glaucoma': ['glaucoma', 'tunnelVision'],
    'bono-glaucoma-sensitivity': ['glaucoma', 'halos', 'glare'],
    'borges-progressive-blindness': ['glaucoma', 'tunnelVision', 'lossOfContrast'],
    'euler-progressive-blindness': ['glaucoma', 'tunnelVision', 'blurryVision'],
    'fetty-glaucoma-prosthetic': ['glaucoma', 'blindnessLeftEye'],

    // ===== CATARACTS =====
    'cataracts color-distortion': ['cataracts', 'glare', 'lossOfContrast'],
    'art-congenital-cataracts': ['cataracts', 'blurryVision', 'glare'],
    'diane-congenital-cataracts': ['cataracts', 'blurryVision'],
    'mila-iritis-cataracts': ['milaCompleteVision'],
    'nmo-blur': ['cataracts', 'blurryVision', 'glare'],
    'amadou-cataract-progression': ['amadouCataractProgression'],

    // ===== NMO / OPTIC NEURITIS (Christine Ha, Lucy Edwards) =====
    'christine-nmo-complete': ['christineNMOComplete', 'christineFluctuatingVision'],
    'lucy-complete-vision': ['lucyCompleteVision'],

    // ===== MACULAR DEGENERATION / STARGARDT =====
    'central-scotoma metamorphopsia': ['amd', 'scotoma'],
    'central-scotoma progressive-loss': ['stargardt', 'scotoma'],
    'judi-amd-progression': ['judiAMDComplete'],
    'georgia-amd-central-loss': ['amd', 'scotoma', 'lossOfContrast'],
    'marla-stargardt-complete': ['stargardt', 'scotoma', 'lossOfContrast'],

    // ===== DIABETIC RETINOPATHY =====
    'ella-diabetic-retinopathy': ['diabeticRetinopathy', 'visualFloaters'],
    'wanda-diabetic-retinopathy': ['diabeticRetinopathy', 'visualFloaters', 'blurryVision'],

    // ===== RETINAL DETACHMENT =====
    'sugar-retinal-detachment': ['sugarRetinalDetachmentComplete'],
    'jeff-retinoblastoma': ['retinalDetachment', 'blindnessLeftEye'],
    'lex-rop': ['lexRecurrentDetachmentCycle'],

    // ===== HEMIANOPIA / PARTIAL VISION LOSS =====
    'david-hemispheric-vision': ['hemianopiaRight', 'blurryVision'],
    'slick-rick-blindness': ['blindnessRightEye'],
    'thurber-eye-injury': ['blindnessLeftEye', 'blurryVision'],

    // ===== KERATOCONUS / ASTIGMATISM =====
    'stephen-keratoconus': ['stephenKeratoconusComplete'],
    'allan-nystagmus': ['astigmatism', 'blurryVision'],

    // ===== VISUAL DISTURBANCES =====
    'sharon-stroke-visual-distortions': ['visualAura', 'hallucinations', 'visualFloaters'],

    // ===== ANIRIDIA =====
    'trischa-aniridia': ['glare', 'blurryVision', 'lossOfContrast'],

    // ===== COLOR BLINDNESS =====
    'fred-rogers-deuteranopia': ['deuteranopia'],
    'bill-gates-deuteranomaly': ['deuteranomaly'],
    'john-kay-achromatopsia': ['monochromacy'],
    'jonny-greenwood-color-blindness': ['deuteranomaly'],

    // ===== LEGAL BLINDNESS / LOW VISION =====
    'marilee-legal-blindness': ['blurryVision', 'lossOfContrast', 'glare'],

    // ===== COMPLEX MULTI-CONDITION =====
    'joyce-progressive-eye-disease': ['glaucoma', 'cataracts', 'blurryVision', 'glare', 'lossOfContrast'],
    'huxley-keratitis': ['cataracts', 'blurryVision', 'glare', 'lossOfContrast', 'blindnessLeftEye'],
    'sartre-monocular-vision': ['blindnessRightEye'],
    'taha-complete-blindness': ['completeBlindness'],
    'nana-myopia-astigmatism': ['astigmatism'],
    'esref-congenital-blindness': ['completeBlindness'],
    'moondog-complete-blindness': ['completeBlindness']
  };

  return simulationMap[simulation] || ['blurryVision', 'lossOfContrast'];
};

/**
 * Helper function to get teamusa.com URL based on personId
 */
const getTeamUsaUrl = (personId: string): string => {
  if (personId === 'marla') return 'https://www.teamusa.com/profiles/marla-runyan';
  if (personId === 'anastasia') return 'https://www.teamusa.com/profiles/anastasia-pagonis-1136100';
  if (personId === 'lex') return 'https://www.teamusa.com/profiles/lex-gillette';
  if (personId === 'davidBrown') return 'https://www.teamusa.com/profiles/david-brown';
  return 'https://www.teamusa.com/profiles/marla-runyan';
};

/**
 * Helper function to get IMDb URL based on personId
 */
const getImdbUrl = (personId: string): string => {
  const imdbMap: Record<string, string> = {
    'marilee': 'https://www.imdb.com/name/nm3411258/'
  };
  return imdbMap[personId] || '';
};

/**
 * Helper function to get Paralympic.org URL based on personId
 */
const getParalympicUrl = (personId: string): string => {
  const paralympicMap: Record<string, string> = {
    'tofiri': 'https://www.paralympic.org/news/throwback-thursday-uganda-s-tofiri-kibuuka'
  };
  return paralympicMap[personId] || '';
};

/**
 * Helper function to get ishof.org URL based on personId
 */
const getIshofUrl = (personId: string): string => {
  const ishofMap: Record<string, string> = {
    'trischa': 'https://ishof.org/honoree/trischa-zorn'
  };
  return ishofMap[personId] || '';
};

/**
 * Helper function to get Wikipedia URL based on personId
 */
const getWikipediaUrl = (personId: string): string => {
  const wikipediaMap: Record<string, string> = {
    'monet': 'https://en.wikipedia.org/wiki/Claude_Monet',
    'braille': 'https://en.wikipedia.org/wiki/Louis_Braille',
    'milton': 'https://en.wikipedia.org/wiki/John_Milton',
    'galileo': 'https://en.wikipedia.org/wiki/Galileo_Galilei',
    'tilly': 'https://en.wikipedia.org/wiki/Tilly_Aston',
    'sabriye': 'https://en.wikipedia.org/wiki/Sabriye_Tenberken',
    'harriet': 'https://en.wikipedia.org/wiki/Harriet_Tubman',
    'moon': 'https://en.wikipedia.org/wiki/William_Moon',
    'jose': 'https://en.wikipedia.org/wiki/José_Feliciano',
    'art': 'https://en.wikipedia.org/wiki/Art_Tatum',
    'ronnie': 'https://en.wikipedia.org/wiki/Ronnie_Milsap',
    'doc': 'https://en.wikipedia.org/wiki/Doc_Watson',
    'jeff': 'https://en.wikipedia.org/wiki/Jeff_Healey',
    'diane': 'https://en.wikipedia.org/wiki/Diane_Schuur',
    'nobuyuki': 'https://en.wikipedia.org/wiki/Nobuyuki_Tsujii',
    'rahsaan': 'https://en.wikipedia.org/wiki/Rahsaan_Roland_Kirk',
    'borges': 'https://en.wikipedia.org/wiki/Jorge_Luis_Borges',
    'thurber': 'https://en.wikipedia.org/wiki/James_Thurber',
    'fanny': 'https://en.wikipedia.org/wiki/Fanny_Crosby',
    'homer': 'https://en.wikipedia.org/wiki/Homer',
    'blunkett': 'https://en.wikipedia.org/wiki/David_Blunkett',
    'saunderson': 'https://en.wikipedia.org/wiki/Nicholas_Saunderson',
    'geerat': 'https://en.wikipedia.org/wiki/Geerat_Vermeij',
    'gustafDalen': 'https://en.wikipedia.org/wiki/Gustaf_Dal%C3%A9n',
    'holman': 'https://en.wikipedia.org/wiki/James_Holman',
    'jacobBolotin': 'https://en.wikipedia.org/wiki/Jacob_Bolotin',
    'josephPlateau': 'https://en.wikipedia.org/wiki/Joseph_Plateau',
    'chris': 'https://en.wikipedia.org/wiki/Chris_McCausland',
    'blindspot': 'https://en.wikipedia.org/wiki/Blindspot_(DC_Comics)',
    'kenshi': 'https://en.wikipedia.org/wiki/Kenshi_(Mortal_Kombat)',
    'neo': 'https://en.wikipedia.org/wiki/Neo_(The_Matrix)',
    'blinkin': 'https://en.wikipedia.org/wiki/Robin_Hood:_Men_in_Tights',
    'mrMagoo': 'https://en.wikipedia.org/wiki/Mr._Magoo',
    'doctorMidNite': 'https://en.wikipedia.org/wiki/Doctor_Mid-Nite',
    'wallyKarew': 'https://en.wikipedia.org/wiki/See_No_Evil,_Hear_No_Evil_(film)',
    'mohammad': 'https://en.wikipedia.org/wiki/The_Color_of_Paradise',
    'maryIngalls': 'https://en.wikipedia.org/wiki/Mary_Ingalls',
    'francisCampbell': 'https://en.wikipedia.org/wiki/Francis_Joseph_Campbell',
    'anthonyClarke': 'https://en.wikipedia.org/wiki/Anthony_Clarke_(judoka)',
    'amyBower': 'https://en.wikipedia.org/wiki/Amy_Bower',
    'floydMorris': 'https://en.wikipedia.org/wiki/Floyd_Morris',
    'henryFawcett': 'https://en.wikipedia.org/wiki/Henry_Fawcett',
    'jacquesLusseyran': 'https://en.wikipedia.org/wiki/Jacques_Lusseyran',
    'belaTheBlind': 'https://en.wikipedia.org/wiki/B%C3%A9la_II_of_Hungary',
    'johnOfBohemia': 'https://en.wikipedia.org/wiki/John_of_Bohemia',
    'blindLemonJefferson': 'https://en.wikipedia.org/wiki/Blind_Lemon_Jefferson',
    'charlottaSeuerling': 'https://en.wikipedia.org/wiki/Charlotta_Seuerling',
    'levPontryagin': 'https://en.wikipedia.org/wiki/Lev_Pontryagin',
    'garyODonoghue': 'https://en.wikipedia.org/wiki/Gary_O%27Donoghue',
    'francescoLandini': 'https://en.wikipedia.org/wiki/Francesco_Landini',
    'garretBarry': 'https://en.wikipedia.org/wiki/Garret_Barry_(piper)',
    'gurrumulYunupingu': 'https://en.wikipedia.org/wiki/Geoffrey_Gurrumul_Yunupingu',
    'geraldineLawhorn': 'https://en.wikipedia.org/wiki/Geraldine_Lawhorn',
    'odin': 'https://en.wikipedia.org/wiki/Odin',
    'geordi': 'https://en.wikipedia.org/wiki/Geordi_La_Forge',
    'toph': 'https://en.wikipedia.org/wiki/Toph_Beifong',
    'chirrutImwe': 'https://starwars.fandom.com/wiki/Chirrut_%C3%8Emwe',
    'euler': 'https://en.wikipedia.org/wiki/Leonhard_Euler',
    'rachael': 'https://en.wikipedia.org/wiki/Rachael_Leahcar',
    'tiffany': 'https://en.wikipedia.org/wiki/Tiffany_Brar',
    'wanda': 'https://en.wikipedia.org/wiki/Wanda_D%C3%ADaz-Merced',
    'fredRogers': 'https://en.wikipedia.org/wiki/Fred_Rogers',
    'billGates': 'https://en.wikipedia.org/wiki/Bill_Gates',
    'johnKay': 'https://en.wikipedia.org/wiki/John_Kay_(musician)',
    'joaquinRodrigo': 'https://en.wikipedia.org/wiki/Joaqu%C3%ADn_Rodrigo',
    'jonnyGreenwood': 'https://en.wikipedia.org/wiki/Jonny_Greenwood',
    'crazzySteve': 'https://en.wikipedia.org/wiki/Crazzy_Steve',
    'mila': 'https://en.wikipedia.org/wiki/Mila_Kunis',
    'judi': 'https://en.wikipedia.org/wiki/Judi_Dench',
    'bono': 'https://en.wikipedia.org/wiki/Bono',
    'georgia': 'https://en.wikipedia.org/wiki/Georgia_O%27Keeffe',
    'ella': 'https://en.wikipedia.org/wiki/Ella_Fitzgerald',
    'sugar': 'https://en.wikipedia.org/wiki/Sugar_Ray_Leonard',
    'stephen': 'https://en.wikipedia.org/wiki/Stephen_Curry',
    'allan': 'https://en.wikipedia.org/wiki/Apl.de.ap',
    'fetty': 'https://en.wikipedia.org/wiki/Fetty_Wap',
    'slick': 'https://en.wikipedia.org/wiki/Slick_Rick',
    'abraham': 'https://en.wikipedia.org/wiki/Abraham_Nemeth',
    'sharon': 'https://en.wikipedia.org/wiki/Sharon_Stone',
    'daredevil': 'https://en.wikipedia.org/wiki/Matt_Murdock_(Marvel_Cinematic_Universe)',
    'amadou': 'https://en.wikipedia.org/wiki/Amadou_%26_Mariam'
  };
  return wikipediaMap[personId] || 'https://en.wikipedia.org/wiki/Claude_Monet';
};

/**
 * Maps website domains to full URLs for person descriptions
 */
export const getWebsiteUrl = (domain: string, personId: string): string => {
  const websiteMap: Record<string, string> = {
    'paulcastlestudio.com': 'https://paulcastlestudio.com',
    'theblindcook.com': 'https://www.theblindcook.com/',
    'lucyedwards.com': 'https://www.lucyedwards.com/',
    'governordavidpaterson.com': 'https://governordavidpaterson.com/',
    'nytimes.com': 'https://www.nytimes.com/2013/03/03/nyregion/40-years-after-an-acid-attack-a-life-well-lived.html',
    'monaminkara.com': 'https://monaminkara.com/',
    'erikweihenmayer.com': 'https://erikweihenmayer.com/',
    'teamusa.com': getTeamUsaUrl(personId),
    'womenshistory.org': 'https://www.womenshistory.org/education-resources/biographies/helen-keller',
    'andreabocelli.com': 'https://www.andreabocelli.com/',
    'en.wikipedia.org': getWikipediaUrl(personId),
    'steviewonder.net': 'https://www.steviewonder.net/',
    'raycharles.com': 'https://raycharles.com/',
    'newyorker.com': 'https://www.newyorker.com/culture/postscript/ved-mehta-1934-2021',
    'disabilitytalent.org': 'https://www.disabilitytalent.org/single-post/2018/10/01/a-vision-for-the-future-an-interview-with-casey-harris-of-x-ambassadors',
    'habengirma.com': 'https://habengirma.com/',
    'mollyburkeofficial.com': 'https://www.mollyburkeofficial.com/',
    'book-of-eli.fandom.com': 'https://book-of-eli.fandom.com/wiki/The_Book_of_Eli',
    'marvel.com': 'https://www.marvel.com/characters/arachne-julia-carpenter',
    'starwars.fandom.com': getWikipediaUrl(personId),
    'imdb.com': getImdbUrl(personId),
    'rachaelleahcar.com.au': 'https://rachaelleahcar.com.au/',
    'rossminor.com': 'https://rossminor.com/',
    'paralympic.org': getParalympicUrl(personId),
    'ishof.org': getIshofUrl(personId),
    'misterrogers.org': 'https://www.misterrogers.org/',
    'steppenwolf.com': 'https://steppenwolf.com/pages/john-kay-biography',
    'in-the-dark-cw.fandom.com': 'https://in-the-dark-cw.fandom.com/wiki/Murphy_Mason',
    'onepiece.fandom.com': 'https://onepiece.fandom.com/wiki/Issho',
    'heather-hutchison.com': 'https://www.heather-hutchison.com/',
    'bramblitt.com': 'https://bramblitt.com/'
  };
  
  return websiteMap[domain] || '';
};

/**
 * Parses description text and converts website domains to clickable links
 */
export const parseDescriptionWithLinks = (description: string, personId: string): React.ReactNode[] => {
  const websiteMap: Record<string, string> = {
    'paulcastlestudio.com': 'https://paulcastlestudio.com',
    'theblindcook.com': 'https://www.theblindcook.com/',
    'lucyedwards.com': 'https://www.lucyedwards.com/',
    'governordavidpaterson.com': 'https://governordavidpaterson.com/',
    'nytimes.com': 'https://www.nytimes.com/2013/03/03/nyregion/40-years-after-an-acid-attack-a-life-well-lived.html',
    'monaminkara.com': 'https://monaminkara.com/',
    'erikweihenmayer.com': 'https://erikweihenmayer.com/',
    'teamusa.com': getTeamUsaUrl(personId),
    'womenshistory.org': 'https://www.womenshistory.org/education-resources/biographies/helen-keller',
    'andreabocelli.com': 'https://www.andreabocelli.com/',
    'en.wikipedia.org': getWikipediaUrl(personId),
    'steviewonder.net': 'https://www.steviewonder.net/',
    'raycharles.com': 'https://raycharles.com/',
    'newyorker.com': 'https://www.newyorker.com/culture/postscript/ved-mehta-1934-2021',
    'disabilitytalent.org': 'https://www.disabilitytalent.org/single-post/2018/10/01/a-vision-for-the-future-an-interview-with-casey-harris-of-x-ambassadors',
    'habengirma.com': 'https://habengirma.com/',
    'mollyburkeofficial.com': 'https://www.mollyburkeofficial.com/',
    'book-of-eli.fandom.com': 'https://book-of-eli.fandom.com/wiki/The_Book_of_Eli',
    'marvel.com': 'https://www.marvel.com/characters/arachne-julia-carpenter',
    'starwars.fandom.com': getWikipediaUrl(personId),
    'imdb.com': getImdbUrl(personId),
    'rachaelleahcar.com.au': 'https://rachaelleahcar.com.au/',
    'rossminor.com': 'https://rossminor.com/',
    'paralympic.org': getParalympicUrl(personId),
    'ishof.org': getIshofUrl(personId),
    'misterrogers.org': 'https://www.misterrogers.org/',
    'steppenwolf.com': 'https://steppenwolf.com/pages/john-kay-biography',
    'in-the-dark-cw.fandom.com': 'https://in-the-dark-cw.fandom.com/wiki/Murphy_Mason',
    'onepiece.fandom.com': 'https://onepiece.fandom.com/wiki/Issho',
    'heather-hutchison.com': 'https://www.heather-hutchison.com/',
    'bramblitt.com': 'https://bramblitt.com/',
    'kenyanheroes.com': 'https://kenyanheroes.com/hero/henry-wanyoike/'
  };

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
          style={{ color: '#1976d2', textDecoration: 'underline' }}
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

