/**
 * Data for famous blind and visually impaired people
 */

export interface PersonData {
  name: string;
  condition: string;
  years: string;
  onset: string;
  simulation: string;
  description: string;
}

export const personData: Record<string, PersonData> = {
  milton: {
    name: "John Milton",
    condition: "Bilateral Retinal Detachment & Secondary Glaucoma",
    years: "1608-1674",
    onset: "Age 36, complete blindness by 43",
    simulation: "glaucoma-halos progressive-loss",
    description: "Milton experienced progressive vision loss with temporal field defects, photophobia, and 'rainbow halos' around lights - classic symptoms of glaucoma with corneal edema. His condition progressed from partial to complete blindness over 7 years. Learn more at en.wikipedia.org."
  },
  braille: {
    name: "Louis Braille",
    condition: "Sympathetic Ophthalmia",
    years: "1809-1852",
    onset: "Injury at age 3, blind by 5",
    simulation: "complete-blindness",
    description: "After injuring his right eye with an awl in his father's workshop, young Louis developed sympathetic ophthalmia - an autoimmune response that attacked both eyes, leading to complete bilateral blindness with no light perception. Learn more at en.wikipedia.org."
  },
  galileo: {
    name: "Galileo Galilei",
    condition: "Acute Angle-Closure Glaucoma",
    years: "1564-1642",
    onset: "Age 68, complete blindness by 72",
    simulation: "acute-glaucoma-attacks",
    description: "Galileo suffered from acute angle-closure glaucoma attacks with sudden onset symptoms including intense rainbow halos, severe blurring, red eye effects, and extreme photophobia. Each attack caused cumulative damage leading to sectoral defects, arcuate scotomas, and eventual complete blindness. Learn more at en.wikipedia.org."
  },
  ray: {
    name: "Ray Charles",
    condition: "Childhood Glaucoma",
    years: "1930-2004",
    onset: "Ages 4-5, blind by 7",
    simulation: "complete-blindness",
    description: "Ray Charles experienced progressive vision loss from glaucoma starting at age 4. The increased eye pressure gradually destroyed his optic nerves, leading to complete blindness by age 7. His right eye was later removed due to pain. He had no light perception in his remaining eye. Visit raycharles.com for more information."
  },
  stevie: {
    name: "Stevie Wonder",
    condition: "Retinopathy of Prematurity (ROP)",
    years: "Born 1950",
    onset: "From birth (6 weeks premature)",
    simulation: "complete-blindness",
    description: "Born premature, Stevie received excess oxygen in his incubator which caused abnormal blood vessel growth in his retinas. This led to retinal detachment and complete blindness from infancy. Visit steviewonder.net for more information."
  },
  helen: {
    name: "Helen Keller",
    condition: "Bacterial Meningitis Complications",
    years: "1880-1968",
    onset: "19 months old",
    simulation: "complete-blindness",
    description: "A severe fever at 19 months, likely from bacterial meningitis, left Helen both blind and deaf. She had no light perception or visual input, relying entirely on touch and eventually learning to communicate through finger spelling. Learn more at womenshistory.org."
  },
  bocelli: {
    name: "Andrea Bocelli",
    condition: "Congenital Glaucoma + Trauma",
    years: "Born 1958",
    onset: "Congenital, complete at 12",
    simulation: "complete-blindness",
    description: "Born with congenital glaucoma, Bocelli retained about 10% vision until a football accident at age 12 caused a brain hemorrhage, resulting in complete blindness with no light perception. Visit andreabocelli.com for more information."
  },
  monet: {
    name: "Claude Monet",
    condition: "Cataracts",
    years: "1840-1926",
    onset: "Age 60s, legally blind by 82",
    simulation: "cataracts color-distortion",
    description: "Monet developed cataracts in his 60s, diagnosed in 1912. The cataracts clouded his vision and dramatically altered his color perception, making cool colors like blue and purple difficult to distinguish while accentuating warm tones. He described seeing 'through a fog' and by 1922 was legally blind in his right eye with only 10% vision in his left. Learn more at en.wikipedia.org."
  },
  christine: {
    name: "Christine Ha",
    condition: "Neuromyelitis Optica (NMO)",
    years: "Born 1979",
    onset: "Age 20, progressive",
    simulation: "christine-nmo-complete",
    description: "NMO causes autoimmune attacks on the optic nerves. Christine describes her vision as looking through a 'steamy mirror after a hot shower' - severely blurred with only close-range object recognition within 10-12 inches. Vision is approximately 20/1000+ with extreme blur, light scatter, and fluctuating effects. She won MasterChef season 3 and runs The Blind Cook (theblindcook.com)."
  },
  ved: {
    name: "Ved Mehta",
    condition: "Cerebrospinal Meningitis",
    years: "1934-2021",
    onset: "Age 3 years, 10 months",
    simulation: "ved-spatial-awareness",
    description: "Meningitis at age 3 resulted in complete bilateral blindness. Ved developed exceptional 'facial vision' using echolocation and air current perception for navigation. Read more at newyorker.com."
  },
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
  mona: {
    name: "Dr. Mona Minkara",
    condition: "Macular Degeneration + Cone-Rod Dystrophy",
    years: "Born 1984",
    onset: "Early childhood, progressive",
    simulation: "minkara-end-stage-complete",
    description: "Blind chemist and computational biologist with combined macular degeneration and cone-rod dystrophy. Near-total vision loss affects both central and peripheral vision. Uses sonification and tactile models to conduct groundbreaking molecular dynamics research. Learn more at monaminkara.com."
  },
  joshua: {
    name: "Joshua Miele",
    condition: "Chemical Burn Trauma",
    years: "Born 1972",
    onset: "Age 4, complete blindness",
    simulation: "joshua-complete-blindness",
    description: "Complete bilateral blindness from acid attack at age 4. No light perception due to severe corneal scarring and tissue destruction. Now a researcher developing tactile maps, accessible graphics, and sonification tools for blind users. Read his inspiring story at nytimes.com."
  },
  lucy: {
    name: "Lucy Edwards",
    condition: "Incontinentia Pigmenti",
    years: "Born 1995",
    onset: "From birth",
    simulation: "lucy-complete-vision",
    description: "Born with incontinentia pigmenti, Lucy has been blind from birth. Her vision is like looking through thick frosted glass with severe blur, desaturation, and light diffusion. She became a BBC presenter and advocate for disability representation in media. Visit her website at lucyedwards.com."
  },
  paterson: {
    name: "David Paterson",
    condition: "Optic Nerve Damage & Glaucoma",
    years: "Born 1954",
    onset: "Age 3 months, progressive",
    simulation: "david-hemispheric-vision",
    description: "An ear infection at 3 months old spread to his optic nerve, causing blindness in his left eye. Glaucoma later affected his right eye, creating a unique hemispheric vision loss. He became the 55th Governor of New York and continues his advocacy work. Learn more at governordavidpaterson.com."
  },
  paul: {
    name: "Paul Castle",
    condition: "Retinitis Pigmentosa",
    years: "Born 1980",
    onset: "Age 12, progressive",
    simulation: "paul-retinitis-pigmentosa",
    description: "Paul Castle has lost over 95% of his vision to the untreatable eye disease, Retinitis Pigmentosa. Despite this challenge, he uses adaptive tools to create his art and runs Paul Castle Studio (paulcastlestudio.com), where he creates children's books, art prints, and plushies featuring his beloved characters like Pringle & Finn. His work promotes love, inclusion, and overcoming obstacles."
  },
  harriet: {
    name: "Harriet Tubman",
    condition: "Traumatic Brain Injury",
    years: "1822-1913",
    onset: "Age 12, from head trauma",
    simulation: "harriet-tunnel-vision",
    description: "Harriet Tubman suffered a severe head injury at age 12 when an overseer threw a heavy metal weight at another slave, hitting her instead. This caused a traumatic brain injury that resulted in narcolepsy and vision problems including tunnel vision and episodes of unconsciousness. Despite these challenges, she became a legendary conductor of the Underground Railroad, leading hundreds of enslaved people to freedom. Learn more at en.wikipedia.org."
  },
  casey: {
    name: "Casey Harris",
    condition: "Retinitis Pigmentosa",
    years: "Born 1989",
    onset: "Age 5, progressive",
    simulation: "casey-retinitis-pigmentosa",
    description: "Casey Harris is the keyboardist for the band X Ambassadors and has been living with retinitis pigmentosa since childhood. Despite his visual impairment, he has become a successful musician and advocate for disability representation in the music industry. His story inspires many to pursue their dreams regardless of physical limitations. Learn more at disabilitytalent.org."
  },
  haben: {
    name: "Haben Girma",
    condition: "Deafblind",
    years: "Born 1988",
    onset: "From birth",
    simulation: "haben-deafblind",
    description: "Haben Girma is a disability rights advocate, lawyer, and the first deafblind person to graduate from Harvard Law School. She uses tactile sign language and assistive technology to communicate and has dedicated her life to advocating for equal access and inclusion for people with disabilities. Visit her website at habengirma.com."
  },
  molly: {
    name: "Molly Burke",
    condition: "Retinitis Pigmentosa",
    years: "Born 1994",
    onset: "Age 4, complete blindness by 14",
    simulation: "molly-retinitis-pigmentosa",
    description: "Molly Burke is a motivational speaker, YouTuber, and disability advocate who lost her vision to retinitis pigmentosa. She uses her platform to educate others about blindness and advocate for accessibility and inclusion. Her positive message and advocacy work have inspired millions around the world. Visit her website at mollyburkeofficial.com."
  },
  tilly: {
    name: "Tilly Aston",
    condition: "Congenital Blindness",
    years: "1873-1947",
    onset: "From birth",
    simulation: "tilly-complete-blindness",
    description: "Tilly Aston was an Australian writer, teacher, and advocate for the blind. She was the first blind person in Australia to attend university and became a prominent advocate for education and employment opportunities for people with visual impairments. Her work helped establish services for the blind in Australia. Learn more at en.wikipedia.org."
  },
  sabriye: {
    name: "Sabriye Tenberken",
    condition: "Retinitis Pigmentosa",
    years: "Born 1970",
    onset: "Childhood, complete blindness by 12",
    simulation: "sabriye-complete-blindness",
    description: "Sabriye Tenberken is a German tibetologist and co-founder of Braille Without Borders. She developed Tibetan Braille and established schools for blind children in Tibet. Despite losing her sight to retinitis pigmentosa, she has dedicated her life to education and empowerment of people with disabilities worldwide. Learn more at en.wikipedia.org."
  },
  anastasia: {
    name: "Anastasia Pagonis",
    condition: "Stargardt Disease",
    years: "Born 2004",
    onset: "Age 11, progressive",
    simulation: "anastasia-stargardt",
    description: "Anastasia Pagonis is a Paralympic swimmer who has Stargardt disease, a form of juvenile macular degeneration. Despite her visual impairment, she has become a world-class athlete, winning multiple Paralympic medals and setting world records. She is an inspiration to young athletes with disabilities. Learn more at teamusa.com."
  },
  mila: {
    name: "Mila Kunis",
    condition: "Chronic Iritis & Cataracts",
    years: "Born 1983",
    onset: "Childhood, blind in one eye for years",
    simulation: "mila-iritis-cataracts",
    description: "Mila Kunis has been blind in one eye for years due to chronic iritis that caused cataracts. Despite her visual impairment, she has become a successful actress, known for her roles in That '70s Show and various films. She has spoken openly about her condition and how it has affected her life and career."
  },
  judi: {
    name: "Dame Judi Dench",
    condition: "Age-Related Macular Degeneration (AMD)",
    years: "Born 1934",
    onset: "Dry AMD in one eye, wet AMD in the other",
    simulation: "judi-amd-progression",
    description: "Dame Judi Dench, the acclaimed British actress, has been living with age-related macular degeneration. She has dry AMD in one eye and wet AMD in the other, which affects her central vision. Despite her visual challenges, she continues to act and has adapted her career to work with her condition."
  },
  bono: {
    name: "Bono",
    condition: "Glaucoma",
    years: "Born 1960",
    onset: "Adult onset",
    simulation: "bono-glaucoma-sensitivity",
    description: "Bono, the lead singer of U2, has glaucoma and wears sunglasses due to light sensitivity. He has been open about his condition and how it affects his daily life, including his need for protective eyewear. His advocacy has helped raise awareness about glaucoma and vision health."
  },
  georgia: {
    name: "Georgia O'Keeffe",
    condition: "Age-Related Macular Degeneration (AMD)",
    years: "1887-1986",
    onset: "Lost central vision in 1972",
    simulation: "georgia-amd-central-loss",
    description: "Georgia O'Keeffe, the renowned American artist, lost her central vision to age-related macular degeneration in 1972. Despite this significant visual impairment, she continued to create art, adapting her techniques to work with her remaining peripheral vision. Her later works reflect her changed visual perspective."
  },
  ella: {
    name: "Ella Fitzgerald",
    condition: "Diabetic Retinopathy",
    years: "1917-1996",
    onset: "Progressive, eventually went blind",
    simulation: "ella-diabetic-retinopathy",
    description: "Ella Fitzgerald, the legendary jazz singer, developed diabetic retinopathy which eventually led to blindness. Despite her visual impairment, she continued to perform and record music, becoming one of the most celebrated vocalists in jazz history. Her condition was a result of diabetes complications."
  },
  sugar: {
    name: "Sugar Ray Leonard",
    condition: "Partial Retinal Detachment",
    years: "Born 1956",
    onset: "Left eye in 1982",
    simulation: "sugar-retinal-detachment",
    description: "Sugar Ray Leonard, the former professional boxer, suffered a partial retinal detachment in his left eye in 1982. This condition affected his depth perception and peripheral vision, ultimately contributing to his decision to retire from boxing. He has since become an advocate for eye health and safety in sports."
  },
  stephen: {
    name: "Stephen Curry",
    condition: "Keratoconus",
    years: "Born 1988",
    onset: "Diagnosed in college",
    simulation: "stephen-keratoconus",
    description: "Stephen Curry, the NBA superstar and Golden State Warriors point guard, has keratoconus, a condition where the cornea becomes thin and cone-shaped, causing distorted vision. Despite this visual impairment, he has become one of the greatest shooters in NBA history, winning multiple championships and MVP awards. He uses specialized contact lenses to manage his condition."
  },
  allan: {
    name: "Allan Pineda Lindo (Apl.de.ap)",
    condition: "Nystagmus",
    years: "Born 1974",
    onset: "From birth",
    simulation: "allan-nystagmus",
    description: "Allan Pineda Lindo, known as Apl.de.ap, is a Filipino-American rapper, singer, and record producer, best known as a founding member of the Black Eyed Peas. He was born with nystagmus, a condition that causes involuntary eye movements and reduced vision. Despite his visual impairment, he has achieved international success in music and continues to be an advocate for disability awareness."
  },
  fetty: {
    name: "Fetty Wap",
    condition: "Glaucoma & Prosthetic Eye",
    years: "Born 1991",
    onset: "Childhood glaucoma, lost eye",
    simulation: "fetty-glaucoma-prosthetic",
    description: "Fetty Wap, the American rapper and singer, lost his left eye to glaucoma as a child and wears a prosthetic eye. Despite this visual impairment, he rose to fame with his hit single 'Trap Queen' and has become a successful recording artist. He has been open about his condition and how it has shaped his perspective on life and music."
  },
  slick: {
    name: "Slick Rick",
    condition: "Blind in Right Eye",
    years: "Born 1965",
    onset: "Infancy, from broken glass",
    simulation: "slick-rick-blindness",
    description: "Slick Rick, the legendary British-American rapper and hip-hop pioneer, was blinded in his right eye as an infant when broken glass from a bottle hit his eye. Despite this visual impairment, he became one of the most influential figures in hip-hop, known for his storytelling abilities and distinctive style. He often wears an eye patch and has incorporated his visual condition into his artistic persona."
  },
  abraham: {
    name: "Abraham Nemeth",
    condition: "Congenital Blindness",
    years: "1918-2013",
    onset: "From birth",
    simulation: "abraham-congenital-blindness",
    description: "Abraham Nemeth was a blind mathematician who developed the Nemeth Braille Code for Mathematics and Science Notation. Born blind, he became a professor of mathematics and made significant contributions to making mathematics accessible to blind students. His Nemeth Code is still widely used today for transcribing mathematical and scientific materials into braille."
  },
  moon: {
    name: "William Moon",
    condition: "Scarlet Fever Complications",
    years: "1818-1894",
    onset: "Lost one eye as child, completely blind by 21",
    simulation: "moon-complete-blindness",
    description: "William Moon lost sight in one eye from scarlet fever as a small child, and by age 21 had become totally blind. He became a teacher and realized that existing embossed reading codes were difficult to learn. He devised Moon type, a simplified reading alphabet based on the Latin alphabet, which he designed to be easier to learn than Braille. First published in 1845, Moon type was widely used and remains important for people who have difficulty reading Braille. He was elected to fellowships of the Royal Geographical Society and the Royal Society of Arts, and received an honorary LLD degree from the University of Philadelphia. Learn more at en.wikipedia.org."
  },
  sharon: {
    name: "Sharon Stone",
    condition: "Hemorrhagic Stroke & Visual Distortions",
    years: "Born 1958",
    onset: "Age 43, from stroke",
    simulation: "sharon-stroke-visual-distortions",
    description: "Sharon Stone suffered a hemorrhagic stroke when the vertebral artery in her brain ruptured, causing a subarachnoid hemorrhage that bled for nine days. She had only a 1% chance of survival and underwent an emergency procedure where doctors used 22 platinum coils to repair the damaged blood vessel. She experienced 'odd' vision problems that lasted for years - some of which she still experiences. She couldn't read for a couple of years after the stroke, saw color patterns that weren't really there, and things appeared stretched and distorted. She described seeing 'blocks of colors on the walls' that weren't actually there. It took years for her vision to return to normal. She also had difficulty reading and memorizing lines, which brought her career to a screeching halt. Beyond vision, Stone experienced aphasia (speech difficulties) and an ongoing stutter, lost directional hearing in her right ear, lost feeling from the knee up in her left leg, had a tilted walk with her right leg dragging, the left side of her face became distorted, lost short-term memory, and had balance problems, constant fatigue, and periodic seizures."
  },
  jose: {
    name: "José Feliciano",
    condition: "Congenital Glaucoma",
    years: "Born 1945",
    onset: "From birth",
    simulation: "jose-congenital-glaucoma",
    description: "José Feliciano is a legendary guitarist and singer who was born with congenital glaucoma. Despite being blind from birth, he became one of the most influential Latin musicians of all time, known for his virtuosic guitar playing and soulful voice. He has won multiple Grammy Awards and is celebrated for his contributions to music. Learn more at en.wikipedia.org."
  },
  art: {
    name: "Art Tatum",
    condition: "Congenital Cataracts",
    years: "1909-1956",
    onset: "From birth",
    simulation: "art-congenital-cataracts",
    description: "Art Tatum was a jazz piano virtuoso who was born with congenital cataracts. Despite being blind from birth, he became one of the greatest jazz pianists in history, known for his incredible technique, harmonic sophistication, and improvisational skills. His recordings continue to inspire musicians today. Learn more at en.wikipedia.org."
  },
  ronnie: {
    name: "Ronnie Milsap",
    condition: "Congenital Glaucoma",
    years: "Born 1943",
    onset: "From birth",
    simulation: "ronnie-congenital-glaucoma",
    description: "Ronnie Milsap is a country music icon who was born with congenital glaucoma. Despite being blind from birth, he became one of the most successful country artists of all time, with numerous number-one hits and Grammy Awards. His music has influenced generations of country musicians. Learn more at en.wikipedia.org."
  },
  doc: {
    name: "Doc Watson",
    condition: "Eye Infection in Infancy",
    years: "1923-2012",
    onset: "Infancy",
    simulation: "doc-eye-infection",
    description: "Doc Watson was a legendary bluegrass and folk guitarist who lost his sight due to an eye infection in infancy. Despite his blindness, he became one of the most influential flatpicking guitarists in American music history, known for his mastery of traditional Appalachian music. Learn more at en.wikipedia.org."
  },
  jeff: {
    name: "Jeff Healey",
    condition: "Retinoblastoma",
    years: "1966-2008",
    onset: "From birth",
    simulation: "jeff-retinoblastoma",
    description: "Jeff Healey was a blues-rock guitarist who lost his sight to retinoblastoma as an infant. He developed a unique guitar technique, playing the instrument flat on his lap. Despite his blindness, he became a celebrated musician known for his powerful blues guitar playing and soulful vocals. Learn more at en.wikipedia.org."
  },
  diane: {
    name: "Diane Schuur",
    condition: "Congenital Cataracts",
    years: "Born 1953",
    onset: "From birth",
    simulation: "diane-congenital-cataracts",
    description: "Diane Schuur is a jazz vocalist who was born with congenital cataracts. Despite being blind from birth, she became a Grammy Award-winning jazz singer known for her powerful voice and impressive vocal range. She has performed with many jazz legends and continues to record and perform. Learn more at en.wikipedia.org."
  },
  nobuyuki: {
    name: "Nobuyuki Tsujii",
    condition: "Congenital Blindness",
    years: "Born 1988",
    onset: "From birth",
    simulation: "nobuyuki-congenital-blindness",
    description: "Nobuyuki Tsujii is a classical pianist who was born blind. Despite his congenital blindness, he won the prestigious Van Cliburn International Piano Competition in 2009, becoming one of the most celebrated classical pianists of his generation. He performs internationally and has recorded numerous albums. Learn more at en.wikipedia.org."
  },
  rahsaan: {
    name: "Rahsaan Roland Kirk",
    condition: "Childhood Blindness",
    years: "1935-1977",
    onset: "Childhood",
    simulation: "rahsaan-childhood-blindness",
    description: "Rahsaan Roland Kirk was a jazz multi-instrumentalist who became blind in childhood. He was known for his ability to play multiple instruments simultaneously, including several saxophones at once. Despite his blindness, he became one of the most innovative and influential jazz musicians of the 20th century. Learn more at en.wikipedia.org."
  },
  borges: {
    name: "Jorge Luis Borges",
    condition: "Progressive Blindness from Inherited Condition",
    years: "1899-1986",
    onset: "Progressive, complete by age 55",
    simulation: "borges-progressive-blindness",
    description: "Jorge Luis Borges was an Argentine writer who experienced progressive blindness from an inherited condition. Despite losing his sight completely by age 55, he continued to write and became one of the most important literary figures of the 20th century, known for his innovative short stories and essays. Learn more at en.wikipedia.org."
  },
  thurber: {
    name: "James Thurber",
    condition: "Childhood Eye Injury",
    years: "1894-1961",
    onset: "Age 7, from eye injury",
    simulation: "thurber-eye-injury",
    description: "James Thurber was an American author and cartoonist who lost sight in one eye from a childhood accident at age 7. Despite his visual impairment, he became one of the most celebrated humorists of his time, writing for The New Yorker and creating memorable characters and stories. Author of The Secret Life of Walter Mitty, adapted in film portrayed by Ben Stiller. Learn more at en.wikipedia.org."
  },
  fanny: {
    name: "Fanny Crosby",
    condition: "Iatrogenic Blindness in Infancy",
    years: "1820-1915",
    onset: "6 weeks old",
    simulation: "fanny-iatrogenic-blindness",
    description: "Fanny Crosby was a prolific hymn writer who became blind at 6 weeks old due to improper medical treatment. Despite her blindness, she wrote over 8,000 hymns, many of which are still sung today, including 'Blessed Assurance' and 'To God Be the Glory.' She was one of the most influential hymn writers in American history. Learn more at en.wikipedia.org."
  },
  homer: {
    name: "Homer",
    condition: "Traditionally Believed Blind",
    years: "Exact dates unknown (8th century BCE)",
    onset: "Unknown",
    simulation: "homer-traditional-blindness",
    description: "Homer is the legendary ancient Greek epic poet traditionally credited with composing the Iliad and the Odyssey. While historical details about Homer are uncertain, tradition holds that he was blind. His epic poems are foundational works of Western literature and continue to be studied and admired today. Learn more at en.wikipedia.org."
  },
  lex: {
    name: "Lex Gillette",
    condition: "Retinopathy of Prematurity",
    years: "Born 1984",
    onset: "From birth (premature)",
    simulation: "lex-rop",
    description: "Lex Gillette is a Paralympic long jumper who was born premature and lost his sight to retinopathy of prematurity. Despite his blindness, he has won four silver medals in the Paralympic Games and is one of the most successful blind track and field athletes in history. Learn more at teamusa.com."
  },
  davidBrown: {
    name: "David Brown",
    condition: "Kawasaki Disease",
    years: "Born 1992",
    onset: "Childhood",
    simulation: "david-brown-kawasaki",
    description: "David Brown is a Paralympic sprinter who lost his sight due to complications from Kawasaki disease in childhood. Despite his blindness, he won a gold medal in the 100-meter dash at the 2016 Paralympic Games, setting a world record. He is one of the fastest blind sprinters in the world. Learn more at teamusa.com."
  },
  blunkett: {
    name: "David Blunkett",
    condition: "Congenital Blindness",
    years: "Born 1947",
    onset: "From birth",
    simulation: "blunkett-congenital-blindness",
    description: "David Blunkett is a British politician who was born blind. Despite his congenital blindness, he served as the UK Home Secretary from 2001 to 2004, becoming the first blind person to hold a major cabinet position in the British government. He has been a prominent advocate for disability rights. Learn more at en.wikipedia.org."
  },
  saunderson: {
    name: "Nicholas Saunderson",
    condition: "Blindness from Smallpox",
    years: "1682-1739",
    onset: "Age 1",
    simulation: "saunderson-smallpox-blindness",
    description: "Nicholas Saunderson was a mathematician who became blind from smallpox at age 1. Despite his blindness, he became the Lucasian Professor of Mathematics at Cambridge University (a position later held by Isaac Newton and Stephen Hawking). He made significant contributions to mathematics and developed innovative teaching methods. Learn more at en.wikipedia.org."
  },
  geerat: {
    name: "Geerat Vermeij",
    condition: "Congenital Glaucoma",
    years: "Born 1946",
    onset: "From birth",
    simulation: "geerat-congenital-glaucoma",
    description: "Geerat Vermeij is an evolutionary biologist and paleontologist who was born with congenital glaucoma. Despite being blind from birth, he became a distinguished professor and has made groundbreaking contributions to the study of evolution, particularly in marine biology and paleontology. He uses touch to study shells and fossils. Learn more at en.wikipedia.org."
  },
  holman: {
    name: "James Holman",
    condition: "Illness-Related Blindness",
    years: "1786-1857",
    onset: "Age 25, from illness while serving in Royal Navy",
    simulation: "holman-complete-blindness",
    description: "James Holman, known as the 'Blind Traveller,' was a British adventurer, author and social observer who became completely blind at age 25 due to an illness while serving in the Royal Navy. Despite his blindness, he became the first blind person to circumnavigate the globe in 1832, using human echolocation for navigation. He traveled extensively through Europe, Asia, Africa, and the Americas, and was elected a Fellow of the Royal Society. Learn more at en.wikipedia.org."
  },
  chris: {
    name: "Chris McCausland",
    condition: "Retinitis Pigmentosa",
    years: "Born 1977",
    onset: "Progressive, blind due to retinitis pigmentosa",
    simulation: "chris-retinitis-pigmentosa",
    description: "Chris McCausland is a British comedian and actor who is blind due to retinitis pigmentosa. He is known for his stand-up comedy, appearances on shows like Have I Got News for You and Would I Lie to You?, and for winning series 22 of BBC's Strictly Come Dancing in 2024 with professional dancer Dianne Buswell - becoming the first blind contestant to win the show. He also won a BAFTA award in 2025 for the memorable moment in their waltz. McCausland has established himself as a regular panellist on Have I Got News for You and has his own Saturday morning chat show on ITV1. Learn more at en.wikipedia.org."
  },
  odin: {
    name: "Odin",
    condition: "Partial Blindness (Symbolic)",
    years: "Norse Mythology",
    onset: "Sacrificed eye for wisdom",
    simulation: "complete-blindness",
    description: "Odin is the chief god in Norse mythology who sacrificed one of his eyes at Mímir's well in exchange for wisdom and knowledge. His partial blindness is symbolic rather than total, representing the price of knowledge and the ability to see beyond the physical world. He is often depicted with an eye patch or missing eye. Learn more at en.wikipedia.org."
  },
  daredevil: {
    name: "Daredevil / Matt Murdock",
    condition: "Chemical Accident",
    years: "Marvel Comics / Netflix Series",
    onset: "Radioactive chemical accident",
    simulation: "complete-blindness",
    description: "Matt Murdock is a lawyer turned vigilante from Marvel Comics. As a child, he was blinded by a radioactive substance that fell from a truck, but the accident also heightened his other senses to superhuman levels. He uses his enhanced hearing, smell, touch, and a form of 'radar sense' to navigate and fight crime as Daredevil."
  },
  geordi: {
    name: "Geordi La Forge",
    condition: "Congenital Blindness",
    years: "Star Trek: The Next Generation",
    onset: "Born blind (birth defect)",
    simulation: "complete-blindness",
    description: "Geordi La Forge is the chief engineer of the USS Enterprise-D in Star Trek: The Next Generation. Born blind, he uses a VISOR (Visual Instrument and Sensory Organ Replacement) device that allows him to see across the electromagnetic spectrum, far beyond normal human vision. Later, he receives ocular implants that provide similar capabilities. Learn more at en.wikipedia.org."
  },
  blindspot: {
    name: "Blindspot (Samuel 'Sam' Baines)",
    condition: "Blindness",
    years: "Batman (DC Comics)",
    onset: "Eyes burned by villain",
    simulation: "complete-blindness",
    description: "Blindspot, also known as Samuel 'Sam' Baines, is a villain in DC Comics' Batman series. Despite being blind, he uses advanced sonar-based technology to navigate and fight, making him a formidable opponent who can 'see' through sound waves and echolocation. Learn more at en.wikipedia.org."
  },
  kenshi: {
    name: "Kenshi Takahashi",
    condition: "Blindness",
    years: "Mortal Kombat",
    onset: "Tricked by sorcerer",
    simulation: "complete-blindness",
    description: "Kenshi Takahashi is a blind swordsman and Special Forces operative from the Mortal Kombat series. He was blinded when he opened a tomb containing the ancient sword Sento, which released imprisoned souls that took his sight. Despite his blindness, he possesses powerful telekinetic abilities and uses his sword skills to fight. Learn more at en.wikipedia.org."
  },
  neo: {
    name: "Neo (Thomas Anderson)",
    condition: "Blindness",
    years: "The Matrix trilogy",
    onset: "Burned by Agent Smith",
    simulation: "complete-blindness",
    description: "Neo, also known as Thomas Anderson, is the protagonist of The Matrix trilogy. In The Matrix Revolutions, Neo is blinded during his final confrontation with Agent Smith, but gains the ability to 'see' through a different perception, allowing him to perceive the code of the Matrix itself. Learn more at en.wikipedia.org."
  },
  eli: {
    name: "Eli",
    condition: "Blindness",
    years: "The Book of Eli",
    onset: "Unknown/ambiguous",
    simulation: "complete-blindness",
    description: "Eli is the protagonist of The Book of Eli, a post-apocalyptic film. Despite being blind, he travels across the wasteland protecting a valuable book, using his heightened senses and combat skills to survive. His blindness is revealed at the end of the film, demonstrating his remarkable abilities. Learn more at book-of-eli.fandom.com."
  },
  blinkin: {
    name: "Blinkin",
    condition: "Blindness",
    years: "Robin Hood: Men in Tights",
    onset: "Unspecified (parody character)",
    simulation: "complete-blindness",
    description: "Blinkin is a comedic character from the film Robin Hood: Men in Tights, a parody of the classic Robin Hood story. He serves as Robin Hood's blind servant, providing comic relief with his inability to see and his humorous misunderstandings. Learn more at en.wikipedia.org."
  },
  juliaCarpenter: {
    name: "Julia Carpenter (Arachne)",
    condition: "Blindness",
    years: "Marvel Comics",
    onset: "Inherited Madame Web powers",
    simulation: "complete-blindness",
    description: "Julia Carpenter, also known as Arachne, is a Marvel Comics character who has experienced blindness in certain storylines. As a superhero with spider-like abilities, she has demonstrated remarkable adaptability despite visual impairment. Learn more at marvel.com."
  },
  mrMagoo: {
    name: "Mr. Magoo",
    condition: "Severe Nearsightedness",
    years: "Animated series and films",
    onset: "Extreme nearsightedness",
    simulation: "nearSighted",
    description: "Mr. Magoo is a cartoon character known for his extreme nearsightedness. Despite his poor vision, he manages to navigate through various adventures, often mistaking objects and situations due to his inability to see clearly. The character has appeared in animated shorts, television series, and films. Learn more at en.wikipedia.org."
  },
  doctorMidNite: {
    name: "Doctor Mid-Nite",
    condition: "Blindness",
    years: "DC Comics",
    onset: "Grenade explosion",
    simulation: "complete-blindness",
    description: "Doctor Mid-Nite is a DC Comics superhero who is blind but uses special infrared lenses that allow him to see in darkness. Despite his blindness in normal light, he fights crime using his enhanced night vision and medical expertise. Learn more at en.wikipedia.org."
  },
  wallyKarew: {
    name: "Wally Karew",
    condition: "Blindness",
    years: "See No Evil, Hear No Evil",
    onset: "Unspecified backstory",
    simulation: "complete-blindness",
    description: "Wally Karew is a character from the film See No Evil, Hear No Evil, played by Richard Pryor. Wally is blind and teams up with a deaf character to solve a crime, using his other heightened senses to navigate and help solve the mystery. Learn more at en.wikipedia.org."
  },
  mohammad: {
    name: "Mohammad",
    condition: "Blindness",
    years: "The Color of Paradise",
    onset: "Born blind",
    simulation: "complete-blindness",
    description: "Mohammad is the protagonist of the Iranian film The Color of Paradise. He is a blind boy who attends a school for the blind in Tehran and has a deep connection with nature, using his sense of touch and hearing to experience the world around him. Learn more at en.wikipedia.org."
  },
  maryIngalls: {
    name: "Mary Ingalls",
    condition: "Blindness from Scarlet Fever",
    years: "1865-1928",
    onset: "Age 14, from scarlet fever",
    simulation: "complete-blindness",
    description: "Mary Ingalls was the older sister of author Laura Ingalls Wilder, who wrote the Little House on the Prairie series. Mary became blind at age 14 due to complications from scarlet fever. Despite her blindness, she attended the Iowa College for the Blind and became a teacher. Her story was featured in the Little House books and television series. Learn more at en.wikipedia.org."
  },
  francisCampbell: {
    name: "Sir Francis Joseph Campbell",
    condition: "Blindness from Accident",
    years: "1832-1914",
    onset: "Age 5, from accident",
    simulation: "complete-blindness",
    description: "Sir Francis Joseph Campbell was a British-American anti-slavery campaigner, teacher, and co-founder of the Royal National College for the Blind in the United Kingdom. He lost his sight at age 5 following an accident. A talented musician, he taught music and became the first principal of the Royal Normal College (now Royal National College for the Blind). He was also the first blind person to climb Mont Blanc and was knighted by King Edward VII in 1909. Learn more at en.wikipedia.org."
  },
  anthonyClarke: {
    name: "Anthony Clarke",
    condition: "Blindness from Car Accident",
    years: "Born 1961",
    onset: "Age 17, from car accident",
    simulation: "complete-blindness",
    description: "Anthony 'Tony' Clarke is an Australian Paralympic judoka and the only Australian to win a gold medal in judo at the Paralympics, achieving this feat at the 1996 Atlanta Games. He became blind at age 17 following a car accident. He represented Australia at five Summer Paralympic Games and won two International Blind Sports Association (IBSA) World Championships. He was awarded the Medal of the Order of Australia (OAM) in 1997. Learn more at en.wikipedia.org."
  },
  amyBower: {
    name: "Dr. Amy Bower",
    condition: "Progressive Vision Loss",
    years: "Born 1957",
    onset: "Progressive vision loss",
    simulation: "complete-blindness",
    description: "Dr. Amy Bower is a blind oceanographer who has made significant contributions to physical oceanography research. Despite her blindness, she has conducted groundbreaking research on ocean currents and underwater acoustics, using sound and other non-visual methods to study the ocean. She has worked at the Woods Hole Oceanographic Institution and has been an inspiration for accessibility in science. Learn more at en.wikipedia.org."
  },
  crazzySteve: {
    name: "Crazzy Steve",
    condition: "Congenital Blindness",
    years: "Professional Wrestling",
    onset: "From birth",
    simulation: "complete-blindness",
    description: "Crazzy Steve is a professional wrestler who is blind from birth. Despite his visual impairment, he has achieved success in professional wrestling, competing in various promotions and demonstrating that blindness does not prevent someone from pursuing a career in sports entertainment. Learn more at en.wikipedia.org."
  },
  floydMorris: {
    name: "Floyd Morris",
    condition: "Glaucoma",
    years: "Born 1969",
    onset: "Age 16, from glaucoma",
    simulation: "complete-blindness",
    description: "Floyd Morris is a Jamaican politician who became the first blind person to serve as President of the Senate of Jamaica. He lost his sight at age 16 due to glaucoma. Despite his blindness, he has had a distinguished political career, serving in the Jamaican Senate and advocating for disability rights and inclusion. Learn more at en.wikipedia.org."
  },
  belaTheBlind: {
    name: "Béla II of Hungary (Béla the Blind)",
    condition: "Blindness from Childhood Trauma",
    years: "c. 1109-1141",
    onset: "From birth or early childhood",
    simulation: "complete-blindness",
    description: "Béla II, known as Béla the Blind, was King of Hungary and Croatia from 1131 to 1141. He was blinded as a child along with his father Álmos by his uncle, King Coloman of Hungary, in an attempt to prevent them from claiming the throne. Despite his blindness, Béla II successfully ruled Hungary for a decade, with his wife Helena and son Géza II assisting in governance. Learn more at en.wikipedia.org."
  },
  blindLemonJefferson: {
    name: "Blind Lemon Jefferson",
    condition: "Congenital Blindness",
    years: "c. 1893-1929",
    onset: "From birth or early childhood",
    simulation: "complete-blindness",
    description: "Blind Lemon Jefferson was an American blues and gospel singer, guitarist, and songwriter. He was one of the most popular blues singers of the 1920s and is considered one of the most influential early blues musicians. Despite being blind from birth or early childhood, he became one of the first commercially successful blues artists, recording over 100 songs. His distinctive guitar style and powerful voice influenced generations of blues musicians. Learn more at en.wikipedia.org."
  },
  charlottaSeuerling: {
    name: "Charlotta Seuerling",
    condition: "Blindness from Smallpox Vaccination",
    years: "1782/84-1828",
    onset: "Age 4, from smallpox vaccination",
    simulation: "complete-blindness",
    description: "Charlotta Seuerling was a Swedish concert singer, harpsichordist, composer, and poet, known as 'The Blind Song-Maiden.' She became blind at age 4 due to complications from a smallpox vaccination. Despite her blindness, she had a successful career performing in Sweden, Finland, and Russia, and authored the popular song 'Sång i en melankolisk stund.' She also assisted in the development of Valentin Haüy's Institute for the Blind in Saint Petersburg. Learn more at en.wikipedia.org."
  },
  levPontryagin: {
    name: "Lev Pontryagin",
    condition: "Blindness from Accident",
    years: "1908-1988",
    onset: "Age 14, from primus stove explosion",
    simulation: "complete-blindness",
    description: "Lev Semyonovich Pontryagin was a Soviet mathematician who became completely blind at age 14 due to an unsuccessful eye surgery after a primus stove explosion. Despite his blindness, he made major discoveries in algebraic topology, differential topology, and optimal control theory. His mother read mathematical books to him, using alternative names for math symbols. He developed Pontryagin duality, Pontryagin classes, and Pontryagin's maximum principle, fundamental to modern optimization theory. Learn more at en.wikipedia.org."
  },
  garyODonoghue: {
    name: "Gary O'Donoghue",
    condition: "Congenital Blindness",
    years: "Born 1965",
    onset: "From birth",
    simulation: "complete-blindness",
    description: "Gary O'Donoghue is a British journalist and broadcaster who has been blind from birth. He has worked for the BBC for many years, covering politics and current affairs. Despite his blindness, he has had a successful career in journalism, demonstrating that visual impairment does not prevent someone from excelling in media and reporting. Learn more at en.wikipedia.org."
  },
  francescoLandini: {
    name: "Francesco Landini",
    condition: "Blindness from Childhood",
    years: "c. 1325-1397",
    onset: "Blind from childhood (smallpox)",
    simulation: "complete-blindness",
    description: "Francesco Landini was an Italian composer, organist, singer, poet, and instrument maker who was blind from childhood, likely due to smallpox. Despite his blindness, he became one of the most famous and prolific composers of the 14th century, known for his madrigals, ballate, and other secular works. He was also an accomplished organist and is considered one of the most important composers of the Italian Trecento. Learn more at en.wikipedia.org."
  },
  garretBarry: {
    name: "Garret Barry",
    condition: "Childhood Blindness (from illness)",
    years: "c. 1780-1860",
    onset: "Blind from birth or early childhood",
    simulation: "complete-blindness",
    description: "Garret Barry was an Irish uilleann piper who became blind during childhood due to an illness. Despite his blindness, he became one of the most celebrated traditional Irish musicians of his time, known for his mastery of the uilleann pipes. His music and style influenced generations of Irish musicians, and he is remembered as one of the great figures in Irish traditional music. Learn more at en.wikipedia.org."
  },
  gurrumulYunupingu: {
    name: "Geoffrey Gurrumul Yunupingu",
    condition: "Congenital Blindness",
    years: "1971-2017",
    onset: "From birth",
    simulation: "complete-blindness",
    description: "Geoffrey Gurrumul Yunupingu was an Australian Indigenous musician who was born blind. Despite his congenital blindness, he became one of Australia's most celebrated musicians, known for his soulful voice and mastery of multiple instruments including guitar, keyboards, drums, and didgeridoo. He sang in both his native Yolngu language and English, and his music brought Indigenous Australian culture to a global audience. Learn more at en.wikipedia.org."
  },
  geraldineLawhorn: {
    name: "Geraldine Lawhorn",
    condition: "Deaf-Blindness",
    years: "1916-2016",
    onset: "From birth",
    simulation: "complete-blindness",
    description: "Geraldine 'Jerrie' Lawhorn was an American deaf-blind performer, actress, pianist, and educator. She was the first deaf-blind African American to earn a college degree in the United States. Despite being both deaf and blind from birth, she had a successful career as a performer, giving one-woman shows, and later became an educator at the Hadley Institute for the Blind and Visually Impaired. She was a trailblazer for people with multiple disabilities. Learn more at en.wikipedia.org."
  },
  toph: {
    name: "Toph Beifong",
    condition: "Blindness from Birth",
    years: "Avatar: The Last Airbender",
    onset: "Born blind",
    simulation: "complete-blindness",
    description: "Toph Beifong is a master earthbender from Avatar: The Last Airbender who was born blind. She developed a unique ability called 'seismic sense,' which allows her to perceive her surroundings through vibrations in the earth by grounding herself barefoot. This ability makes her one of the most powerful and perceptive characters in the series, able to 'see' through the ground with incredible precision. Learn more at en.wikipedia.org."
  },
  chirrutImwe: {
    name: "Chirrut Îmwe",
    condition: "Blindness",
    years: "Star Wars: Rogue One",
    onset: "Born blind",
    simulation: "complete-blindness",
    description: "Chirrut Îmwe was a Guardian of the Whills from the planet Jedha in the Star Wars universe. Despite being blind, he was a skilled warrior who used the Force to guide him, believing that 'the Force moves darkly near a thing that's about to kill.' He fought alongside the Rebel Alliance during the mission to steal the Death Star plans, demonstrating remarkable combat abilities despite his blindness. Learn more at starwars.fandom.com."
  },
  murphyMason: {
    name: "Murphy Mason",
    condition: "Retinitis Pigmentosa",
    years: "In the Dark (TV Series)",
    onset: "Age 14",
    simulation: "complete-blindness",
    description: "Murphy Mason is the main character of the CW television series In the Dark. She lost her sight completely at age 14 due to retinitis pigmentosa. Despite being blind, she becomes determined to solve her best friend Tyson's murder when she is the only eyewitness. She is known for her hard-drinking lifestyle and her determination to navigate a world of crime and mystery despite her visual impairment. Learn more at in-the-dark-cw.fandom.com."
  },
  fujitora: {
    name: "Fujitora (Issho)",
    condition: "Self-Inflicted Blindness",
    years: "One Piece",
    onset: "Blinded himself",
    simulation: "complete-blindness",
    description: "Fujitora, also known as Issho, is a Marine Admiral in the One Piece series. He blinded himself, choosing to live without sight because he did not want to see the world's wickedness. Despite his blindness, he is one of the most powerful fighters in the series, using Observation Haki (a form of spiritual perception) to 'see' his surroundings and sense the presence, emotions, and intentions of others. He fights with a sword and can manipulate gravity through his Devil Fruit powers. Learn more at onepiece.fandom.com."
  }
};

