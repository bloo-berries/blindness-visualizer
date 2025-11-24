/**
 * Utilities for famous people page - simulation mapping and website links
 */

import React from 'react';

/**
 * Maps simulation types to actual condition IDs for navigation
 */
export const getSimulationConditions = (simulation: string): string[] => {
  const simulationMap: Record<string, string[]> = {
    'glaucoma-halos progressive-loss': ['johnMiltonBlindness', 'miltonGlaucomaHalos'],
    'complete-blindness': ['helenKellerBlindness', 'louisBrailleBlindness', 'rayCharlesBlindness', 'stevieWonderROP', 'andreaBocelliBlindness'],
    'acute-glaucoma-attacks': ['galileoAcuteAttackMode', 'galileoChronicProgression'],
    'tunnel-vision glaucoma-halos': ['glaucoma', 'cataracts'],
    'progressive-loss tunnel-vision': ['glaucoma', 'monochromatic'],
    'nmo-blur': ['cataracts', 'astigmatism'],
    'peripheral-islands progressive-loss': ['retinitisPigmentosa', 'monochromatic'],
    'central-scotoma metamorphopsia': ['stargardt', 'amd'],
    'central-scotoma progressive-loss': ['stargardt', 'amd'],
    'cataracts color-distortion': ['monetCataractsProgression'],
    'ved-spatial-awareness': ['vedMehtaBlindness'],
    'christine-nmo-complete': ['christineNMOComplete'],
    'lucy-complete-vision': ['lucyCompleteVision'],
    'david-hemispheric-vision': ['davidPatersonBlindness'],
    'erik-retinoschisis-islands': ['erikWeihenmayerRetinoschisis'],
    'marla-stargardt-complete': ['marlaRunyanStargardt'],
    'minkara-end-stage-complete': ['minkaraEndStageComplete'],
    'joshua-complete-blindness': ['joshuaMieleBlindness'],
    'paul-retinitis-pigmentosa': ['retinitisPigmentosa'],
    'mila-iritis-cataracts': ['cataracts', 'glaucoma'],
    'judi-amd-progression': ['amd', 'stargardt'],
    'bono-glaucoma-sensitivity': ['glaucoma', 'photophobia'],
    'georgia-amd-central-loss': ['amd', 'stargardt'],
    'ella-diabetic-retinopathy': ['diabeticRetinopathy', 'glaucoma'],
    'sugar-retinal-detachment': ['retinalDetachment', 'glaucoma'],
    'stephen-keratoconus': ['keratoconus', 'astigmatism'],
    'allan-nystagmus': ['nystagmus', 'astigmatism'],
    'fetty-glaucoma-prosthetic': ['glaucoma', 'complete-blindness'],
    'slick-rick-blindness': ['hemianopia', 'glaucoma'],
    'abraham-congenital-blindness': ['complete-blindness'],
    'moon-complete-blindness': ['complete-blindness'],
    'sharon-stroke-visual-distortions': ['visual-auras', 'metamorphopsia', 'hallucinations'],
    'jose-congenital-glaucoma': ['glaucoma', 'complete-blindness'],
    'art-congenital-cataracts': ['cataracts', 'complete-blindness'],
    'ronnie-congenital-glaucoma': ['glaucoma', 'complete-blindness'],
    'doc-eye-infection': ['complete-blindness'],
    'jeff-retinoblastoma': ['complete-blindness'],
    'diane-congenital-cataracts': ['cataracts', 'complete-blindness'],
    'nobuyuki-congenital-blindness': ['complete-blindness'],
    'rahsaan-childhood-blindness': ['complete-blindness'],
    'borges-progressive-blindness': ['glaucoma', 'progressive-loss'],
    'thurber-eye-injury': ['hemianopia', 'glaucoma'],
    'fanny-iatrogenic-blindness': ['complete-blindness'],
    'homer-traditional-blindness': ['complete-blindness'],
    'lex-rop': ['retinopathyOfPrematurity', 'complete-blindness'],
    'david-brown-kawasaki': ['complete-blindness'],
    'blunkett-congenital-blindness': ['complete-blindness'],
    'saunderson-smallpox-blindness': ['complete-blindness'],
    'geerat-congenital-glaucoma': ['glaucoma', 'complete-blindness'],
    'holman-complete-blindness': ['complete-blindness'],
    'chris-retinitis-pigmentosa': ['retinitisPigmentosa'],
    'euler-progressive-blindness': ['glaucoma', 'progressive-loss'],
    'marilee-legal-blindness': ['low-vision', 'glaucoma'],
    'rachael-retinitis-pigmentosa': ['retinitisPigmentosa'],
    'tiffany-complete-blindness': ['complete-blindness'],
    'ross-complete-blindness': ['complete-blindness'],
    'tofiri-complete-blindness': ['complete-blindness']
  };
  
  return simulationMap[simulation] || ['glaucoma'];
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
    'holman': 'https://en.wikipedia.org/wiki/James_Holman',
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
    'belaTheBlind': 'https://en.wikipedia.org/wiki/B%C3%A9la_II_of_Hungary',
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
    'tiffany': 'https://en.wikipedia.org/wiki/Tiffany_Brar'
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
    'paralympic.org': getParalympicUrl(personId)
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
    'paralympic.org': getParalympicUrl(personId)
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

