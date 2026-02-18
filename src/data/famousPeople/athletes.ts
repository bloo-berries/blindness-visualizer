import { PersonData } from './types';

export const athletes: Record<string, PersonData> = {
  erik: {
    name: "Erik Weihenmayer",
    condition: "Juvenile Retinoschisis",
    years: "Born 1968",
    onset: "Diagnosed at 4, blind by 13",
    simulation: "erik-retinoschisis-islands",
    description: "Retinoschisis causes splitting of retinal layers, leading to progressive vision loss. Erik's vision deteriorated with isolated 'islands' of vision gradually disappearing until complete blindness at age 13.\n\n• First blind person to summit Mount Everest (2001)\n\n• Climbed all Seven Summits (highest peaks on each continent)\n\n• Kayaked the entire Grand Canyon\n\n• Author and motivational speaker at erikweihenmayer.com"
  },
  marla: {
    name: "Marla Runyan",
    condition: "Stargardt Disease",
    years: "Born 1969",
    onset: "Age 9, progressive",
    simulation: "marla-stargardt-complete",
    description: "Stargardt disease causes progressive macular degeneration, destroying central vision. Marla has a large central blind spot with preserved peripheral vision, making it difficult to see faces or read but allowing navigation using side vision.\n\n• First legally blind athlete to compete in the Olympics (2000 Sydney, 2004 Athens)\n\n• Five-time U.S. national champion in various track events\n\n• Holds American record in the women's 5000m (indoor)"
  },
  anastasia: {
    name: "Anastasia Pagonis",
    condition: "Stargardt Disease",
    years: "Born 2004",
    onset: "Age 11, progressive",
    simulation: "anastasia-stargardt",
    description: "Anastasia Pagonis has Stargardt disease, a form of juvenile macular degeneration that destroys central vision while preserving peripheral sight. She lost most of her vision by age 14.\n\n• Paralympic gold medalist in swimming (Tokyo 2020, 400m freestyle)\n\n• Multiple Paralympic and world records in swimming\n\n• Social media influencer with millions of followers, raising awareness about blindness"
  },
  sugar: {
    name: "Sugar Ray Leonard",
    condition: "Partial Retinal Detachment",
    years: "Born 1956",
    onset: "Left eye in 1982, surgery May 1982",
    simulation: "sugar-retinal-detachment",
    description: "Sugar Ray Leonard suffered a partial retinal detachment in his left eye in 1982. Symptoms included a dark curtain encroaching from the periphery, numerous floaters, and flashes of light.\n\nThe condition threatened to engulf his central vision.\n\n• Olympic gold medalist in boxing (1976 Montreal)\n\n• World champion in five weight divisions\n\n• Named Fighter of the Decade for the 1980s\n\n• International Boxing Hall of Fame inductee"
  },
  stephen: {
    name: "Stephen Curry",
    condition: "Keratoconus",
    years: "Born 1988",
    onset: "Diagnosed in college",
    simulation: "stephen-keratoconus",
    description: "Stephen Curry has keratoconus, where the cornea thins into an irregular cone shape. Before correction, his vision featured directional blur (coma aberration) with every edge smearing into comet-like tails, multiple ghost images, irregular halos streaming from lights, and wavy distortion of straight lines.\n\n• Greatest shooter in NBA history\n\n• Four-time NBA champion with Golden State Warriors\n\n• Two-time NBA MVP\n\n• All-time leader in three-point field goals made"
  },
  lex: {
    name: "Lex Gillette",
    condition: "Recurrent Retinal Detachments (ROP)",
    years: "Born 1984",
    onset: "Left eye blind from birth; right eye progressive loss age 8+",
    simulation: "lex-rop",
    description: "Lex Gillette was born premature with retinopathy of prematurity, leaving his left eye blind from birth. His right eye functioned until age 8 when recurrent retinal detachments began - cycles of hope and loss as surgery would restore vision only for the retina to detach again.\n\nThe clear zone shrank each cycle until nothing remained.\n\n• Four-time Paralympic silver medalist in long jump\n\n• Multiple world records in Paralympic long jump\n\n• Motivational speaker and author of 'Fly: A Memoir'\n\n• Team USA track and field athlete"
  },
  davidBrown: {
    name: "David Brown",
    condition: "Kawasaki Disease → Glaucoma",
    years: "Born 1992",
    onset: "Left eye age 3; right eye progressive loss to age 13",
    simulation: "david-brown-kawasaki",
    description: "David Brown's vision changed in two phases. Kawasaki disease at 15 months triggered glaucoma in both eyes. His left eye went dark at age 3, while his right eye experienced a dirty-glass haze with rainbow halos around every light.\n\nBy 13, glaucoma took his remaining vision. He still experiences ongoing pain from elevated eye pressure.\n\n• Paralympic gold medalist (100m, Rio 2016) - fastest totally blind man in history\n\n• Multiple Paralympic and world championship medals\n\n• Runs with guide runner Jerome Avery"
  },
  anthonyClarke: {
    name: "Anthony Clarke",
    condition: "Blindness from Car Accident",
    years: "Born 1961",
    onset: "Age 17, from car accident",
    simulation: "complete-blindness",
    description: "Anthony 'Tony' Clarke became completely blind at age 17 following a car accident that destroyed his vision instantly.\n\n• Only Australian to win Paralympic gold in judo (1996 Atlanta)\n\n• Represented Australia at five consecutive Summer Paralympic Games\n\n• Two-time IBSA World Judo Champion\n\n• Medal of the Order of Australia (OAM) recipient (1997)"
  },
  crazzySteve: {
    name: "Crazzy Steve",
    condition: "Congenital Blindness",
    years: "Professional Wrestling",
    onset: "From birth",
    simulation: "complete-blindness",
    description: "Crazzy Steve has been completely blind from birth, with no light perception or visual memory.\n\n• Professional wrestler competing in TNA/Impact Wrestling\n\n• Former Impact World Tag Team Champion\n\n• Demonstrates that blindness does not prevent success in sports entertainment"
  },
  tofiri: {
    name: "Tofiri Kibuuka",
    condition: "Degenerative Sight Disease",
    years: "Born (Contemporary)",
    onset: "Age 13",
    simulation: "tofiri-complete-blindness",
    description: "Tofiri Kibuuka lost his sight at age 13 due to a degenerative disease that progressively destroyed his vision.\n\n• Africa's first winter Para athlete at 1976 Paralympic Winter Games (cross-country skiing for Uganda)\n\n• Five silver medals and one bronze at Paralympic Games (1984-1992)\n\n• Norway's flag bearer at 1996 Atlanta Paralympic Games - first black man to carry Norwegian flag at Paralympics\n\n• One of the first blind people to climb Mount Kilimanjaro"
  },
  ross: {
    name: "Ross Minor",
    condition: "Gunshot Wound",
    years: "Born (Contemporary)",
    onset: "Age 8",
    simulation: "ross-complete-blindness",
    description: "Ross Minor lost his sight at age 8 from a gunshot wound, resulting in complete blindness with no light perception.\n\n• Former para swimmer and competitive athlete\n\n• Accessibility consultant helping companies make products accessible to people with disabilities\n\n• Content creator raising awareness about blindness\n\n• Visit rossminor.com"
  },
  trischa: {
    name: "Trischa Zorn",
    condition: "Aniridia",
    years: "Born 1964",
    onset: "From birth",
    simulation: "trischa-aniridia",
    description: "Trischa Zorn was born with aniridia, a rare congenital genetic eye disorder where the iris fails to develop properly. The condition causes extreme light sensitivity, glare, and severely reduced visual acuity.\n\nShe is legally blind.\n\n• Most decorated athlete in Paralympic history with 55 medals (41 gold, 9 silver, 5 bronze)\n\n• Competed in seven consecutive Paralympic Games (1980-2004)\n\n• Inducted into International Paralympic Hall of Fame, U.S. Olympic & Paralympic Hall of Fame, and International Swimming Hall of Fame\n\n• Earned Juris Doctor degree and works for Department of Veterans Affairs"
  },
  henry: {
    name: "Henry Wanyoike",
    condition: "Stroke-Induced Blindness",
    years: "Born 1974",
    onset: "Age 21, from stroke in 1995",
    simulation: "henry-stroke-blindness",
    description: "Henry Wanyoike lost 95% of his vision overnight on May 1, 1995, when a stroke damaged his optic nerves. He lost the remaining vision gradually over the following years.\n\nAfter struggling with depression, he discovered he could run with a guide.\n\n• Paralympic gold medalist: Sydney 2000 (5000m) and Athens 2004 (10000m)\n\n• Multiple world records in Paralympic athletics\n\n• Founded the Henry Wanyoike Foundation\n\n• Visited over 700 schools advocating for disability rights\n\n• Famous quote: 'I lost my sight, but I gained a vision'"
  },
  zeeshanAbbasi: {
    name: "Zeeshan Abbasi",
    condition: "Partial Blindness (B2 Category)",
    years: "Born 1982",
    onset: "From birth",
    simulation: "zeeshan-b2-partial-blindness",
    description: "Zeeshan Abbasi is a B2 category athlete, meaning he can distinguish shapes at close range with visual acuity of 2/60. He sees the world as severely blurred with limited contrast and tunnel-like peripheral awareness.\n\n• Former captain of Pakistan's blind cricket team\n\n• Led Pakistan to two World Cup finals\n\n• Four-time World Cup Best Bowler award winner\n\n• Pakistan's Pride of Performance Award recipient (2013)"
  }
};
