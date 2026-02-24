import { PersonData } from './types';

export const artists: Record<string, PersonData> = {
  monet: {
    name: "Claude Monet",
    achievement: "Founder of French Impressionism",
    condition: "Cataracts",
    years: "1840-1926",
    onset: "Age 60s, legally blind by 82",
    simulation: "cataracts color-distortion",
    description: "Monet developed cataracts in his 60s, diagnosed in 1912. The cataracts clouded his vision and dramatically altered his color perception, making cool colors like blue and purple difficult to distinguish while accentuating warm tones.\n\nHe described seeing 'through a fog' and by 1922 was legally blind in his right eye with only 10% vision in his left.\n\n• Founder of French Impressionism and one of the most influential painters in art history\n\n• Created the iconic Water Lilies series despite declining vision\n\n• Resisted surgery until 1923, fearing it would change his artistic perception",
    wikiUrl: "https://en.wikipedia.org/wiki/Claude_Monet",
    nationality: { country: "France", flag: "🇫🇷" }
  },
  georgia: {
    name: "Georgia O'Keeffe",
    achievement: "Mother of American Modernism",
    condition: "Age-Related Macular Degeneration (AMD)",
    years: "1887-1986",
    onset: "Lost central vision in 1972",
    simulation: "georgia-amd-central-loss",
    description: "Georgia O'Keeffe lost her central vision to age-related macular degeneration in 1972.\n\nDespite this significant visual impairment, she adapted her techniques to work with her remaining peripheral vision, and her later works reflect her changed visual perspective.\n\n• Known as the 'Mother of American Modernism'\n\n• Famous for large-scale flower paintings and New Mexico landscapes\n\n• Continued creating art into her 90s with assistance from Juan Hamilton",
    wikiUrl: "https://en.wikipedia.org/wiki/Georgia_O%27Keeffe",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  johnBramblitt: {
    name: "John Bramblitt",
    achievement: "Blind Painter, Works in 120+ Countries",
    condition: "Blindness from Epilepsy Complications",
    years: "Born 1971",
    onset: "Age 30, from epilepsy complications in 2001",
    simulation: "complete-blindness",
    description: "John Bramblitt became blind in 2001 due to complications from epilepsy.\n\nHe developed a unique method of painting by feeling the textures of the paint, creating tactile lines and shapes through touch.\n\n• Works sold in over 120 countries\n\n• Multiple Presidential Service awards for art workshops\n\n• Inspiration for artists with disabilities worldwide\n\n• Visit bramblitt.com",
    wikiUrl: "https://en.wikipedia.org/wiki/John_Bramblitt",
    nationality: { country: "United States", flag: "🇺🇸" }
  },
  esrefArmagan: {
    name: "Eşref Armağan",
    achievement: "Blind Painter Who Never Saw Light",
    condition: "Congenital Blindness",
    years: "Born 1953",
    onset: "From birth",
    simulation: "esref-congenital-blindness",
    description: "Eşref Armağan is a Turkish painter born completely blind—one eye never developed and the other was stunted and scarred.\n\nSelf-taught from age 6, he creates vivid paintings using touch to understand form and perspective.\n\n• Harvard researchers found his visual cortex activates when drawing, despite never having seen\n\n• Exhibited in Turkey, Italy, China, and the Netherlands\n\n• Creates accurate perspective and shadow in his paintings without ever seeing light",
    wikiUrl: "https://en.wikipedia.org/wiki/E%C5%9Fref_Arma%C4%9Fan",
    nationality: { country: "Turkey", flag: "🇹🇷" }
  }
};
