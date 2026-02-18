import { PersonData } from './types';

export const athletes: Record<string, PersonData> = {
  erik: {
    name: "Erik Weihenmayer",
    condition: "Juvenile Retinoschisis",
    years: "Born 1968",
    onset: "Diagnosed at 4, blind by 13",
    simulation: "erik-retinoschisis-islands",
    description: "Retinoschisis causes splitting of retinal layers. Erik's vision deteriorated progressively, with isolated 'islands' of vision gradually disappearing until complete blindness at 13. He became the first blind person to summit Mount Everest. Discover more at erikweihenmayer.com."
  },
  marla: {
    name: "Marla Runyan",
    condition: "Stargardt Disease",
    years: "Born 1969",
    onset: "Age 9, progressive",
    simulation: "marla-stargardt-complete",
    description: "Stargardt disease causes progressive macular degeneration. Marla has a large central blind spot with preserved peripheral vision, making it difficult to see faces or read but allowing navigation using side vision. First legally blind athlete in Olympics. Learn more at teamusa.com."
  },
  anastasia: {
    name: "Anastasia Pagonis",
    condition: "Stargardt Disease",
    years: "Born 2004",
    onset: "Age 11, progressive",
    simulation: "anastasia-stargardt",
    description: "Anastasia Pagonis is a Paralympic swimmer who has Stargardt disease, a form of juvenile macular degeneration. Despite her visual impairment, she has become a world-class athlete, winning multiple Paralympic medals and setting world records. She is an inspiration to young athletes with disabilities. Learn more at teamusa.com."
  },
  sugar: {
    name: "Sugar Ray Leonard",
    condition: "Partial Retinal Detachment",
    years: "Born 1956",
    onset: "Left eye in 1982, surgery May 1982",
    simulation: "sugar-retinal-detachment",
    description: "Sugar Ray Leonard suffered a partial retinal detachment in his left eye in 1982. Symptoms included a dark curtain/shadow encroaching from the periphery, numerous floaters, and flashes of light at the edges of vision. The condition caused progressive vision loss that threatened to engulf his central vision. After surgery, he initially retired but later returned to boxing. Learn more at en.wikipedia.org."
  },
  stephen: {
    name: "Stephen Curry",
    condition: "Keratoconus",
    years: "Born 1988",
    onset: "Diagnosed in college",
    simulation: "stephen-keratoconus",
    description: "Stephen Curry has keratoconus, where the cornea thins into an irregular cone shape. Before correction, his vision featured directional blur (coma aberration) where every edge smeared into comet-like tails, multiple ghost images offset from objects, irregular halos streaming from lights, and wavy distortion of straight lines. Despite shooting at a basketball hoop that appeared as a blurred, ghosted, wavering ring with multiple faint echoes, he became the greatest shooter in NBA history. Learn more at en.wikipedia.org."
  },
  lex: {
    name: "Lex Gillette",
    condition: "Recurrent Retinal Detachments (ROP)",
    years: "Born 1984",
    onset: "Left eye blind from birth; right eye progressive loss age 8+",
    simulation: "lex-rop",
    description: "Lex Gillette was born premature with retinopathy of prematurity, leaving his left eye blind from birth. His right eye functioned until age 8 when recurrent retinal detachments began - cycles of hope and loss as surgery would restore vision only for the retina to detach again, leaving more damage each time. The clear zone shrank with each cycle until one day, as he describes it, there was simply 'a little less each morning' until nothing remained. Despite total blindness, he became a four-time Paralympic silver medalist in long jump. Learn more at teamusa.com."
  },
  davidBrown: {
    name: "David Brown",
    condition: "Kawasaki Disease → Glaucoma",
    years: "Born 1992",
    onset: "Left eye age 3; right eye progressive loss to age 13",
    simulation: "david-brown-kawasaki",
    description: "David Brown's vision changed in two phases. Kawasaki disease at 15 months triggered glaucoma in both eyes. His left eye went dark at age 3, and his right eye is described as seeing through a dirty-glass haze with rainbow halos around every light. At 13, Glaucoma took his remaining vision. Despite ongoing pain from elevated eye pressure, he became the fastest totally blind man in history, winning Paralympic gold in 2016. Learn more at teamusa.com."
  },
  anthonyClarke: {
    name: "Anthony Clarke",
    condition: "Blindness from Car Accident",
    years: "Born 1961",
    onset: "Age 17, from car accident",
    simulation: "complete-blindness",
    description: "Anthony 'Tony' Clarke is an Australian Paralympic judoka and the only Australian to win a gold medal in judo at the Paralympics, achieving this feat at the 1996 Atlanta Games. He became blind at age 17 following a car accident. He represented Australia at five Summer Paralympic Games and won two International Blind Sports Association (IBSA) World Championships. He was awarded the Medal of the Order of Australia (OAM) in 1997. Learn more at en.wikipedia.org."
  },
  crazzySteve: {
    name: "Crazzy Steve",
    condition: "Congenital Blindness",
    years: "Professional Wrestling",
    onset: "From birth",
    simulation: "complete-blindness",
    description: "Crazzy Steve is a professional wrestler who is blind from birth. Despite his visual impairment, he has achieved success in professional wrestling, competing in various promotions and demonstrating that blindness does not prevent someone from pursuing a career in sports entertainment. Learn more at en.wikipedia.org."
  },
  tofiri: {
    name: "Tofiri Kibuuka",
    condition: "Degenerative Sight Disease",
    years: "Born (Contemporary)",
    onset: "Age 13",
    simulation: "tofiri-complete-blindness",
    description: "Tofiri Kibuuka is a Ugandan-Norwegian Paralympic athlete and physiotherapist who made history as Africa's first winter Para athlete at the 1976 Paralympic Winter Games in Sweden, competing in cross-country skiing for Uganda. He lost his sight at age 13 due to a degenerative disease. Kibuuka later acquired Norwegian citizenship and switched to athletics, winning five silver medals and one bronze medal at Paralympic Games between 1984 & 1992. He was honored as Norway's flag bearer at the 1996 Atlanta Paralympic Games, becoming the first black man to carry the Norwegian flag at a Paralympics. Kibuuka also became one of the first blind people to climb Mount Kilimanjaro. Learn more at paralympic.org."
  },
  ross: {
    name: "Ross Minor",
    condition: "Gunshot Wound",
    years: "Born (Contemporary)",
    onset: "Age 8",
    simulation: "ross-complete-blindness",
    description: "Ross Minor is an American accessibility consultant, content creator, and former para swimmer. He lost his sight at the age of eight and has dedicated his career to promoting accessibility in gaming, media, and technology. Minor works as an accessibility consultant helping companies make their products and services more accessible to people with disabilities. As a former para swimmer, he competed in swimming events for athletes with disabilities. Learn more at rossminor.com."
  },
  trischa: {
    name: "Trischa Zorn",
    condition: "Aniridia",
    years: "Born 1964",
    onset: "From birth",
    simulation: "trischa-aniridia",
    description: "Trischa Zorn was born with Aniridia, a rare congenital genetic eye disorder in which the iris fails to develop properly. Born legally blind, Zorn became the most successful athlete in Paralympic history, competing in seven consecutive Paralympic Games from 1980 to 2004 and winning 55 medals (41 gold, 9 silver, 5 bronze). After her swimming career, she earned a Juris Doctor degree and works for the Department of Veterans Affairs. Zorn has been inducted into the International Paralympic Hall of Fame, the U.S. Olympic & Paralympic Hall of Fame, and the International Swimming Hall of Fame. Learn more at ishof.org."
  },
  henry: {
    name: "Henry Wanyoike",
    condition: "Stroke-Induced Blindness",
    years: "Born 1974",
    onset: "Age 21, from stroke in 1995",
    simulation: "henry-stroke-blindness",
    description: "Henry Wanyoike lost 95% of his vision overnight on May 1, 1995, when a stroke damaged his optic nerves. He lost the remaining vision gradually over the following years. After struggling with depression, he discovered he could run with a guide and became a world-class Paralympic athlete. He won gold medals at the Sydney 2000 Paralympics (5000m) and Athens 2004 Paralympics (10000m), setting world records. His famous quote: 'I lost my sight, but I gained a vision.' He founded the Henry Wanyoike Foundation and has visited over 700 schools advocating for disability rights. Learn more at kenyanheroes.com."
  }
};
