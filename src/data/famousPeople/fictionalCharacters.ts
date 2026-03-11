import { PersonData } from './types';

export const fictionalCharacters: Record<string, PersonData> = {
  odin: {
    name: "Odin",
    achievement: "All-Father of Norse Gods",
    condition: "Monocular Vision (One Eye)",
    years: "Norse Mythology",
    onset: "Sacrificed eye for wisdom",
    simulation: "odin-monocular-vision",
    description: "Odin is the chief god in Norse mythology who sacrificed one of his eyes at Mímir's well in exchange for wisdom and knowledge.\n\nHis partial blindness is symbolic, representing the price of knowledge and the ability to see beyond the physical world.\n\n• All-Father of the Norse gods\n\n• Often depicted with an eye patch or missing eye\n\n• His sacrifice represents gaining inner sight through physical loss",
    wikiUrl: "https://en.wikipedia.org/wiki/Odin",
    nationality: { country: "Norway", flag: "🇳🇴" }
  },
  daredevil: {
    name: "Daredevil / Matt Murdock",
    achievement: "Marvel's Man Without Fear",
    condition: "Radar Sense (Enhanced Perception)",
    years: "Marvel Comics / Netflix Series",
    onset: "Radioactive chemical accident heightened other senses",
    simulation: "daredevil-radar-sense",
    description: "Matt Murdock was blinded as a child by a radioactive substance, but the accident heightened his other senses to superhuman levels, creating a 'radar sense' that perceives the world as fire.\n\nThe visualization: red monochrome 'World on Fire' with edge-detection style rendering. Rotating radar sweeps suggest 360° awareness. Sound-producing objects glow brighter. Only contours and silhouettes - no textures or flat 2D information.\n\n• Lawyer by day, vigilante by night protecting Hell's Kitchen\n\n• First appeared in Daredevil #1 (1964)\n\n• Portrayed in Netflix/Marvel series by Charlie Cox",
    wikiUrl: "https://en.wikipedia.org/wiki/Daredevil_(Marvel_Comics_character)",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  geordi: {
    name: "Geordi La Forge",
    achievement: "Chief Engineer, USS Enterprise-D",
    condition: "VISOR Enhanced EM Vision",
    years: "Star Trek: The Next Generation",
    onset: "Born blind (birth defect), uses VISOR prosthetic",
    simulation: "geordi-visor-sense",
    description: "Geordi La Forge was born blind and uses a VISOR (Visual Instrument and Sensory Organ Replacement) device that translates the entire electromagnetic spectrum into visual information.\n\nThe visualization: false-color thermal palette (blues for cold, oranges for warm, magentas for high-energy). EM emission halos around electronics and power sources. Edge enhancement at material boundaries. Scan-line artifacts from mechanical processing. No true darkness - ambient EM renders as deep violet.\n\n• Chief Engineer of the USS Enterprise-D\n\n• The VISOR causes constant low-level pain and sensory overload\n\n• Played by LeVar Burton",
    wikiUrl: "https://en.wikipedia.org/wiki/Geordi_La_Forge",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  blindspot: {
    name: "Blindspot (Samuel 'Sam' Baines)",
    achievement: "DC Comics Batman Character",
    condition: "Sonar-Based Echolocation",
    years: "Batman (DC Comics)",
    onset: "Eyes burned by villain, uses sonar technology",
    simulation: "blindspot-sonar-sense",
    description: "Blindspot, also known as Samuel 'Sam' Baines, had his eyes burned by a villain in the DC Comics Batman series. He uses advanced sonar-based technology to navigate.\n\nThe visualization: monochrome blue-green palette (submarine sonar aesthetic). Depth-mapped brightness (near = bright, far = dim). Edge-dominant rendering - only 3D contours register, no textures or detail. Radial ping sweeps like a radar display. Sound-shadow zones behind solid objects. Hard surfaces bright, soft surfaces dim or absent.\n\n• Active sonar emits pulses that bounce off surfaces\n\n• Resolution limited - can navigate rooms but not read or recognize faces\n\n• Formidable opponent in Batman's rogues gallery",
    wikiUrl: "https://en.wikipedia.org/wiki/Blindspot_(character)",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  toph: {
    name: "Toph Beifong",
    achievement: "Inventor of Metalbending",
    condition: "Seismic Sense (Earthbending Vision)",
    years: "Avatar: The Last Airbender",
    onset: "Born blind - developed seismic sense",
    simulation: "toph-seismic-sense",
    description: "Toph Beifong is completely blind but 'sees' through seismic sense - detecting vibrations through the earth via her feet. This unique perception renders the world as a topographic wireframe: only ground-coupled surfaces are visible, solid rock/metal appears crisp, while sand is blurry (her canonical weakness). Living beings pulse with detectable heartbeat, and motion creates ripple waves.\n\n• One of the most powerful earthbenders in the Avatar universe\n\n• Inventor of metalbending - can sense metal with higher fidelity\n\n• Her seismic sense fails on sand, ice, wood, and when airborne\n\n• Fan favorite character known for her fierce independence",
    wikiUrl: "https://en.wikipedia.org/wiki/Toph_Beifong",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  kenshi: {
    name: "Kenshi Takahashi",
    achievement: "Mortal Kombat Blind Swordsman",
    condition: "Telekinetic Perception (Psychic Sense)",
    years: "Mortal Kombat",
    onset: "Blinded by sorcerer Shang Tsung",
    simulation: "kenshi-telekinetic-sense",
    description: "Kenshi Takahashi was blinded when the sorcerer Shang Tsung tricked him into opening an ancient tomb, which released the souls of his ancestors and took his sight. He now wields the ancestral sword Sento.\n\nThe visualization: Kenshi perceives through telekinetic fields, not reflected light. Living beings radiate intense blue-white soul energy with heartbeat pulsing - powerful fighters glow brighter. Inanimate objects register as faint blue/violet mass outlines. He senses intent before attacks land (precognitive amber flares). Spirit realm entities are visible as ghostly wisps. Sento glows warm amber/gold. No textures, colors, or facial features - only mass, energy, motion, and life force. 360° omnidirectional awareness with hard perceptual boundary at psychic range.\n\n• Blind swordsman and Special Forces operative\n\n• Presence-based perception - he feels the existence of things through telekinetic fields\n\n• His blindfold allows him to peer into the spirit realm\n\n• First appeared in Mortal Kombat: Deadly Alliance (2002)",
    wikiUrl: "https://en.wikipedia.org/wiki/Kenshi_(Mortal_Kombat)",
    nationality: { country: "Japan", flag: "🇯🇵" }
  },
  neo: {
    name: "Neo (Thomas Anderson)",
    achievement: "The One, The Matrix Trilogy",
    condition: "Matrix Code Vision (Post-Blindness)",
    years: "The Matrix trilogy",
    onset: "Burned by Agent Smith, gains code perception",
    simulation: "neo-matrix-code-vision",
    description: "Neo is the protagonist of The Matrix trilogy. In The Matrix Revolutions, Neo is blinded during his final confrontation with Agent Smith, but gains the ability to perceive the underlying code of the Matrix itself - seeing the world as cascading streams of green digital characters.\n\nThe visualization: falling columns of katakana, Latin, numerals, and symbols in phosphor green. Bright 'head' characters lead each stream with fading afterglow trails. Glitch effects include chromatic aberration and scan lines. The world becomes pure data - no physical forms, only the digital rain of the Matrix's source code.\n\n• 'The One' prophesied to end the war between humans and machines\n\n• His blindness represents transcendence - seeing beyond physical reality to the code beneath\n\n• Portrayed by Keanu Reeves",
    wikiUrl: "https://en.wikipedia.org/wiki/Neo_(The_Matrix)",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  eli: {
    name: "Eli",
    achievement: "Protagonist of The Book of Eli",
    condition: "Blindness",
    years: "The Book of Eli",
    onset: "Unknown/ambiguous",
    simulation: "complete-blindness",
    description: "Eli is the protagonist of The Book of Eli, a post-apocalyptic film.\n\nDespite being blind (revealed at the end), he travels across the wasteland protecting a valuable book, using heightened senses and combat skills.\n\n• His blindness is a twist revelation\n\n• Demonstrates remarkable survival abilities without sight\n\n• Portrayed by Denzel Washington",
    wikiUrl: "https://en.wikipedia.org/wiki/The_Book_of_Eli",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  blinkin: {
    name: "Blinkin",
    achievement: "Robin Hood: Men in Tights Character",
    condition: "Blindness",
    years: "Robin Hood: Men in Tights",
    onset: "Unspecified (parody character)",
    simulation: "complete-blindness",
    description: "Blinkin is a comedic character from the Mel Brooks parody film Robin Hood: Men in Tights. He serves as Robin Hood's blind servant, providing comic relief.\n\n• Parody of the character Azeem from Robin Hood: Prince of Thieves\n\n• Played by Mark Blankfield\n\n• Famous quote: 'I heard that coming a mile away'",
    wikiUrl: "https://en.wikipedia.org/wiki/Robin_Hood:_Men_in_Tights",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  juliaCarpenter: {
    name: "Julia Carpenter (Arachne)",
    achievement: "Marvel's Current Madame Web",
    condition: "Psychic Web Perception",
    years: "Marvel Comics",
    onset: "Inherited Madame Web powers",
    simulation: "julia-carpenter-psychic-web",
    description: "Julia Carpenter, also known as Arachne, is a Marvel Comics character who became blind when she inherited Madame Web's psychic powers.\n\nShe has demonstrated remarkable adaptability.\n\n• Former Spider-Woman and current Madame Web\n\n• Possesses precognitive and telepathic abilities\n\n• Her blindness came with enhanced psychic vision",
    wikiUrl: "https://en.wikipedia.org/wiki/Julia_Carpenter",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  mrMagoo: {
    name: "Mr. Magoo",
    achievement: "Academy Award-Winning Cartoon",
    condition: "Severe Nearsightedness",
    years: "Animated series and films",
    onset: "Extreme nearsightedness",
    simulation: "magoo-severe-myopia",
    description: "Mr. Magoo is a cartoon character known for his extreme nearsightedness.\n\nDespite his poor vision, he manages to navigate through various adventures, often mistaking objects and situations.\n\n• Created by United Productions of America (UPA) in 1949\n\n• Academy Award-winning animated shorts\n\n• Voiced by Jim Backus for decades",
    wikiUrl: "https://en.wikipedia.org/wiki/Mr._Magoo",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  doctorMidNite: {
    name: "Doctor Mid-Nite",
    achievement: "First Blind Superhero in Comics (1941)",
    condition: "Light-Induced Blindness",
    years: "DC Comics",
    onset: "Grenade explosion",
    simulation: "doctor-midnite-photophobia",
    description: "Doctor Mid-Nite is a DC Comics superhero who was blinded by a grenade explosion but discovered he could see perfectly in total darkness.\n\nHis condition is the inverse of night blindness - blind in light, seeing in dark.\n\n• First blind superhero in comics (1941)\n\n• Developed infrared goggles and 'blackout bombs'\n\n• Member of the Justice Society of America",
    wikiUrl: "https://en.wikipedia.org/wiki/Doctor_Mid-Nite",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  wallyKarew: {
    name: "Wally Karew",
    achievement: "See No Evil, Hear No Evil (1989)",
    condition: "Blindness",
    years: "See No Evil, Hear No Evil",
    onset: "Unspecified backstory",
    simulation: "complete-blindness",
    description: "Wally Karew is a blind character from the comedy film See No Evil, Hear No Evil.\n\nHe teams up with a deaf character to solve a crime, using his heightened senses.\n\n• Played by Richard Pryor\n\n• Partners with Gene Wilder's deaf character Dave\n\n• 1989 comedy exploring how disability doesn't prevent heroism",
    wikiUrl: "https://en.wikipedia.org/wiki/See_No_Evil,_Hear_No_Evil",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  mohammad: {
    name: "Mohammad",
    achievement: "The Color of Paradise Protagonist",
    condition: "Blindness",
    years: "The Color of Paradise",
    onset: "Born blind",
    simulation: "complete-blindness",
    description: "Mohammad is the protagonist of the Iranian film The Color of Paradise (1999). He is a blind boy who attends a school for the blind in Tehran and has a deep connection with nature.\n\n• Uses touch and hearing to experience the world beautifully\n\n• Directed by Majid Majidi\n\n• Critically acclaimed portrayal of blindness in cinema",
    wikiUrl: "https://en.wikipedia.org/wiki/The_Color_of_Paradise",
    nationality: { country: "Iran", flag: "🇮🇷" }
  },
  chirrutImwe: {
    name: "Chirrut Îmwe",
    achievement: "Guardian of the Whills, Rogue One",
    condition: "Force Perception (Born Blind)",
    years: "Star Wars: Rogue One",
    onset: "Born blind",
    simulation: "chirrut-force-perception",
    description: "Chirrut Îmwe was a Guardian of the Whills from Jedha in the Star Wars universe.\n\nDespite being blind, he was a skilled warrior who used the Force to guide him.\n\n• Famous quote: 'I am one with the Force. The Force is with me.'\n\n• Fought alongside the Rebel Alliance to steal Death Star plans\n\n• Portrayed by Donnie Yen",
    wikiUrl: "https://en.wikipedia.org/wiki/Chirrut_%C3%8Emwe",
    nationality: { country: "China", flag: "🇨🇳" }
  },
  murphyMason: {
    name: "Murphy Mason",
    achievement: "CW's In the Dark Protagonist",
    condition: "Retinitis Pigmentosa (Complete)",
    years: "In the Dark (TV Series)",
    onset: "Age 14, now fully blind",
    simulation: "murphy-rp-complete",
    description: "Murphy Mason lost her sight completely at age 14 due to retinitis pigmentosa, a degenerative condition that first causes night blindness and tunnel vision before progressing to total blindness.\n\n• Main character of CW series 'In the Dark'\n\n• Investigates her best friend's murder\n\n• Notable for portraying a flawed, complex blind protagonist",
    wikiUrl: "https://en.wikipedia.org/wiki/In_the_Dark_(American_TV_series)",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  moComeAsYouAre: {
    name: "Mo",
    achievement: "Come As You Are (2019) Character",
    condition: "Legal Blindness",
    years: "Come As You Are (2019)",
    onset: "Legally blind (unspecified cause)",
    simulation: "mo-legal-blindness",
    description: "Mo is one of three friends with disabilities in the comedy-drama film Come As You Are (2019), a remake of the Belgian film Hasta La Vista. He is legally blind and works at the clinic where the three main characters met.\n\nThe film follows Mo, Scotty (who has arthrogryposis), and Matt (a wheelchair user) as they embark on a road trip to Montreal with their hired nurse Sam.\n\n• Played by Ravi Patel\n\n• The film received a 95% approval rating on Rotten Tomatoes\n\n• Explores themes of disability, independence, and human connection\n\n• Loosely inspired by real events",
    wikiUrl: "https://en.wikipedia.org/wiki/Come_as_You_Are_(2019_film)",
    nationality: { country: "United States", flag: "\u{1F1FA}\u{1F1F8}" }
  },
  suNianQin: {
    name: "Su Nian Qin",
    achievement: "Crush (2021) Protagonist",
    condition: "Corneal Opacity",
    years: "Crush (2021 Chinese Drama)",
    onset: "Severe visual impairment from corneal opacity",
    simulation: "suNianQin-corneal-opacity",
    description: "Su Nian Qin is the male lead of the Chinese romance drama Crush (2021), adapted from the novel 'So I Love You Very Much.' He is a talented singer-songwriter who secretly creates music under the pen name 'Yi Jin,' while working as a teacher for blind children.\n\nHis corneal opacity limits his vision to distinguishing shapes and movements within approximately three feet. He eventually undergoes a successful cornea transplant.\n\n• Played by Evan Lin (Lin Yanjun)\n\n• Praised for authentic portrayal of visual impairment - reading braille, using a talking watch, orienting by touch\n\n• 24-episode drama on iQIYI with 7.6 IMDb rating\n\n• His love story with radio broadcaster Sang Wu Yan explores how disability affects relationships",
    wikiUrl: "https://en.wikipedia.org/wiki/Crush_(2021_TV_series)",
    nationality: { country: "China", flag: "\u{1F1E8}\u{1F1F3}" }
  },
  blindGirlCityLights: {
    name: "Blind Girl (The Flower Girl)",
    achievement: "City Lights (1931) Lead Character",
    condition: "Corneal Blindness (Surgically Cured)",
    years: "City Lights (1931)",
    onset: "Blind (cause unspecified in film)",
    simulation: "complete-blindness",
    description: "The Blind Girl is a young, impoverished flower seller in Charlie Chaplin's masterpiece City Lights (1931). She is one of the most iconic blind characters in cinema history. When the Tramp falls in love with her, he embarks on comedic misadventures to raise money for an operation that could restore her sight.\n\nThe film's ending - where she recognizes her benefactor by touch after regaining her sight - is widely regarded as one of the greatest moments in film history.\n\n• Played by Virginia Cherrill, directed to 'look inwardly and not to see me' by Chaplin\n\n• The opening flower-selling scene required 342 takes over several weeks\n\n• 8.5 IMDb rating - considered one of the greatest films ever made\n\n• Medical analysis suggests her condition was likely trachoma or corneal dystrophy, treatable by corneal transplant",
    wikiUrl: "https://en.wikipedia.org/wiki/City_Lights",
    nationality: { country: "United States", flag: "\u{1F1FA}\u{1F1F8}" }
  },
  frankSlade: {
    name: "Lt. Col. Frank Slade",
    achievement: "Scent of a Woman (1992) Protagonist",
    condition: "Traumatic Blindness",
    years: "Scent of a Woman (1992)",
    onset: "Blinded by grenade explosion",
    simulation: "complete-blindness",
    description: "Lt. Col. Frank Slade is a retired, decorated Vietnam War veteran in Scent of a Woman (1992). He lost his sight completely when a grenade detonated during a reckless accident, a source of deep shame he conceals behind a story of combat injury.\n\nThe bitter, cynical blind veteran takes prep school student Charlie Simms on a final luxurious trip to New York City, secretly planning to end his life. Their unlikely bond ultimately redeems them both.\n\n• Played by Al Pacino, who won the Academy Award for Best Actor for this role\n\n• Famous for his acute sense of smell - identifying women's perfumes and navigating social situations\n\n• The tango scene at the Waldorf-Astoria is one of cinema's most celebrated sequences\n\n• Pacino trained with The Lighthouse vision rehabilitation organization to portray blindness authentically",
    wikiUrl: "https://en.wikipedia.org/wiki/Scent_of_a_Woman_(1992_film)",
    nationality: { country: "United States", flag: "\u{1F1FA}\u{1F1F8}" }
  },
  solomonTethered: {
    name: "Solomon",
    achievement: "Tethered (2022) Protagonist",
    condition: "Congenital Blindness",
    years: "Tethered (2022)",
    onset: "Born blind",
    simulation: "complete-blindness",
    description: "Solomon is the protagonist of the horror/drama film Tethered (2022). Born blind, he lives in complete isolation in a remote cabin in the North Carolina woods, navigating the wilderness using a rope tied around his waist as a lifeline back to his cabin.\n\nAfter his mother disappears when he is a child, Solomon survives alone for approximately ten years using survival skills she taught him. When a hunter named Henry stumbles onto his property, they discover a terrifying supernatural creature lurking in the woods.\n\n• Played by Jared Laufree (young adult) and Brody Bett (child)\n\n• His blindness heightens the horror - he cannot see what stalks him in the darkness\n\n• Despite his blindness, he is resourceful and self-sufficient, capable of hunting and fishing alone\n\n• The tether/rope is both a survival tool and metaphor for confinement",
    wikiUrl: "https://en.wikipedia.org/wiki/Tethered_(film)",
    nationality: { country: "United States", flag: "\u{1F1FA}\u{1F1F8}" }
  },
  michelleMcNally: {
    name: "Michelle McNally",
    achievement: "Black (2005) Protagonist",
    condition: "Deafblindness",
    years: "Black (2005)",
    onset: "Lost sight and hearing from illness at age 2",
    simulation: "complete-blindness",
    description: "Michelle McNally is the protagonist of the acclaimed Indian film Black (2005), directed by Sanjay Leela Bhansali. She is an Anglo-Indian woman from Shimla who lost her sight, hearing, and ability to speak after an illness at age two - a story inspired by Helen Keller's autobiography.\n\nHer dedicated teacher Debraj Sahai enters her life and teaches her to communicate, eventually guiding her to earn a university degree. In a poignant reversal, the aging Debraj develops Alzheimer's, and Michelle must care for the man who guided her out of darkness.\n\n• Played by Rani Mukerji (adult) and Ayesha Kapur (child)\n\n• Won all 11 nominations at the 51st Filmfare Awards including Best Film and Best Actress\n\n• 8.1 IMDb rating - widely regarded as one of the finest Bollywood dramas\n\n• Amitabh Bachchan won National Film Award for Best Actor as teacher Debraj Sahai",
    wikiUrl: "https://en.wikipedia.org/wiki/Black_(2005_film)",
    nationality: { country: "India", flag: "\u{1F1EE}\u{1F1F3}" }
  },
  leonardoWayHeLooks: {
    name: "Leonardo",
    achievement: "The Way He Looks (2014) Protagonist",
    condition: "Congenital Blindness",
    years: "The Way He Looks (2014)",
    onset: "Born blind",
    simulation: "complete-blindness",
    description: "Leonardo is the protagonist of the Brazilian coming-of-age film The Way He Looks (2014), a blind high school student in S\u00e3o Paulo struggling for independence. His everyday life is constrained by an overprotective mother and the routine of being walked home by his best friend Giovana.\n\nWhen new student Gabriel arrives, Leonardo discovers first love and begins asserting his autonomy. The film portrays his blindness matter-of-factly, as one dimension of a teenager's life alongside universal struggles of adolescence and identity.\n\n• Played by Ghilherme Lobo, who won the APCA Trophy for Best Actor\n\n• Won FIPRESCI Prize and Teddy Award at the 64th Berlin International Film Festival\n\n• 7.9 IMDb rating\n\n• The title refers to Leonardo's desire to walk home alone - a symbol of his quest for autonomy",
    wikiUrl: "https://en.wikipedia.org/wiki/The_Way_He_Looks",
    nationality: { country: "Brazil", flag: "\u{1F1E7}\u{1F1F7}" }
  },
  sofiaInDarkness: {
    name: "Sofia",
    achievement: "In Darkness (2018) Protagonist",
    condition: "Feigned Blindness",
    years: "In Darkness (2018)",
    onset: "Poses as completely blind as part of revenge plan",
    simulation: "complete-blindness",
    description: "Sofia is the protagonist of the thriller In Darkness (2018), a concert pianist living in London who presents herself as completely blind. After overhearing the murder of her upstairs neighbor Veronique, daughter of an accused Serbian war criminal, she is pulled into a dangerous underworld of corruption and violence.\n\nSofia's blindness is revealed to be an elaborate deception. Her real identity is that of a Bosnian War survivor who witnessed her family's massacre. She assumed a new identity and feigned blindness for years to get close to those responsible.\n\n• Played by Natalie Dormer, who also co-wrote the screenplay\n\n• The film explores themes of perception, deception, and revenge\n\n• Co-stars Ed Skrein, Emily Ratajkowski, and Jan Bijvoet\n\n• Sofia's feigned blindness allows her to be underestimated by dangerous adversaries",
    wikiUrl: "https://en.wikipedia.org/wiki/In_Darkness_(2018_film)",
    nationality: { country: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}" }
  },
  fujitora: {
    name: "Fujitora (Issho)",
    achievement: "One Piece Marine Admiral",
    condition: "Observation Haki (Self-Blinded)",
    years: "One Piece",
    onset: "Blinded himself",
    simulation: "fujitora-observation-haki",
    description: "Fujitora, also known as Issho, is a Marine Admiral who blinded himself because he did not want to see the world's wickedness.\n\nHe uses Observation Haki to sense his surroundings.\n\n• One of the most powerful fighters in the One Piece series\n\n• Can manipulate gravity through his Devil Fruit powers\n\n• Represents moral blindness to injustice vs. physical blindness",
    wikiUrl: "https://en.wikipedia.org/wiki/Fujitora",
    nationality: { country: "Japan", flag: "🇯🇵" }
  }
};
