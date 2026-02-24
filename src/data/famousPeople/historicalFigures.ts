import { PersonData } from './types';

export const historicalFigures: Record<string, PersonData> = {
  milton: {
    name: "John Milton",
    achievement: "Author of Paradise Lost",
    condition: "Bilateral Retinal Detachment & Secondary Glaucoma",
    years: "1608-1674",
    onset: "Age 36, complete blindness by 43",
    simulation: "glaucoma-halos progressive-loss",
    description: "Milton experienced progressive vision loss with temporal field defects, photophobia, and 'rainbow halos' around lights - classic symptoms of glaucoma with corneal edema.\n\nHis condition progressed from partial to complete blindness over 7 years.\n\n• Author of 'Paradise Lost,' composed entirely after going blind\n\n• Dictated his epic poems to his daughters and assistants\n\n• Served as Secretary for Foreign Tongues under Oliver Cromwell",
    wikiUrl: "https://en.wikipedia.org/wiki/John_Milton",
    nationality: { country: "United Kingdom", flag: "🇬🇧" }
  },
  braille: {
    name: "Louis Braille",
    achievement: "Invented the Braille System",
    condition: "Sympathetic Ophthalmia",
    years: "1809-1852",
    onset: "Injury at age 3, blind by 5",
    simulation: "complete-blindness",
    description: "After injuring his right eye with an awl in his father's workshop, young Louis developed sympathetic ophthalmia - an autoimmune response that attacked both eyes, leading to complete bilateral blindness with no light perception.\n\n• Invented the Braille system at age 15, revolutionizing literacy for blind people worldwide\n\n• Became a teacher at the Royal Institute for Blind Youth in Paris\n\n• His system remains the primary tactile reading method used globally today",
    wikiUrl: "https://en.wikipedia.org/wiki/Louis_Braille",
    nationality: { country: "France", flag: "🇫🇷" }
  },
  galileo: {
    name: "Galileo Galilei",
    achievement: "Father of Modern Science",
    condition: "Acute Angle-Closure Glaucoma",
    years: "1564-1642",
    onset: "Age 68, complete blindness by 72",
    simulation: "acute-glaucoma-attacks",
    description: "Galileo suffered from acute angle-closure glaucoma attacks with sudden onset symptoms including intense rainbow halos, severe blurring, red eye effects, and extreme photophobia.\n\nEach attack caused cumulative damage leading to sectoral defects, arcuate scotomas, and eventual complete blindness.\n\n• 'Father of Modern Science' and 'Father of Modern Physics'\n\n• Discovered Jupiter's moons, Saturn's rings, and sunspots through his telescope\n\n• Continued scientific work after blindness, including mechanics and pendulum theory",
    wikiUrl: "https://en.wikipedia.org/wiki/Galileo_Galilei",
    nationality: { country: "Italy", flag: "🇮🇹" }
  },
  harriet: {
    name: "Harriet Tubman",
    achievement: "Underground Railroad Conductor",
    condition: "Traumatic Brain Injury",
    years: "1822-1913",
    onset: "Age 12, from head trauma",
    simulation: "harriet-tunnel-vision",
    description: "Harriet Tubman suffered a severe head injury at age 12 when an overseer threw a heavy metal weight at another slave, hitting her instead.\n\nThis caused a traumatic brain injury resulting in narcolepsy, visions, and vision problems including tunnel vision.\n\n• Legendary conductor of the Underground Railroad\n\n• Led approximately 70 enslaved people to freedom in about 13 missions\n\n• Served as scout, spy, and nurse for the Union Army during the Civil War",
    wikiUrl: "https://en.wikipedia.org/wiki/Harriet_Tubman",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  moon: {
    name: "William Moon",
    achievement: "Invented Moon Type Reading System",
    condition: "Scarlet Fever Complications",
    years: "1818-1894",
    onset: "Lost one eye as child, completely blind by 21",
    simulation: "moon-complete-blindness",
    description: "William Moon lost sight in one eye from scarlet fever as a small child, and by age 21 had become totally blind.\n\nHe realized existing embossed reading codes were difficult to learn and set out to create a simpler system.\n\n• Invented Moon type (1845), a simplified tactile reading alphabet still used today\n\n• Designed his system to be easier to learn than Braille for those who lose sight later in life\n\n• Fellow of the Royal Geographical Society and Royal Society of Arts\n\n• Received honorary LLD degree from the University of Philadelphia",
    wikiUrl: "https://en.wikipedia.org/wiki/Moon_type",
    nationality: { country: "United Kingdom", flag: "🇬🇧" }
  },
  homer: {
    name: "Homer",
    achievement: "Author of the Iliad & Odyssey",
    condition: "Traditionally Believed Blind",
    years: "Exact dates unknown (8th century BCE)",
    onset: "Unknown",
    simulation: "homer-traditional-blindness",
    description: "Homer is the legendary ancient Greek epic poet traditionally credited with composing the Iliad and the Odyssey.\n\nWhile historical details are uncertain, tradition holds that he was blind.\n\n• Credited with composing the foundational works of Western literature\n\n• The Iliad and Odyssey shaped Greek culture and education for millennia\n\n• His epic poems continue to be studied and admired worldwide",
    wikiUrl: "https://en.wikipedia.org/wiki/Homer",
    nationality: { country: "Greece", flag: "🇬🇷" }
  },
  fanny: {
    name: "Fanny Crosby",
    achievement: "Wrote Over 8,000 Hymns",
    condition: "Iatrogenic Blindness in Infancy",
    years: "1820-1915",
    onset: "6 weeks old",
    simulation: "fanny-iatrogenic-blindness",
    description: "Fanny Crosby became blind at 6 weeks old due to improper medical treatment by a man posing as a doctor who applied hot poultices to her inflamed eyes, scarring her corneas permanently.\n\n• Wrote over 8,000 hymns, making her one of the most prolific hymn writers in history\n\n• Famous hymns include 'Blessed Assurance' and 'To God Be the Glory'\n\n• One of the most influential hymn writers in American history",
    wikiUrl: "https://en.wikipedia.org/wiki/Fanny_Crosby",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  saunderson: {
    name: "Nicholas Saunderson",
    achievement: "Lucasian Professor of Mathematics",
    condition: "Blindness from Smallpox",
    years: "1682-1739",
    onset: "Age 1",
    simulation: "saunderson-smallpox-blindness",
    description: "Nicholas Saunderson became blind from smallpox at age 1, losing both his eyes to the disease.\n\nDespite never having visual memory, he developed exceptional mathematical abilities.\n\n• Lucasian Professor of Mathematics at Cambridge University (a position held by Newton and later Hawking)\n\n• Developed innovative teaching methods for mathematics\n\n• Invented a calculating board that allowed him to perform complex arithmetic by touch",
    wikiUrl: "https://en.wikipedia.org/wiki/Nicholas_Saunderson",
    nationality: { country: "United Kingdom", flag: "🇬🇧" }
  },
  holman: {
    name: "James Holman",
    achievement: "First Blind Person to Circumnavigate Globe",
    condition: "Illness-Related Blindness",
    years: "1786-1857",
    onset: "Age 25, from illness while serving in Royal Navy",
    simulation: "holman-complete-blindness",
    description: "James Holman, known as the 'Blind Traveller,' became completely blind at age 25 due to an illness while serving in the Royal Navy.\n\nHe pioneered the use of human echolocation for navigation.\n\n• First blind person to circumnavigate the globe (1832)\n\n• Traveled extensively through Europe, Asia, Africa, and the Americas\n\n• Elected Fellow of the Royal Society",
    wikiUrl: "https://en.wikipedia.org/wiki/James_Holman",
    nationality: { country: "United Kingdom", flag: "🇬🇧" }
  },
  maryIngalls: {
    name: "Mary Ingalls",
    achievement: "Immortalized in Little House Books",
    condition: "Viral Meningoencephalitis",
    years: "1865-1928",
    onset: "Age 14, from brain fever",
    simulation: "complete-blindness",
    description: "Mary Ingalls, older sister of author Laura Ingalls Wilder, went blind at age 14. A 2013 University of Michigan study found she likely had viral meningoencephalitis ('brain fever'), not scarlet fever as written in the books.\n\nContemporary newspapers reported 'hemorrhage of the brain' with partial facial paralysis.\n\n• Attended the Iowa College for the Blind\n\n• Consistently rated 'very smart' by her teachers\n\n• Her story was immortalized in her sister's 'Little House' books",
    wikiUrl: "https://en.wikipedia.org/wiki/Mary_Ingalls",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  francisCampbell: {
    name: "Sir Francis Joseph Campbell",
    achievement: "First Blind Person to Climb Mont Blanc",
    condition: "Blindness from Accident",
    years: "1832-1914",
    onset: "Age 5, from accident",
    simulation: "complete-blindness",
    description: "Sir Francis Joseph Campbell lost his sight at age 5 following an accident.\n\nA talented musician, he dedicated his life to education for the blind.\n\n• Co-founder and first principal of the Royal National College for the Blind\n\n• Anti-slavery campaigner\n\n• First blind person to climb Mont Blanc\n\n• Knighted by King Edward VII in 1909",
    wikiUrl: "https://en.wikipedia.org/wiki/Francis_Campbell_(educator)",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  belaTheBlind: {
    name: "Béla II of Hungary (Béla the Blind)",
    achievement: "King of Hungary & Croatia (1131-1141)",
    condition: "Blindness from Childhood Trauma",
    years: "c. 1109-1141",
    onset: "From birth or early childhood",
    simulation: "complete-blindness",
    description: "Béla II was blinded as a child along with his father Álmos by his uncle, King Coloman of Hungary, in an attempt to prevent them from claiming the throne.\n\n• King of Hungary and Croatia from 1131 to 1141\n\n• Successfully ruled Hungary for a decade despite his blindness\n\n• Governed with assistance from his wife Helena and son Géza II",
    wikiUrl: "https://en.wikipedia.org/wiki/B%C3%A9la_II_of_Hungary",
    nationality: { country: "Hungary", flag: "🇭🇺" }
  },
  johnOfBohemia: {
    name: "John of Bohemia",
    achievement: "Warrior King, Died Heroically at Crécy",
    condition: "Blindness from Eye Disease",
    years: "1296-1346",
    onset: "Age 40, around 1336",
    simulation: "complete-blindness",
    description: "John of Bohemia, also known as John the Blind, became blind around 1336 from an eye disease, possibly from an infection contracted during a crusade.\n\n• King of Bohemia and Count of Luxembourg from 1310 until his death\n\n• Continued to participate in military campaigns after losing his sight\n\n• Died heroically at the Battle of Crécy (1346), with his knights tying their horses to his so they could fight together",
    wikiUrl: "https://en.wikipedia.org/wiki/John_of_Bohemia",
    nationality: { country: "Czech Republic", flag: "🇨🇿" }
  },
  surdas: {
    name: "Surdas",
    achievement: "Legendary Hindu Devotional Poet",
    condition: "Congenital Blindness",
    years: "c. 1478-1583",
    onset: "Traditionally from birth",
    simulation: "surdas-complete-blindness",
    description: "Surdas was a 16th-century blind Hindu devotional poet and singer, traditionally believed to have been blind from birth.\n\nHis vivid descriptions of Lord Krishna transcend his physical blindness.\n\n• Author of 'Sur Sagar' (Sur's Ocean), containing vivid descriptions of Krishna's childhood\n\n• Elevated Braj Bhasha from a common dialect to a literary language\n\n• Key figure of the Bhakti devotional movement\n\n• To this day, blind singers in North India refer to themselves as 'Surdas' in his honor",
    wikiUrl: "https://en.wikipedia.org/wiki/Surdas",
    nationality: { country: "India", flag: "🇮🇳" }
  }
};
