import { PersonData } from './types';

export const fictionalCharacters: Record<string, PersonData> = {
  odin: {
    name: "Odin",
    condition: "Monocular Vision (One Eye)",
    years: "Norse Mythology",
    onset: "Sacrificed eye for wisdom",
    simulation: "odin-monocular-vision",
    description: "Odin is the chief god in Norse mythology who sacrificed one of his eyes at Mímir's well in exchange for wisdom and knowledge.\n\nHis partial blindness is symbolic, representing the price of knowledge and the ability to see beyond the physical world.\n\n• All-Father of the Norse gods\n\n• Often depicted with an eye patch or missing eye\n\n• His sacrifice represents gaining inner sight through physical loss",
    wikiUrl: "https://en.wikipedia.org/wiki/Odin"
  },
  daredevil: {
    name: "Daredevil / Matt Murdock",
    condition: "Radar Sense (Enhanced Perception)",
    years: "Marvel Comics / Netflix Series",
    onset: "Radioactive chemical accident heightened other senses",
    simulation: "daredevil-radar-sense",
    description: "Matt Murdock was blinded as a child by a radioactive substance, but the accident heightened his other senses to superhuman levels, creating a 'radar sense' that perceives the world as fire.\n\nThe visualization: red monochrome 'World on Fire' with edge-detection style rendering. Rotating radar sweeps suggest 360° awareness. Sound-producing objects glow brighter. Only contours and silhouettes - no textures or flat 2D information.\n\n• Lawyer by day, vigilante by night protecting Hell's Kitchen\n\n• First appeared in Daredevil #1 (1964)\n\n• Portrayed in Netflix/Marvel series by Charlie Cox",
    wikiUrl: "https://en.wikipedia.org/wiki/Daredevil_(Marvel_Comics_character)"
  },
  geordi: {
    name: "Geordi La Forge",
    condition: "VISOR Enhanced EM Vision",
    years: "Star Trek: The Next Generation",
    onset: "Born blind (birth defect), uses VISOR prosthetic",
    simulation: "geordi-visor-sense",
    description: "Geordi La Forge was born blind and uses a VISOR (Visual Instrument and Sensory Organ Replacement) device that translates the entire electromagnetic spectrum into visual information.\n\nThe visualization: false-color thermal palette (blues for cold, oranges for warm, magentas for high-energy). EM emission halos around electronics and power sources. Edge enhancement at material boundaries. Scan-line artifacts from mechanical processing. No true darkness - ambient EM renders as deep violet.\n\n• Chief Engineer of the USS Enterprise-D\n\n• The VISOR causes constant low-level pain and sensory overload\n\n• Played by LeVar Burton",
    wikiUrl: "https://en.wikipedia.org/wiki/Geordi_La_Forge"
  },
  blindspot: {
    name: "Blindspot (Samuel 'Sam' Baines)",
    condition: "Sonar-Based Echolocation",
    years: "Batman (DC Comics)",
    onset: "Eyes burned by villain, uses sonar technology",
    simulation: "blindspot-sonar-sense",
    description: "Blindspot, also known as Samuel 'Sam' Baines, had his eyes burned by a villain in the DC Comics Batman series. He uses advanced sonar-based technology to navigate.\n\nThe visualization: monochrome blue-green palette (submarine sonar aesthetic). Depth-mapped brightness (near = bright, far = dim). Edge-dominant rendering - only 3D contours register, no textures or detail. Radial ping sweeps like a radar display. Sound-shadow zones behind solid objects. Hard surfaces bright, soft surfaces dim or absent.\n\n• Active sonar emits pulses that bounce off surfaces\n\n• Resolution limited - can navigate rooms but not read or recognize faces\n\n• Formidable opponent in Batman's rogues gallery",
    wikiUrl: "https://en.wikipedia.org/wiki/Blindspot_(character)"
  },
  toph: {
    name: "Toph Beifong",
    condition: "Blindness from Birth",
    years: "Avatar: The Last Airbender",
    onset: "Born blind",
    simulation: "complete-blindness",
    description: "Toph Beifong is a master earthbender who was born blind.\n\nShe developed 'seismic sense,' perceiving surroundings through vibrations in the earth by grounding herself barefoot.\n\n• One of the most powerful earthbenders in the Avatar universe\n\n• Inventor of metalbending\n\n• Fan favorite character known for her fierce independence",
    wikiUrl: "https://en.wikipedia.org/wiki/Toph_Beifong"
  },
  kenshi: {
    name: "Kenshi Takahashi",
    condition: "Telekinetic Perception (Psychic Sense)",
    years: "Mortal Kombat",
    onset: "Blinded by sorcerer Shang Tsung",
    simulation: "kenshi-telekinetic-sense",
    description: "Kenshi Takahashi was blinded when the sorcerer Shang Tsung tricked him into opening an ancient tomb, which released the souls of his ancestors and took his sight. He now wields the ancestral sword Sento.\n\nThe visualization: Kenshi perceives through telekinetic fields, not reflected light. Living beings radiate intense blue-white soul energy with heartbeat pulsing - powerful fighters glow brighter. Inanimate objects register as faint blue/violet mass outlines. He senses intent before attacks land (precognitive amber flares). Spirit realm entities are visible as ghostly wisps. Sento glows warm amber/gold. No textures, colors, or facial features - only mass, energy, motion, and life force. 360° omnidirectional awareness with hard perceptual boundary at psychic range.\n\n• Blind swordsman and Special Forces operative\n\n• Presence-based perception - he feels the existence of things through telekinetic fields\n\n• His blindfold allows him to peer into the spirit realm\n\n• First appeared in Mortal Kombat: Deadly Alliance (2002)",
    wikiUrl: "https://en.wikipedia.org/wiki/Kenshi_(Mortal_Kombat)"
  },
  neo: {
    name: "Neo (Thomas Anderson)",
    condition: "Blindness",
    years: "The Matrix trilogy",
    onset: "Burned by Agent Smith",
    simulation: "complete-blindness",
    description: "Neo is the protagonist of The Matrix trilogy. In The Matrix Revolutions, Neo is blinded during his final confrontation but gains the ability to perceive the code of the Matrix itself.\n\n• 'The One' prophesied to end the war between humans and machines\n\n• His blindness represents seeing beyond physical reality\n\n• Portrayed by Keanu Reeves",
    wikiUrl: "https://en.wikipedia.org/wiki/Neo_(The_Matrix)"
  },
  eli: {
    name: "Eli",
    condition: "Blindness",
    years: "The Book of Eli",
    onset: "Unknown/ambiguous",
    simulation: "complete-blindness",
    description: "Eli is the protagonist of The Book of Eli, a post-apocalyptic film.\n\nDespite being blind (revealed at the end), he travels across the wasteland protecting a valuable book, using heightened senses and combat skills.\n\n• His blindness is a twist revelation\n\n• Demonstrates remarkable survival abilities without sight\n\n• Portrayed by Denzel Washington",
    wikiUrl: "https://en.wikipedia.org/wiki/The_Book_of_Eli"
  },
  blinkin: {
    name: "Blinkin",
    condition: "Blindness",
    years: "Robin Hood: Men in Tights",
    onset: "Unspecified (parody character)",
    simulation: "complete-blindness",
    description: "Blinkin is a comedic character from the Mel Brooks parody film Robin Hood: Men in Tights. He serves as Robin Hood's blind servant, providing comic relief.\n\n• Parody of the character Azeem from Robin Hood: Prince of Thieves\n\n• Played by Mark Blankfield\n\n• Famous quote: 'I heard that coming a mile away'",
    wikiUrl: "https://en.wikipedia.org/wiki/Robin_Hood:_Men_in_Tights"
  },
  juliaCarpenter: {
    name: "Julia Carpenter (Arachne)",
    condition: "Blindness",
    years: "Marvel Comics",
    onset: "Inherited Madame Web powers",
    simulation: "complete-blindness",
    description: "Julia Carpenter, also known as Arachne, is a Marvel Comics character who became blind when she inherited Madame Web's psychic powers.\n\nShe has demonstrated remarkable adaptability.\n\n• Former Spider-Woman and current Madame Web\n\n• Possesses precognitive and telepathic abilities\n\n• Her blindness came with enhanced psychic vision",
    wikiUrl: "https://en.wikipedia.org/wiki/Julia_Carpenter"
  },
  mrMagoo: {
    name: "Mr. Magoo",
    condition: "Severe Nearsightedness",
    years: "Animated series and films",
    onset: "Extreme nearsightedness",
    simulation: "magoo-severe-myopia",
    description: "Mr. Magoo is a cartoon character known for his extreme nearsightedness.\n\nDespite his poor vision, he manages to navigate through various adventures, often mistaking objects and situations.\n\n• Created by United Productions of America (UPA) in 1949\n\n• Academy Award-winning animated shorts\n\n• Voiced by Jim Backus for decades",
    wikiUrl: "https://en.wikipedia.org/wiki/Mr._Magoo"
  },
  doctorMidNite: {
    name: "Doctor Mid-Nite",
    condition: "Light-Induced Blindness",
    years: "DC Comics",
    onset: "Grenade explosion",
    simulation: "doctor-midnite-photophobia",
    description: "Doctor Mid-Nite is a DC Comics superhero who was blinded by a grenade explosion but discovered he could see perfectly in total darkness.\n\nHis condition is the inverse of night blindness - blind in light, seeing in dark.\n\n• First blind superhero in comics (1941)\n\n• Developed infrared goggles and 'blackout bombs'\n\n• Member of the Justice Society of America",
    wikiUrl: "https://en.wikipedia.org/wiki/Doctor_Mid-Nite"
  },
  wallyKarew: {
    name: "Wally Karew",
    condition: "Blindness",
    years: "See No Evil, Hear No Evil",
    onset: "Unspecified backstory",
    simulation: "complete-blindness",
    description: "Wally Karew is a blind character from the comedy film See No Evil, Hear No Evil.\n\nHe teams up with a deaf character to solve a crime, using his heightened senses.\n\n• Played by Richard Pryor\n\n• Partners with Gene Wilder's deaf character Dave\n\n• 1989 comedy exploring how disability doesn't prevent heroism",
    wikiUrl: "https://en.wikipedia.org/wiki/See_No_Evil,_Hear_No_Evil"
  },
  mohammad: {
    name: "Mohammad",
    condition: "Blindness",
    years: "The Color of Paradise",
    onset: "Born blind",
    simulation: "complete-blindness",
    description: "Mohammad is the protagonist of the Iranian film The Color of Paradise (1999). He is a blind boy who attends a school for the blind in Tehran and has a deep connection with nature.\n\n• Uses touch and hearing to experience the world beautifully\n\n• Directed by Majid Majidi\n\n• Critically acclaimed portrayal of blindness in cinema",
    wikiUrl: "https://en.wikipedia.org/wiki/The_Color_of_Paradise"
  },
  chirrutImwe: {
    name: "Chirrut Îmwe",
    condition: "Blindness",
    years: "Star Wars: Rogue One",
    onset: "Born blind",
    simulation: "complete-blindness",
    description: "Chirrut Îmwe was a Guardian of the Whills from Jedha in the Star Wars universe.\n\nDespite being blind, he was a skilled warrior who used the Force to guide him.\n\n• Famous quote: 'I am one with the Force. The Force is with me.'\n\n• Fought alongside the Rebel Alliance to steal Death Star plans\n\n• Portrayed by Donnie Yen",
    wikiUrl: "https://en.wikipedia.org/wiki/Chirrut_%C3%8Emwe"
  },
  murphyMason: {
    name: "Murphy Mason",
    condition: "Retinitis Pigmentosa (Complete)",
    years: "In the Dark (TV Series)",
    onset: "Age 14, now fully blind",
    simulation: "murphy-rp-complete",
    description: "Murphy Mason lost her sight completely at age 14 due to retinitis pigmentosa, a degenerative condition that first causes night blindness and tunnel vision before progressing to total blindness.\n\n• Main character of CW series 'In the Dark'\n\n• Investigates her best friend's murder\n\n• Notable for portraying a flawed, complex blind protagonist",
    wikiUrl: "https://en.wikipedia.org/wiki/In_the_Dark_(American_TV_series)"
  },
  fujitora: {
    name: "Fujitora (Issho)",
    condition: "Self-Inflicted Blindness",
    years: "One Piece",
    onset: "Blinded himself",
    simulation: "complete-blindness",
    description: "Fujitora, also known as Issho, is a Marine Admiral who blinded himself because he did not want to see the world's wickedness.\n\nHe uses Observation Haki to sense his surroundings.\n\n• One of the most powerful fighters in the One Piece series\n\n• Can manipulate gravity through his Devil Fruit powers\n\n• Represents moral blindness to injustice vs. physical blindness",
    wikiUrl: "https://en.wikipedia.org/wiki/Fujitora"
  }
};
