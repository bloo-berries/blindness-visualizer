import { PersonData } from './types';

export const artists: Record<string, PersonData> = {
  monet: {
    name: "Claude Monet",
    condition: "Cataracts",
    years: "1840-1926",
    onset: "Age 60s, legally blind by 82",
    simulation: "cataracts color-distortion",
    description: "Monet developed cataracts in his 60s, diagnosed in 1912. The cataracts clouded his vision and dramatically altered his color perception, making cool colors like blue and purple difficult to distinguish while accentuating warm tones. He described seeing 'through a fog' and by 1922 was legally blind in his right eye with only 10% vision in his left. Learn more at en.wikipedia.org."
  },
  georgia: {
    name: "Georgia O'Keeffe",
    condition: "Age-Related Macular Degeneration (AMD)",
    years: "1887-1986",
    onset: "Lost central vision in 1972",
    simulation: "georgia-amd-central-loss",
    description: "Georgia O'Keeffe, the renowned American artist, lost her central vision to age-related macular degeneration in 1972. Despite this significant visual impairment, she continued to create art, adapting her techniques to work with her remaining peripheral vision. Her later works reflect her changed visual perspective. Learn more at en.wikipedia.org."
  },
  johnBramblitt: {
    name: "John Bramblitt",
    condition: "Blindness from Epilepsy Complications",
    years: "Born 1971",
    onset: "Age 30, from epilepsy complications in 2001",
    simulation: "complete-blindness",
    description: "John Bramblitt is an American visual artist who became blind in 2001 due to complications from epilepsy. He developed a unique method of painting by feeling the textures of the paint, creating tactile lines and shapes. His works have been sold in over 120 countries, and he has received multiple Presidential Service awards for his art workshops. He has become an inspiration for artists with disabilities worldwide. Visit his website at bramblitt.com."
  },
  esrefArmagan: {
    name: "Eşref Armağan",
    condition: "Congenital Blindness",
    years: "Born 1953",
    onset: "From birth",
    simulation: "esref-congenital-blindness",
    description: "Eşref Armağan is a Turkish painter born completely blind—one eye never developed and the other was stunted and scarred. Self-taught from age 6, he creates vivid paintings using touch to understand form and perspective. Harvard researchers found his visual cortex activates when drawing, despite never having seen. He has exhibited in Turkey, Italy, China, and the Netherlands. Learn more at en.wikipedia.org."
  }
};