export const categories = [
  { name: "Contemporary Figures", people: ["christine", "lucy", "paul", "haben", "molly", "mila", "judi", "sharon", "chris"] },
  { name: "Athletes & Scientists", people: ["erik", "marla", "mona", "joshua", "anastasia", "sugar", "stephen", "lex", "davidBrown", "geerat", "anthonyClarke", "amyBower", "crazzySteve"] },
  { name: "Musicians & Artists", people: ["monet", "ray", "stevie", "bocelli", "casey", "bono", "georgia", "ella", "allan", "fetty", "slick", "jose", "art", "ronnie", "doc", "jeff", "diane", "nobuyuki", "rahsaan", "blindLemonJefferson", "charlottaSeuerling", "francescoLandini", "garretBarry", "gurrumulYunupingu", "geraldineLawhorn"] },
  { name: "Writers, Activists, & Politicians", people: ["helen", "ved", "tilly", "sabriye", "borges", "thurber", "levPontryagin", "garyODonoghue", "paterson", "blunkett", "floydMorris"] },
  { name: "Historical Figures", people: ["milton", "braille", "galileo", "harriet", "abraham", "moon", "homer", "fanny", "saunderson", "holman", "maryIngalls", "francisCampbell", "belaTheBlind"] },
  { name: "Fictional Characters", people: ["odin", "daredevil", "geordi", "blindspot", "toph", "kenshi", "neo", "eli", "blinkin", "juliaCarpenter", "mrMagoo", "doctorMidNite", "wallyKarew", "mohammad", "chirrutImwe", "murphyMason", "fujitora"] }
];

