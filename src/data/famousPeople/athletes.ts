import { PersonData } from './types';

export const athletes: Record<string, PersonData> = {
  erik: {
    name: "Erik Weihenmayer",
    achievement: "First Blind Person to Summit Everest",
    condition: "Juvenile Retinoschisis",
    years: "Born 1968",
    onset: "Diagnosed at 4, blind by 13",
    simulation: "erik-retinoschisis-islands",
    description: "Retinoschisis causes splitting of retinal layers, leading to progressive vision loss. Erik's vision deteriorated with isolated 'islands' of vision gradually disappearing until complete blindness at age 13.\n\n• First blind person to summit Mount Everest (2001)\n\n• Climbed all Seven Summits (highest peaks on each continent)\n\n• Kayaked the entire Grand Canyon\n\n• Author and motivational speaker at erikweihenmayer.com",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  marla: {
    name: "Marla Runyan",
    achievement: "First Legally Blind Olympic Athlete",
    condition: "Stargardt Disease",
    years: "Born 1969",
    onset: "Age 9, progressive",
    simulation: "marla-stargardt-complete",
    description: "Stargardt disease causes progressive macular degeneration, destroying central vision. Marla has a large central blind spot with preserved peripheral vision, making it difficult to see faces or read but allowing navigation using side vision.\n\n• First legally blind athlete to compete in the Olympics (2000 Sydney, 2004 Athens)\n\n• Five-time U.S. national champion in various track events\n\n• Holds American record in the women's 5000m (indoor)",
    wikiUrl: "https://en.wikipedia.org/wiki/Marla_Runyan",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  anastasia: {
    name: "Anastasia Pagonis",
    achievement: "Paralympic Gold Medalist, Swimmer",
    condition: "Stargardt Disease",
    years: "Born 2004",
    onset: "Age 11, progressive",
    simulation: "anastasia-stargardt",
    description: "Anastasia Pagonis has Stargardt disease, a form of juvenile macular degeneration that destroys central vision while preserving peripheral sight. She lost most of her vision by age 14.\n\n• Paralympic gold medalist in swimming (Tokyo 2020, 400m freestyle)\n\n• Multiple Paralympic and world records in swimming\n\n• Social media influencer with millions of followers, raising awareness about blindness",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  sugar: {
    name: "Sugar Ray Leonard",
    achievement: "Olympic Gold & 5x World Champion Boxer",
    condition: "Partial Retinal Detachment",
    years: "Born 1956",
    onset: "Left eye in 1982, surgery May 1982",
    simulation: "sugar-retinal-detachment",
    description: "Sugar Ray Leonard suffered a partial retinal detachment in his left eye in 1982. Symptoms included a dark curtain encroaching from the periphery, numerous floaters, and flashes of light.\n\nThe condition threatened to engulf his central vision.\n\n• Olympic gold medalist in boxing (1976 Montreal)\n\n• World champion in five weight divisions\n\n• Named Fighter of the Decade for the 1980s\n\n• International Boxing Hall of Fame inductee",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  stephen: {
    name: "Stephen Curry",
    achievement: "4x NBA Champion, 2x MVP",
    condition: "Keratoconus",
    years: "Born 1988",
    onset: "Diagnosed in college",
    simulation: "stephen-keratoconus",
    description: "Stephen Curry has keratoconus, where the cornea thins into an irregular cone shape. Before correction, his vision featured directional blur (coma aberration) with every edge smearing into comet-like tails, multiple ghost images, irregular halos streaming from lights, and wavy distortion of straight lines.\n\n• Greatest shooter in NBA history\n\n• Four-time NBA champion with Golden State Warriors\n\n• Two-time NBA MVP\n\n• All-time leader in three-point field goals made",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  lex: {
    name: "Lex Gillette",
    achievement: "4x Paralympic Silver Medalist, Long Jump",
    condition: "Recurrent Retinal Detachments (ROP)",
    years: "Born 1984",
    onset: "Left eye blind from birth; right eye progressive loss age 8+",
    simulation: "lex-rop",
    description: "Lex Gillette was born premature with retinopathy of prematurity, leaving his left eye blind from birth. His right eye functioned until age 8 when recurrent retinal detachments began - cycles of hope and loss as surgery would restore vision only for the retina to detach again.\n\nThe clear zone shrank each cycle until nothing remained.\n\n• Four-time Paralympic silver medalist in long jump\n\n• Multiple world records in Paralympic long jump\n\n• Motivational speaker and author of 'Fly: A Memoir'\n\n• Team USA track and field athlete",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  davidBrown: {
    name: "David Brown",
    achievement: "Paralympic Gold, Fastest Blind Man",
    condition: "Kawasaki Disease → Glaucoma",
    years: "Born 1992",
    onset: "Left eye age 3; right eye progressive loss to age 13",
    simulation: "david-brown-kawasaki",
    description: "David Brown's vision changed in two phases. Kawasaki disease at 15 months triggered glaucoma in both eyes. His left eye went dark at age 3, while his right eye experienced a dirty-glass haze with rainbow halos around every light.\n\nBy 13, glaucoma took his remaining vision. He still experiences ongoing pain from elevated eye pressure.\n\n• Paralympic gold medalist (100m, Rio 2016) - fastest totally blind man in history\n\n• Multiple Paralympic and world championship medals\n\n• Runs with guide runner Jerome Avery",
    wikiUrl: "https://en.wikipedia.org/wiki/David_Brown_(sprinter)",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  anthonyClarke: {
    name: "Anthony Clarke",
    achievement: "Paralympic Gold Medalist, Judo",
    condition: "Blindness from Car Accident",
    years: "Born 1961",
    onset: "Age 17, from car accident",
    simulation: "complete-blindness",
    description: "Anthony 'Tony' Clarke became completely blind at age 17 following a car accident that destroyed his vision instantly.\n\n• Only Australian to win Paralympic gold in judo (1996 Atlanta)\n\n• Represented Australia at five consecutive Summer Paralympic Games\n\n• Two-time IBSA World Judo Champion\n\n• Medal of the Order of Australia (OAM) recipient (1997)",
    wikiUrl: "https://en.wikipedia.org/wiki/Anthony_Clarke_(judoka)",
    nationality: { country: "Australia", flag: "🇦🇺" }
  },
  crazzySteve: {
    name: "Crazzy Steve",
    achievement: "Impact Wrestling Tag Team Champion",
    condition: "Bilateral Aphakia + Secondary Glaucoma",
    years: "Born 1988",
    onset: "Congenital cataracts removed in infancy; progressive vision loss",
    simulation: "crazzySteve-aphakia-glaucoma",
    description: "Crazzy Steve (Steven Scott) was born premature with congenital bilateral cataracts that left him totally blind at birth. Surgery removed the cataracts in infancy, restoring partial vision, but his eyes lack natural lenses (aphakia) and he has developed secondary glaucoma that continues to worsen.\n\nHe describes his sight as 'the hazy aftermath of a dream' - relying on shapes and colors rather than clear details. He cannot see ring ropes (especially dark-colored ones) or fans in the audience. He is legally blind with vision well below 20/200.\n\n• Professional wrestler competing in TNA/Impact Wrestling\n\n• Former Impact World Tag Team Champion\n\n• Demonstrates that severe visual impairment does not prevent success in sports entertainment",
    wikiUrl: "https://en.wikipedia.org/wiki/Crazzy_Steve",
    nationality: { country: "Canada", flag: "🇨🇦" }
  },
  tofiri: {
    name: "Tofiri Kibuuka",
    achievement: "Africa's First Winter Para Athlete",
    condition: "Progressive Degenerative Blindness (B1/T11)",
    years: "Born 1947",
    onset: "Age 13, progressive degenerative disease (circa 1960)",
    simulation: "tofiri-b1-blindness",
    description: "Tofiri Kibuuka lost his sight at age 13 in rural Uganda due to a progressive degenerative eye disease. He was consistently classified B1/T11 (most severe visual impairment) throughout his career - defined as no light perception or at best inability to recognize a hand shape at any distance.\n\nHe navigated Paralympic ski courses, marathon routes, and mountain ascents through sound, touch, guide communication, spatial memory, and proprioception - with effectively zero visual input.\n\n• Africa's first winter Para athlete at 1976 Paralympic Winter Games (cross-country skiing for Uganda)\n\n• Five silver medals and one bronze at Paralympic Games (1984-1992)\n\n• Norway's flag bearer at 1996 Atlanta Paralympic Games - first black man to carry Norwegian flag at Paralympics\n\n• One of the first blind people to climb Mount Kilimanjaro\n\n• Competed in T11 marathon at 2000 Sydney Paralympics",
    wikiUrl: "https://en.wikipedia.org/wiki/Tofiri_Kibuuka",
    nationality: { country: "Uganda", flag: "🇺🇬" }
  },
  ross: {
    name: "Ross Minor",
    achievement: "Para Swimmer & Accessibility Consultant",
    condition: "Gunshot Wound",
    years: "Born (Contemporary)",
    onset: "Age 8",
    simulation: "ross-complete-blindness",
    description: "Ross Minor lost his sight at age 8 from a gunshot wound, resulting in complete blindness with no light perception.\n\n• Former para swimmer and competitive athlete\n\n• Accessibility consultant helping companies make products accessible to people with disabilities\n\n• Content creator raising awareness about blindness\n\n• Visit rossminor.com",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  trischa: {
    name: "Trischa Zorn",
    achievement: "Most Decorated Paralympian: 55 Medals",
    condition: "Aniridia",
    years: "Born 1964",
    onset: "From birth",
    simulation: "trischa-aniridia",
    description: "Trischa Zorn was born with aniridia, a rare congenital genetic eye disorder where the iris fails to develop properly. The condition causes extreme light sensitivity, glare, and severely reduced visual acuity.\n\nShe is legally blind.\n\n• Most decorated athlete in Paralympic history with 55 medals (41 gold, 9 silver, 5 bronze)\n\n• Competed in seven consecutive Paralympic Games (1980-2004)\n\n• Inducted into International Paralympic Hall of Fame, U.S. Olympic & Paralympic Hall of Fame, and International Swimming Hall of Fame\n\n• Earned Juris Doctor degree and works for Department of Veterans Affairs",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  henry: {
    name: "Henry Wanyoike",
    achievement: "2x Paralympic Gold Medalist, Running",
    condition: "Stroke-Induced Blindness",
    years: "Born 1974",
    onset: "Age 21, from stroke in 1995",
    simulation: "henry-stroke-blindness",
    description: "Henry Wanyoike lost 95% of his vision overnight on May 1, 1995, when a stroke damaged his optic nerves. He lost the remaining vision gradually over the following years.\n\nAfter struggling with depression, he discovered he could run with a guide.\n\n• Paralympic gold medalist: Sydney 2000 (5000m) and Athens 2004 (10000m)\n\n• Multiple world records in Paralympic athletics\n\n• Founded the Henry Wanyoike Foundation\n\n• Visited over 700 schools advocating for disability rights\n\n• Famous quote: 'I lost my sight, but I gained a vision'",
    nationality: { country: "Kenya", flag: "🇰🇪" }
  },
  terezinhaGuilhermina: {
    name: "Terezinha Guilhermina",
    achievement: "World's Fastest Blind Woman, 6 Paralympic Medals",
    condition: "Congenital Retinitis Pigmentosa",
    years: "Born 1978",
    onset: "From birth, completely blind by age 26",
    simulation: "terezinha-rp-blindness",
    description: "Terezinha Guilhermina was born with congenital retinitis pigmentosa, a hereditary condition shared by five of her twelve siblings. Born with approximately 95% vision loss, her sight progressively deteriorated until she became completely blind around age 26.\n\nShe entered sports at age 22 through a government program for people with impairments.\n\n• Known as 'the world's fastest blind woman'\n\n• Six Paralympic medals including three golds (Beijing 2008, London 2012)\n\n• Multiple world records in 100m and 400m T11\n\n• Also holds a bachelor's degree in psychology",
    wikiUrl: "https://en.wikipedia.org/wiki/Terezinha_Guilhermina",
    nationality: { country: "Brazil", flag: "🇧🇷" }
  },
  silvaniaCosta: {
    name: "Silvânia Costa de Oliveira",
    achievement: "Back-to-Back Paralympic Long Jump Gold",
    condition: "Stargardt Disease",
    years: "Born 1987",
    onset: "Age 10, progressive hereditary",
    simulation: "silvania-stargardt",
    description: "Silvânia Costa de Oliveira was diagnosed with Stargardt disease at age 10, a hereditary retinal condition that progressively destroyed her central vision. The condition runs deeply in her family — her brother Ricardo, two sisters, and two cousins are all blind from the same disease.\n\nShe competes in the T11 category (near-total/total blindness) wearing blacked-out glasses.\n\n• Gold medals in women's long jump T11 at both 2016 Rio and 2020 Tokyo Paralympics\n\n• World champion and world record holder in long jump T11\n\n• Her brother Ricardo also won long jump gold at Rio 2016, making them a remarkable sibling pair of Paralympic champions",
    wikiUrl: "https://en.wikipedia.org/wiki/Silv%C3%A2nia_Costa_de_Oliveira",
    nationality: { country: "Brazil", flag: "🇧🇷" }
  },
  luciaTeixeira: {
    name: "Lúcia Teixeira",
    achievement: "3x Paralympic Judo Medalist",
    condition: "Congenital Toxoplasmosis (Low Vision)",
    years: "Born 1981",
    onset: "From birth, parasitic infection in utero",
    simulation: "lucia-toxoplasmosis",
    description: "Lúcia Teixeira was born with congenital toxoplasmosis — a parasitic infection transmitted from her mother during pregnancy that severely damaged her retinas. She is classified as B2, meaning severely impaired vision but not totally blind.\n\nShe began judo at age 15 through her brothers but only discovered Paralympic judo at age 25.\n\n• Silver medals at 2012 London and 2016 Rio Paralympics in judo -57 kg\n\n• Bronze medal at 2020 Tokyo Paralympics\n\n• Multiple Parapan American gold medals\n\n• Elected president of the Brazilian Paralympic Committee's Athletes' Commission (2025)",
    wikiUrl: "https://en.wikipedia.org/wiki/L%C3%BAcia_Teixeira",
    nationality: { country: "Brazil", flag: "🇧🇷" }
  },
  zeeshanAbbasi: {
    name: "Zeeshan Abbasi",
    achievement: "Pakistan Blind Cricket Captain",
    condition: "Partial Blindness (B2 Category)",
    years: "Born 1982",
    onset: "From birth",
    simulation: "zeeshan-b2-partial-blindness",
    description: "Zeeshan Abbasi is a B2 category athlete, meaning he can distinguish shapes at close range with visual acuity of 2/60. He sees the world as severely blurred with limited contrast and tunnel-like peripheral awareness.\n\n• Former captain of Pakistan's blind cricket team\n\n• Led Pakistan to two World Cup finals\n\n• Four-time World Cup Best Bowler award winner\n\n• Pakistan's Pride of Performance Award recipient (2013)",
    nationality: { country: "Pakistan", flag: "🇵🇰" }
  },
  lahjaIshitile: {
    name: "Lahja Ishitile",
    achievement: "Paralympic Gold Medalist, 'Ferrari' of Namibia",
    condition: "Progressive Blindness (T11 Classification)",
    years: "Born (Contemporary)",
    onset: "Age 7, completely blind by 11",
    simulation: "complete-blindness",
    description: "Lahja Ishitile began losing her eyesight at age 7 due to a medical condition and was completely blind by age 11. She began running at Eluwa Special School in Ongwediva, Namibia, and rose to become one of Africa's fastest blind sprinters.\n\nNicknamed 'Ferrari' for her blistering speed, she competes in the T11 category (total blindness) with guide runner Sem Shimanda.\n\n• Paralympic gold medalist in women's T11 400m at 2024 Paris Paralympics (Paralympic record: 56.20 seconds)\n\n• Bronze medal in women's T11 200m at 2024 Paris Paralympics\n\n• Silver medal at 2023 World Para Athletics Championships\n\n• Flag bearer for Namibia at the 2024 Paris Paralympics Opening Ceremony\n\n• Currently pursuing a Bachelor of Library and Information Science at the University of Namibia",
    wikiUrl: "https://en.wikipedia.org/wiki/Lahja_Ishitile",
    nationality: { country: "Namibia", flag: "🇳🇦" }
  },
  roniOhayon: {
    name: "Roni Ohayon",
    achievement: "Paralympic Silver Medalist, Goalball",
    condition: "Congenital Visual Impairment (Left Eye Blind)",
    years: "Born 1999",
    onset: "From birth",
    simulation: "roni-congenital-blindness",
    description: "Roni Ohayon was born in Beersheba, Israel, with multiple visual impairments including complete blindness in her left eye and severe difficulty seeing in her right eye. She is legally blind and uses a guide dog.\n\nShe started playing goalball in the 4th grade at a center for the blind, joined the reserve team at age 13, and later moved to the senior national team.\n\n• Paralympic silver medalist with Israel in women's goalball at the 2024 Paris Paralympics\n\n• Advocate for disability rights — won a landmark court case against Israel Railways after being refused her paid disabled seat\n\n• Plays centre position for the Israeli national goalball team",
    wikiUrl: "https://en.wikipedia.org/wiki/Roni_Ohayon",
    nationality: { country: "Israel", flag: "🇮🇱" }
  },
  taonereBanda: {
    name: "Taonere Banda",
    achievement: "First Paralympian from Malawi",
    condition: "Untreated Cataracts (Near-Total Blindness)",
    years: "Born 1996",
    onset: "Infancy, from untreated cataracts",
    simulation: "taonere-cataract-blindness",
    description: "Taonere Banda was born in Malawi with cataracts that went untreated in infancy, leaving her almost totally blind. Despite growing up in a country with virtually no Paralympic infrastructure, she became Malawi's pioneering para-athlete.\n\n• First athlete to represent Malawi at a Paralympic Games (2016 Rio de Janeiro)\n\n• Competed at the 2020 Tokyo Paralympics as a middle-distance runner\n\n• Sightsavers Equal World campaign ambassador, fighting for inclusive education\n\n• Advocates for children with disabilities to have the right to attend school and fully participate in society",
    wikiUrl: "https://en.wikipedia.org/wiki/Taonere_Banda",
    nationality: { country: "Malawi", flag: "🇲🇼" }
  },
  nojimMaiyegun: {
    name: "Nojim Maiyegun",
    achievement: "Nigeria's First Olympic Medalist",
    condition: "Progressive Blindness from Boxing Trauma",
    years: "1941-2024",
    onset: "Gradual from ~1973, fully blind by 2012",
    simulation: "complete-blindness",
    description: "Nojim Maiyegun won the bronze medal in light middleweight boxing at the 1964 Tokyo Olympics, becoming Nigeria's first-ever Olympic medalist. Around 1973, he gradually lost his vision — doctors attributed it to repeated head trauma from boxing.\n\nDespite his deteriorating sight, he fought a World Championship bout against Domenico Tiberia in December 1973, losing only on points — making him the first blind boxer to fight for a title. He became fully blind by 2012.\n\n• Nigeria's first Olympic medalist (bronze, 1964 Tokyo)\n\n• First blind boxer to fight for a world title\n\n• After going completely blind, climbed a 1,700-metre mountain and parachuted down\n\n• Lived his later years in Austria, largely uncelebrated by Nigeria despite his historic achievement",
    wikiUrl: "https://en.wikipedia.org/wiki/Nojim_Maiyegun",
    nationality: { country: "Nigeria", flag: "🇳🇬" }
  },
  mikhalinaLysova: {
    name: "Mikhalina Lysova",
    achievement: "5x Paralympic Gold, Biathlon & Cross-Country",
    condition: "Congenital Visual Impairment",
    years: "Born 1992",
    onset: "From birth",
    simulation: "lysova-low-vision",
    description: "Mikhalina Lysova has had weak vision since birth. She began her sporting career in 2002 in Nizhny Tagil, Russia, and became one of the most decorated Paralympic winter athletes in history.\n\nShe competes in visually impaired categories in both biathlon and cross-country skiing.\n\n• 5 Paralympic gold medals across three Winter Paralympics (2010, 2014, 2018)\n\n• Won 5 medals on debut at the 2010 Vancouver Paralympics including gold in cross-country skiing\n\n• 6 medals at the 2014 Sochi Paralympics including 3 golds; Russia's flag bearer at closing ceremony\n\n• Won gold in biathlon at the 2018 PyeongChang Paralympics competing as a Neutral Paralympic Athlete",
    wikiUrl: "https://en.wikipedia.org/wiki/Mikhalina_Lysova",
    nationality: { country: "Russia", flag: "🇷🇺" }
  },
  andrewJeptha: {
    name: "Andrew Jeptha",
    achievement: "First Black British Boxing Champion",
    condition: "Progressive Boxing-Related Blindness",
    years: "1879-1931",
    onset: "Progressive eye damage, nearly blind by 1910",
    simulation: "complete-blindness",
    description: "Andrew Daries Jeptha was born in Cape Town and came to England in 1902. He had been experiencing eye damage before his historic title fight, and in October 1909 a bout against Jim Doran permanently destroyed the sight in his right eye. By 1910, nearly blind, he retired from boxing.\n\nAfter returning to South Africa, he could be seen selling a self-authored booklet on the sidewalks of Adderley Street, Cape Town.\n\n• First Black boxer to win a British boxing title — welterweight champion (25 March 1907)\n\n• Knocked out Curly Watson in the fourth round at Wonderland, Whitechapel Road, London\n\n• Author of 'A South African Boxer in Britain — Experiences of Andrew Jephta'\n\n• Won his passage to England by winning a competition organized by visiting world champion Kid McCoy",
    wikiUrl: "https://en.wikipedia.org/wiki/Andrew_Jeptha",
    nationality: { country: "South Africa", flag: "🇿🇦" }
  },
  michaelBarredo: {
    name: "Michael Barredo",
    achievement: "Founding President, Paralympic Committee of Philippines",
    condition: "Bilateral Traumatic Blindness (Car Accident)",
    years: "Born 1955",
    onset: "Age 24, car accident in 1979",
    simulation: "complete-blindness",
    description: "Michael Barredo became completely blind at age 24 when a car accident in 1979 sent his head through a windshield, destroying his right eye immediately. Despite 10 surgeries including 3 in the United States, doctors could not save his left eye.\n\nBefore the accident, he was a multi-sport varsity athlete at De La Salle University.\n\n• Founding President of the Paralympic Committee of the Philippines (1997)\n\n• 5th President of the International Blind Sports Federation (IBSA, 2005-2013)\n\n• First person with a disability to serve on the Philippine Sports Commission\n\n• Paralympic Order recipient (2013) — highest honor in the Paralympic Movement, first Filipino to receive it\n\n• Co-authored the White Cane Act of 1989",
    wikiUrl: "https://en.wikipedia.org/wiki/Michael_Barredo",
    nationality: { country: "Philippines", flag: "🇵🇭" }
  }
};
