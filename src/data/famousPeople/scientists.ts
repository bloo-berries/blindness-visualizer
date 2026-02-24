import { PersonData } from './types';

export const scientists: Record<string, PersonData> = {
  mona: {
    name: "Dr. Mona Minkara",
    achievement: "Blind Chemist, NSF CAREER Award",
    condition: "Macular Degeneration + Cone-Rod Dystrophy",
    years: "Born 1984",
    onset: "Early childhood, progressive",
    simulation: "minkara-end-stage-complete",
    description: "Dr. Mona Minkara has combined macular degeneration and cone-rod dystrophy, resulting in near-total vision loss affecting both central and peripheral vision.\n\nThe dual conditions create severe blur, loss of color perception, and extreme light sensitivity.\n\n• Blind chemist and computational biologist at Northeastern University\n\n• Uses sonification and tactile models to conduct molecular dynamics research\n\n• Pioneering accessible STEM education methods\n\n• NSF CAREER Award recipient",
    wikiUrl: "https://en.wikipedia.org/wiki/Mona_Minkara",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  joshua: {
    name: "Joshua Miele",
    achievement: "MacArthur 'Genius' Fellowship Recipient",
    condition: "Chemical Burn Trauma",
    years: "Born 1972",
    onset: "Age 4, complete blindness",
    simulation: "joshua-complete-blindness",
    description: "Joshua Miele became completely blind at age 4 when a family acquaintance threw acid on him, causing severe corneal scarring and tissue destruction.\n\nHe has no light perception.\n\n• MacArthur 'Genius' Fellowship recipient (2021)\n\n• Developed tactile maps, accessible graphics, and sonification tools for blind users\n\n• Senior researcher at Smith-Kettlewell Eye Research Institute\n\n• Principal accessibility researcher at Amazon",
    wikiUrl: "https://en.wikipedia.org/wiki/Joshua_Miele",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  geerat: {
    name: "Geerat Vermeij",
    achievement: "MacArthur Fellow, Evolutionary Biologist",
    condition: "Congenital Glaucoma",
    years: "Born 1946",
    onset: "From birth",
    simulation: "geerat-congenital-glaucoma",
    description: "Geerat Vermeij was born with congenital glaucoma, causing complete blindness from birth. He has never had visual experience and relies entirely on touch and other senses to understand the world.\n\n• Distinguished Professor of Geology at UC Davis\n\n• Revolutionary evolutionary biologist who studies fossils and shells by touch\n\n• Discovered key patterns in evolution by feeling specimen surfaces other scientists overlooked\n\n• MacArthur 'Genius' Fellowship recipient",
    wikiUrl: "https://en.wikipedia.org/wiki/Geerat_Vermeij",
    nationality: { country: "Netherlands", flag: "🇳🇱" }
  },
  amyBower: {
    name: "Dr. Amy Bower",
    achievement: "Senior Scientist, Woods Hole Oceanographic",
    condition: "Macular Degeneration & Retinitis Pigmentosa",
    years: "Born 1957",
    onset: "Age 24, progressive",
    simulation: "amy-amd-rp",
    description: "Dr. Amy Bower was diagnosed at 24 with juvenile macular degeneration and retinitis pigmentosa. She retains a 'small crescent-shaped sliver' of vision and light perception, watching her sight slowly slip away over decades.\n\nShe uses screen magnifiers, screen readers, and a service dog.\n\n• Senior Scientist at Woods Hole Oceanographic Institution\n\n• Groundbreaking research on ocean currents using sound and non-visual methods\n\n• Pioneer in making oceanographic research accessible",
    wikiUrl: "https://en.wikipedia.org/wiki/Amy_Bower",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  gustafDalen: {
    name: "Gustaf Dalén",
    achievement: "Nobel Prize in Physics (1912)",
    condition: "Blindness from Explosion Accident",
    years: "1869-1937",
    onset: "Age 43, from explosion in 1912",
    simulation: "complete-blindness",
    description: "Gustaf Dalén became completely blind in 1912 when an acetylene experiment exploded during testing. The accident destroyed both eyes, leaving him with no light perception.\n\n• Nobel Prize in Physics (1912) for automatic regulators for lighthouse illumination - awarded while recovering from the accident\n\n• Continued as managing director of AGA despite blindness\n\n• Invented the AGA cooker (still sold today as Aga range cookers)\n\n• Held over 100 patents",
    wikiUrl: "https://en.wikipedia.org/wiki/Gustaf_Dal%C3%A9n",
    nationality: { country: "Sweden", flag: "🇸🇪" }
  },
  jacobBolotin: {
    name: "Jacob Bolotin",
    achievement: "World's First Blind Licensed Physician",
    condition: "Congenital Blindness",
    years: "1888-1924",
    onset: "From birth",
    simulation: "complete-blindness",
    description: "Jacob Bolotin was born completely blind, with no light perception from birth. He overcame immense barriers in medical education at a time when blind people were expected to live in institutions.\n\n• World's first totally blind licensed physician\n\n• Specialized in diseases of the heart and lungs\n\n• Strong advocate for employment and integration of blind individuals\n\n• Proved that blindness need not be a barrier to professional achievement",
    wikiUrl: "https://en.wikipedia.org/wiki/Jacob_Bolotin",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  josephPlateau: {
    name: "Joseph Plateau",
    achievement: "Invented the Phenakistoscope (Proto-Cinema)",
    condition: "Solar Retinopathy → Total Blindness",
    years: "1801-1883",
    onset: "Initial damage ~1829, total blindness by 1843",
    simulation: "plateau-solar-retinopathy",
    description: "Joseph Plateau damaged his retinas through prolonged direct solar observation around 1829, leading to progressive deterioration and total blindness by 1843.\n\nHe experienced a dark central scotoma (blind spot at fixation point), preserved peripheral vision initially, severe acuity loss, and persistent afterimages from the solar damage. Over ~14 years, his remaining vision gradually dimmed until complete blindness.\n\n• Invented the phenakistoscope - precursor to modern cinema and animation\n\n• Made fundamental contributions to understanding visual perception and persistence of vision\n\n• Continued scientific work after blindness with help from family and colleagues\n\n• Plateau's laws of soap films still used in mathematics and physics",
    wikiUrl: "https://en.wikipedia.org/wiki/Joseph_Plateau",
    nationality: { country: "Belgium", flag: "🇧🇪" }
  },
  euler: {
    name: "Leonhard Euler",
    achievement: "Greatest Mathematician in History",
    condition: "Asymmetric Progressive Blindness",
    years: "1707-1783",
    onset: "Right eye lost at 31 (infection), left eye failed at 64 (cataract)",
    simulation: "euler-asymmetric-blindness",
    description: "Leonhard Euler lost his right eye completely around 1738 from a severe fever/infection, leaving that side in total darkness. His left eye developed a progressive cataract, creating milky fog, glare sensitivity, and washed-out colors that worsened until total blindness by 1771.\n\nFor ~33 years he worked with only his left eye, then ~12 years in complete darkness.\n\n• One of the greatest mathematicians in history\n\n• Produced roughly half of his life's work after becoming totally blind\n\n• Made fundamental contributions to calculus, graph theory, mechanics, and optics\n\n• Dictated research to assistants, including his children",
    wikiUrl: "https://en.wikipedia.org/wiki/Leonhard_Euler",
    nationality: { country: "Switzerland", flag: "🇨🇭" }
  },
  wanda: {
    name: "Wanda Díaz-Merced",
    achievement: "Director of Arecibo Observatory",
    condition: "Degenerative Diabetic Retinopathy",
    years: "Born (Contemporary)",
    onset: "Early twenties",
    simulation: "wanda-diabetic-retinopathy",
    description: "Wanda Díaz-Merced lost her sight in her early twenties due to complications from degenerative diabetic retinopathy.\n\nRather than abandon her career, she pioneered new methods to study astronomical data.\n\n• Director of the Arecibo Observatory\n\n• Pioneered sonification to turn astronomical data into audible sound\n\n• Discovered patterns in stellar radio data through audio that were obscured visually\n\n• Named one of BBC's 7 most trailblazing women in science",
    wikiUrl: "https://en.wikipedia.org/wiki/Wanda_D%C3%ADaz-Merced",
    nationality: { country: "Puerto Rico", flag: "🇵🇷" }
  },
  abraham: {
    name: "Abraham Nemeth",
    achievement: "Invented Nemeth Braille Code for Math",
    condition: "Congenital Dual-Attack Blindness",
    years: "1918-2013",
    onset: "From birth - central + peripheral vision loss",
    simulation: "abraham-dual-attack-blindness",
    description: "Abraham Nemeth was born with a dual-attack condition affecting both central vision (macular degeneration component) and peripheral vision (retinitis pigmentosa component), leaving only a fragile mid-peripheral ring.\n\nEducated at a school for the blind from childhood, his functional vision was minimal to none throughout life - effectively total blindness.\n\n• Developed the Nemeth Braille Code for Mathematics and Science Notation - still the standard worldwide\n\n• Professor of mathematics who made STEM accessible to blind students\n\n• His code enables transcription of complex equations, calculus, and scientific notation into braille",
    wikiUrl: "https://en.wikipedia.org/wiki/Abraham_Nemeth",
    nationality: { country: "United States", flag: "🇺🇸" }
  }
};
