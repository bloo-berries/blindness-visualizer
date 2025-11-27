import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel,
  Select,
  MenuItem,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Divider,
  Tabs,
  Tab,
  Paper,
  Collapse
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  MedicalServices as MedicalServicesIcon,
  Psychology as PsychologyIcon,
  ColorLens as ColorLensIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Smartphone as SmartphoneIcon,
  Home as HomeIcon,
  Directions as DirectionsIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Help as HelpIcon,
  LocalHospital as LocalHospitalIcon,
  Info as InfoIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
// Note: VISUAL_EFFECTS import removed as it's not currently used
import '../styles/Conditions.css';
import '../styles/FAQ.css';

interface ConditionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  conditions: Array<{
    id: string;
    name: string;
    description: string;
    relatedPeople?: string[];
    imagePath?: string;
    treatments?: {
      available: boolean;
      options: string[];
      notes?: string;
    };
  }>;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  icon: React.ReactNode;
  category: string;
}

// Component to handle thumbnail image with fallback (.webp -> .png)
const ThumbnailImage: React.FC<{ conditionName: string; imagePath?: string }> = ({ conditionName, imagePath }) => {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    if (imagePath) {
      setImageSrc(imagePath);
    } else {
      // Try .webp first, then .png
      const basePath = `${process.env.PUBLIC_URL || ''}/images/glossary/${conditionName}`;
      setImageSrc(`${basePath}.webp`);
    }
    setHasError(false);
  }, [conditionName, imagePath]);

  const handleError = () => {
    if (imageSrc?.endsWith('.webp')) {
      // Try .png as fallback
      const basePath = `${process.env.PUBLIC_URL || ''}/images/glossary/${conditionName}`;
      setImageSrc(`${basePath}.png`);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !imageSrc) {
    return null;
  }

  return (
    <img
      src={imageSrc}
      alt={`${conditionName} preview`}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }}
      onError={handleError}
    />
  );
};

const ConditionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);
  const [expandedTreatments, setExpandedTreatments] = useState<Set<string>>(new Set());

  // Organize conditions into categories
  const conditionCategories: ConditionCategory[] = useMemo(() => [
    {
      id: 'visual-field',
      name: 'Visual Field Loss',
      icon: <RemoveRedEyeIcon />,
      description: 'Conditions affecting specific areas of the visual field',
      conditions: [
        {
          id: 'hemianopiaLeft',
          name: 'Homonymous Hemianopia (Left-field)',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Homonymous Hemianopia (Left-field).webp`,
          description: 'Loss of the left half of the visual field in both eyes. Caused by damage to the right side of the brain\'s visual pathways. May cause difficulty seeing objects to the left and problems with navigation.',
          relatedPeople: ['John Milton'],
          treatments: {
            available: true,
            options: [
              'Vision rehabilitation therapy to improve scanning and awareness',
              'Prism glasses to expand visual field awareness',
              'Visual field expansion training',
              'Compensatory strategies and adaptive techniques',
              'Treatment of underlying cause (stroke, tumor, trauma) when possible'
            ],
            notes: 'Vision loss from brain damage is typically permanent, but rehabilitation can help maximize remaining vision and develop compensatory strategies.'
          }
        },
        {
          id: 'hemianopiaRight',
          name: 'Homonymous Hemianopia (Right-field)',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Homonymous Hemianopia (Right-field).webp`,
          description: 'Loss of the right half of the visual field in both eyes. Caused by damage to the left side of the brain\'s visual pathways. May cause difficulty seeing objects to the right and problems with navigation.',
          treatments: {
            available: true,
            options: [
              'Vision rehabilitation therapy to improve scanning and awareness',
              'Prism glasses to expand visual field awareness',
              'Visual field expansion training',
              'Compensatory strategies and adaptive techniques',
              'Treatment of underlying cause (stroke, tumor, trauma) when possible'
            ],
            notes: 'Vision loss from brain damage is typically permanent, but rehabilitation can help maximize remaining vision and develop compensatory strategies.'
          }
        },
        {
          id: 'quadrantanopiaInferior',
          name: 'Homonymous Inferior Quadrantanopia',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Homonymous Inferior Quadrantanopia.webp`,
          description: 'Loss of vision in the same lower quadrant of visual field in both eyes. Caused by damage to the superior optic radiations (parietal pathway). Often referred to as "pie on the floor" defect.',
          treatments: {
            available: true,
            options: [
              'Vision rehabilitation therapy',
              'Prism glasses or visual field awareness devices',
              'Compensatory scanning techniques',
              'Treatment of underlying neurological cause when possible'
            ],
            notes: 'Treatment focuses on rehabilitation and adaptation rather than restoring lost vision.'
          }
        },
        {
          id: 'quadrantanopiaSuperior',
          name: 'Homonymous Superior Quadrantanopia',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Homonymous Superior Quadrantanopia.webp`,
          description: 'Loss of vision in the same upper quadrant of visual field in both eyes. Caused by damage to the inferior optic radiations (temporal pathway or Meyer\'s loop). Often referred to as "pie in the sky" defect.',
          treatments: {
            available: true,
            options: [
              'Vision rehabilitation therapy',
              'Prism glasses or visual field awareness devices',
              'Compensatory scanning techniques',
              'Treatment of underlying neurological cause when possible'
            ],
            notes: 'Treatment focuses on rehabilitation and adaptation rather than restoring lost vision.'
          }
        },
        {
          id: 'blindnessLeftEye',
          name: 'Complete Loss of Vision in Left Eye',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Complete Loss of Vision in Left Eye.webp`,
          description: 'Complete blindness in the left eye. Caused by damage to the left optic nerve. Results in total loss of vision in the left eye while the right eye remains unaffected.',
          treatments: {
            available: true,
            options: [
              'Treatment depends on underlying cause:',
              '• Optic neuritis: Corticosteroids, treatment of underlying autoimmune condition',
              '• Glaucoma: Eye drops, laser therapy, surgery to lower intraocular pressure',
              '• Trauma: Immediate medical attention, surgical repair when possible',
              '• Tumor: Surgical removal, radiation therapy, chemotherapy',
              '• Stroke: Treatment of underlying cardiovascular condition',
              'Vision rehabilitation for monocular vision',
              'Protective eyewear for remaining eye',
              'Adaptive strategies for depth perception and spatial awareness'
            ],
            notes: 'Vision loss in one eye is typically permanent. Treatment focuses on preserving the remaining eye and developing compensatory strategies for monocular vision.'
          }
        },
        {
          id: 'blindnessRightEye',
          name: 'Complete Loss of Vision in Right Eye',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Complete Loss of Vision in Right Eye.webp`,
          description: 'Complete blindness in the right eye. Caused by damage to the right optic nerve. Results in total loss of vision in the right eye while the left eye remains unaffected.',
          treatments: {
            available: true,
            options: [
              'Treatment depends on underlying cause:',
              '• Optic neuritis: Corticosteroids, treatment of underlying autoimmune condition',
              '• Glaucoma: Eye drops, laser therapy, surgery to lower intraocular pressure',
              '• Trauma: Immediate medical attention, surgical repair when possible',
              '• Tumor: Surgical removal, radiation therapy, chemotherapy',
              '• Stroke: Treatment of underlying cardiovascular condition',
              'Vision rehabilitation for monocular vision',
              'Protective eyewear for remaining eye',
              'Adaptive strategies for depth perception and spatial awareness'
            ],
            notes: 'Vision loss in one eye is typically permanent. Treatment focuses on preserving the remaining eye and developing compensatory strategies for monocular vision.'
          }
        },
        {
          id: 'bitemporalHemianopia',
          name: 'Bitemporal Hemianopia',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Bitemporal Hemianopia.webp`,
          description: 'Loss of vision in the outer (temporal) half of each eye\'s visual field. Caused by damage to the optic chiasm, often from pituitary tumors. Creates a "tunnel vision" effect.',
          treatments: {
            available: true,
            options: [
              'Surgical removal or treatment of pituitary tumor (if applicable)',
              'Radiation therapy for tumors',
              'Hormone therapy for pituitary disorders',
              'Vision rehabilitation and adaptive strategies',
              'Prism glasses to improve peripheral awareness'
            ],
            notes: 'Early treatment of the underlying cause (often pituitary tumors) may prevent further vision loss and sometimes improve vision.'
          }
        },
        {
          id: 'scotoma',
          name: 'Central Scotoma',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Central Scotoma.webp`,
          description: 'A blind spot in the center of vision. Can be caused by macular degeneration, optic neuritis, or other conditions affecting the macula. Makes reading and recognizing faces difficult.',
          relatedPeople: ['Marla Runyan', 'Dr. Mona Minkara'],
          treatments: {
            available: true,
            options: [
              'Treatment depends on underlying cause:',
              '• AMD: Anti-VEGF injections, photodynamic therapy, AREDS supplements',
              '• Optic neuritis: Corticosteroids, treatment of underlying autoimmune condition',
              '• Macular hole: Vitrectomy surgery',
              '• Diabetic macular edema: Anti-VEGF injections, laser therapy',
              'Low vision aids (magnifiers, telescopic lenses)',
              'Eccentric viewing training to use peripheral vision',
              'Vision rehabilitation therapy'
            ],
            notes: 'Central scotomas are often permanent, but treatment of the underlying cause and low vision rehabilitation can help maximize remaining vision.'
          }
        },
        {
          id: 'tunnelVision',
          name: 'Tunnel Vision',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Tunnel Vision.webp`,
          description: 'Loss of peripheral vision while central vision remains. Can be caused by glaucoma, retinitis pigmentosa, or other conditions affecting the retina or optic nerve.',
          relatedPeople: ['Erik Weihenmayer'],
          treatments: {
            available: true,
            options: [
              'Treatment depends on underlying cause:',
              '• Glaucoma: Eye drops, laser therapy, surgery to lower intraocular pressure',
              '• Retinitis pigmentosa: Vitamin A palmitate, gene therapy (experimental), retinal implants',
              '• Retinal detachment: Surgical repair',
              '• Optic nerve damage: Treatment of underlying cause when possible',
              'Vision rehabilitation and mobility training',
              'Low vision aids and adaptive devices'
            ],
            notes: 'Peripheral vision loss is often progressive and irreversible, but early treatment of underlying conditions may slow progression.'
          }
        }
      ]
    },
    {
      id: 'color-vision',
      name: 'Color Vision Deficiencies',
      icon: <ColorLensIcon />,
      description: 'Conditions affecting color perception and discrimination',
      conditions: [
        {
          id: 'protanopia',
          name: 'Protanopia (Red-Blind)',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Protanopia (Red-Blind).webp`,
          description: 'Complete inability to distinguish between red and green colors. Red appears as black, and green appears as yellow. Affects about 1% of males and 0.01% of females.',
          treatments: {
            available: false,
            options: [
              'No cure currently available',
              'Color-correcting glasses (EnChroma, etc.) may help some individuals distinguish colors better',
              'Adaptive strategies: using patterns, labels, or apps to identify colors',
              'Gene therapy research is ongoing but not yet available'
            ],
            notes: 'Color vision deficiencies are typically genetic and permanent. Specialized glasses can help some people but do not restore normal color vision.'
          }
        },
        {
          id: 'deuteranopia',
          name: 'Deuteranopia (Green-Blind)',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Deuteranopia (Green-Blind).webp`,
          description: 'Complete inability to distinguish between red and green colors. Green appears as light gray or beige, and red appears as brown. Most common form of color blindness.',
          treatments: {
            available: false,
            options: [
              'No cure currently available',
              'Color-correcting glasses (EnChroma, etc.) may help some individuals distinguish colors better',
              'Adaptive strategies: using patterns, labels, or apps to identify colors',
              'Gene therapy research is ongoing but not yet available'
            ],
            notes: 'Color vision deficiencies are typically genetic and permanent. Specialized glasses can help some people but do not restore normal color vision.'
          }
        },
        {
          id: 'tritanopia',
          name: 'Tritanopia (Blue-Blind)',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Tritanopia (Blue-Blind).webp`,
          description: 'Inability to distinguish between blue and yellow colors. Blue appears as green, and yellow appears as light gray or violet. Very rare form of color blindness.',
          treatments: {
            available: false,
            options: [
              'No cure currently available',
              'May be acquired (from eye disease, medication, or aging) or inherited',
              'If acquired, treating underlying cause may help',
              'Adaptive strategies and color identification apps'
            ],
            notes: 'Acquired tritanopia may improve if the underlying cause is treated. Inherited forms are permanent.'
          }
        },
        {
          id: 'protanomaly',
          name: 'Protanomaly (Red-Weak)',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Protanomaly (Red-Weak).webp`,
          description: 'Reduced sensitivity to red light. Red appears darker and less bright than normal. Difficulty distinguishing between red and green, especially in low light.',
          treatments: {
            available: false,
            options: [
              'No cure currently available',
              'Color-correcting glasses may provide some improvement',
              'Adaptive strategies and color identification tools'
            ],
            notes: 'Milder than protanopia but still permanent. Adaptive strategies are the primary management approach.'
          }
        },
        {
          id: 'deuteranomaly',
          name: 'Deuteranomaly (Green-Weak)',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Deuteranomaly (Green-Weak).webp`,
          description: 'Reduced sensitivity to green light. Green appears more red than normal. Most common form of color vision deficiency, affecting about 6% of males.',
          treatments: {
            available: false,
            options: [
              'No cure currently available',
              'Color-correcting glasses may provide some improvement',
              'Adaptive strategies and color identification tools'
            ],
            notes: 'Most common color vision deficiency. Usually does not significantly impact daily life, but adaptive strategies can help when needed.'
          }
        },
        {
          id: 'tritanomaly',
          name: 'Tritanomaly (Blue-Weak)',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Tritanomaly (Blue-Weak).webp`,
          description: 'Reduced sensitivity to blue light. Blue appears greener than normal, and yellow appears lighter. Very rare form of color vision deficiency.',
          treatments: {
            available: false,
            options: [
              'No cure currently available',
              'If acquired, treating underlying cause may help',
              'Adaptive strategies and color identification tools'
            ],
            notes: 'Very rare condition. Treatment depends on whether it is inherited or acquired.'
          }
        },
        {
          id: 'monochromacy',
          name: 'Monochromacy (Complete Color Blindness)',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Monochromacy (Complete Color Blindness).webp`,
          description: 'Complete inability to see any colors. Vision is limited to shades of gray. Extremely rare, affecting only about 1 in 33,000 people.',
          treatments: {
            available: false,
            options: [
              'No cure currently available',
              'Low vision aids and adaptive strategies',
              'Protection from bright light (often associated with photophobia)',
              'Gene therapy research is ongoing but experimental'
            ],
            notes: 'Complete color blindness is typically genetic and permanent. Management focuses on maximizing remaining vision and adaptive strategies.'
          }
        }
      ]
    },
    {
      id: 'eye-conditions',
      name: 'Eye Conditions',
      icon: <MedicalServicesIcon />,
      description: 'Physical conditions affecting the eye structure and function',
      conditions: [
        {
          id: 'glaucoma',
          name: 'Glaucoma',
          description: 'A group of eye diseases that damage the optic nerve, typically due to elevated intraocular pressure. Known as the "silent thief of sight" because vision loss occurs gradually and peripherally first. Early stages show small paracentral scotomas, progressing to arc-shaped defects, then tunnel vision, and finally severe constriction. Central vision remains sharp until late stages. Includes blue-yellow color deficits and reduced contrast sensitivity.',
          relatedPeople: ['John Milton', 'Galileo Galilei', 'Ray Charles', 'Andrea Bocelli', 'David Paterson'],
          treatments: {
            available: true,
            options: [
              'Prescription eye drops to lower intraocular pressure (prostaglandins, beta-blockers, alpha agonists, carbonic anhydrase inhibitors)',
              'Laser trabeculoplasty (SLT or ALT) to improve fluid drainage',
              'Minimally invasive glaucoma surgery (MIGS)',
              'Traditional glaucoma surgery (trabeculectomy, tube shunt) for advanced cases',
              'Acute angle-closure glaucoma: immediate medical treatment with medications and laser iridotomy'
            ],
            notes: 'Early detection and treatment can prevent or slow vision loss. Vision already lost cannot be restored, but treatment can preserve remaining vision. Regular eye exams are crucial.'
          }
        },
        {
          id: 'cataracts',
          name: 'Nuclear Sclerotic Cataract',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Nuclear Sclerotic Cataract.webp`,
          description: 'Nuclear sclerotic cataract - the most common type of cataract affecting the center of the lens. Causes progressive blurring, dimming of vision, and loss of color vibrancy, especially affecting blue color perception. The image becomes progressively more yellowed and less colorful over time.',
          treatments: {
            available: true,
            options: [
              'Cataract surgery: removal of clouded lens and replacement with artificial intraocular lens (IOL)',
              'Phacoemulsification: most common technique using ultrasound to break up cataract',
              'Femtosecond laser-assisted cataract surgery',
              'Various IOL options: monofocal, multifocal, toric (for astigmatism), accommodating lenses',
              'Early stages: stronger glasses, brighter lighting, anti-glare sunglasses'
            ],
            notes: 'Cataract surgery is one of the most common and successful surgeries, with high success rates. It is reversible and can restore clear vision. Surgery is typically recommended when cataracts interfere with daily activities.'
          }
        },
        {
          id: 'posteriorSubcapsularCataract',
          name: 'Posterior Subcapsular Cataract',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Posterior Subcapsular Cataract.webp`,
          description: 'Small central area of light scatter behind the pupil, causing pronounced glare sensitivity and loss of contrast in bright lighting. Creates a bright halo or cloudy patch that grows with brightness intensity, disproportionately affecting near and backlit vision. Peripheral vision may remain clearer.',
          treatments: {
            available: true,
            options: [
              'Cataract surgery: removal of clouded lens and replacement with artificial intraocular lens (IOL)',
              'Phacoemulsification: most common technique using ultrasound to break up cataract',
              'Femtosecond laser-assisted cataract surgery',
              'Various IOL options: monofocal, multifocal, toric (for astigmatism), accommodating lenses',
              'Early stages: stronger glasses, brighter lighting, anti-glare sunglasses',
              'Pupil-dilating eye drops may provide temporary relief'
            ],
            notes: 'Posterior subcapsular cataracts often progress more quickly than other types and can significantly impact vision, especially in bright light. Surgery is typically recommended when vision is significantly affected.'
          }
        },
        {
          id: 'amd',
          name: 'Age-Related Macular Degeneration (AMD)',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Age-Related Macular Degeneration (AMD).webp`,
          description: 'Deterioration of the macula, the central part of the retina. Causes loss of central vision while peripheral vision remains. Leading cause of vision loss in older adults.',
          relatedPeople: ['Dr. Mona Minkara'],
          treatments: {
            available: true,
            options: [
              'Wet AMD: Anti-VEGF injections (bevacizumab, ranibizumab, aflibercept, faricimab) into the eye',
              'Photodynamic therapy (PDT) for certain types of wet AMD',
              'Dry AMD: AREDS2 supplements (vitamins C, E, zinc, copper, lutein, zeaxanthin)',
              'Low vision rehabilitation and aids',
              'Amsler grid monitoring for early detection of progression',
              'Lifestyle modifications: quit smoking, healthy diet, exercise, UV protection'
            ],
            notes: 'Wet AMD can be treated to slow progression and sometimes improve vision. Dry AMD progresses slowly and currently has no cure, but supplements may slow progression. Early detection is crucial.'
          }
        },
        {
          id: 'diabeticRetinopathy',
          name: 'Diabetic Retinopathy',
          description: 'Damage to the blood vessels in the retina caused by diabetes. Can cause blurry vision, dark spots, and eventually blindness if untreated.',
          treatments: {
            available: true,
            options: [
              'Tight blood sugar control (most important)',
              'Blood pressure and cholesterol management',
              'Anti-VEGF injections for diabetic macular edema',
              'Laser photocoagulation (panretinal or focal)',
              'Vitrectomy surgery for advanced cases with bleeding or retinal detachment',
              'Regular comprehensive eye exams (annually or more frequently)'
            ],
            notes: 'Early detection and good diabetes management can prevent or slow progression. Treatment can preserve vision, but vision already lost may not be fully restored.'
          }
        },
        {
          id: 'astigmatism',
          name: 'Astigmatism/Pterygium',
          description: 'Irregular curvature of the cornea or lens causing blurred or distorted vision at all distances. Common refractive error that can be corrected with glasses or contacts. Pterygium is a fibrovascular growth onto the cornea that can cause astigmatism by distorting the corneal surface.',
          treatments: {
            available: true,
            options: [
              'Prescription glasses or contact lenses (toric lenses)',
              'Refractive surgery: LASIK, PRK, or SMILE for corneal astigmatism',
              'Toric intraocular lens implants during cataract surgery',
              'Pterygium: surgical removal if it affects vision or causes discomfort',
              'Lubricating eye drops for associated dry eye'
            ],
            notes: 'Astigmatism is easily correctable with glasses or contacts. Refractive surgery can provide permanent correction. Pterygium surgery has good success rates.'
          }
        },
        {
          id: 'nearSighted',
          name: 'Myopia (Near-Sightedness)',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Myopia (Near-Sightedness).webp`,
          description: 'Difficulty seeing distant objects clearly while near objects appear normal. Caused by the eye being too long or the cornea being too curved.',
          treatments: {
            available: true,
            options: [
              'Prescription glasses or contact lenses',
              'Refractive surgery: LASIK, PRK, SMILE, or ICL (implantable collamer lens)',
              'Orthokeratology (ortho-k): overnight contact lenses to reshape cornea',
              'Atropine eye drops (low-dose) to slow progression in children',
              'Multifocal contact lenses for children to slow progression'
            ],
            notes: 'Myopia is easily correctable. In children, treatments can slow progression. Refractive surgery can provide permanent correction for adults.'
          }
        },
        {
          id: 'farSighted',
          name: 'Hyperopia (Far-Sightedness)',
          description: 'Difficulty seeing near objects clearly while distant objects appear normal. Caused by the eye being too short or the cornea being too flat.',
          treatments: {
            available: true,
            options: [
              'Prescription glasses or contact lenses',
              'Refractive surgery: LASIK, PRK, or SMILE',
              'Refractive lens exchange (RLE) for high hyperopia',
              'Reading glasses for presbyopia (age-related near vision loss)'
            ],
            notes: 'Hyperopia is easily correctable with glasses or contacts. Refractive surgery can provide permanent correction.'
          }
        }
      ]
    },
    {
      id: 'retinal-disorders',
      name: 'Retinal Disorders',
      icon: <VisibilityIcon />,
      description: 'Conditions affecting the retina and its specialized cells',
      conditions: [
        {
          id: 'retinitisPigmentosa',
          name: 'Retinitis Pigmentosa',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Retinitis Pigmentosa.webp`,
          description: 'Progressive genetic disorder causing gradual degeneration of photoreceptor cells in the retina. Creates distinctive tunnel vision with progressive peripheral vision loss, night blindness requiring 10-100x more light, severe light sensitivity and glare issues, color desaturation, and eventual complete blindness at advanced stages. The visual field constricts from normal 180° to 40°, 20°, or less, making navigation extremely challenging.',
          relatedPeople: ['Erik Weihenmayer'],
          treatments: {
            available: true,
            options: [
              'Vitamin A palmitate (15,000 IU/day) - may slow progression in some forms',
              'Docosahexaenoic acid (DHA) supplements',
              'Gene therapy (Luxturna) for specific RPE65 mutations - FDA approved',
              'Retinal implants (Argus II, Alpha AMS) for advanced cases',
              'Stem cell therapy (experimental)',
              'Low vision aids and rehabilitation',
              'Protection from bright light with sunglasses',
              'Genetic counseling and testing'
            ],
            notes: 'RP is progressive and currently has no cure for most forms. Treatment focuses on slowing progression and maximizing remaining vision. Gene therapy is available for specific genetic mutations.'
          }
        },
        {
          id: 'stargardt',
          name: 'Stargardt Disease',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Stargardt Disease.webp`,
          description: 'Genetic eye disorder causing progressive vision loss in the macula. Usually begins in childhood or adolescence, affecting central vision while peripheral vision remains.',
          relatedPeople: ['Marla Runyan'],
          treatments: {
            available: true,
            options: [
              'No cure currently available',
              'Low vision rehabilitation and aids',
              'Eccentric viewing training',
              'Gene therapy research is ongoing (experimental)',
              'Stem cell therapy research (experimental)',
              'Protection from bright light (may slow progression)',
              'Avoid high-dose vitamin A supplements',
              'Genetic counseling'
            ],
            notes: 'Stargardt disease is progressive and currently incurable. Management focuses on maximizing remaining peripheral vision and adaptive strategies. Research into gene and stem cell therapies is promising.'
          }
        },
        {
          id: 'retinalDetachment',
          name: 'Retinal Detachment',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Retinal Detachment.webp`,
          description: 'Separation of the retina from the underlying tissue. Can cause sudden flashes of light, floaters, and a curtain-like shadow over the visual field. Requires immediate medical attention.',
          relatedPeople: ['John Milton'],
          treatments: {
            available: true,
            options: [
              'Surgical repair (urgent):',
              '• Pneumatic retinopexy: gas bubble injection',
              '• Scleral buckle: band around eye to support retina',
              '• Vitrectomy: removal of vitreous gel and retinal reattachment',
              'Laser photocoagulation or cryopexy to seal retinal tears',
              'Post-surgical positioning (face-down) to help reattachment'
            ],
            notes: 'Retinal detachment is a medical emergency requiring immediate treatment. Success rates are high if treated promptly (within days). Delayed treatment can result in permanent vision loss.'
          }
        }
      ]
    },
    {
      id: 'neurological',
      name: 'Neurological Conditions',
      icon: <PsychologyIcon />,
      description: 'Conditions affecting the brain and nervous system that impact vision',
      conditions: [
        {
          id: 'visualAura',
          name: 'Visual Aura',
          description: 'Temporary visual disturbances that can precede migraines. May include flashing lights, zigzag patterns, or blind spots. Usually lasts 20-60 minutes before the headache begins.',
          treatments: {
            available: true,
            options: [
              'Migraine prevention medications: beta-blockers, anticonvulsants, antidepressants, CGRP inhibitors',
              'Acute migraine treatment: triptans, NSAIDs, ergotamines',
              'Lifestyle modifications: identify and avoid triggers, regular sleep, stress management',
              'Botox injections for chronic migraines',
              'Neuromodulation devices (Cefaly, gammaCore)',
              'Supplements: magnesium, riboflavin, coenzyme Q10'
            ],
            notes: 'Visual auras typically resolve on their own. Treatment focuses on preventing migraines and managing symptoms. Most people with auras can identify triggers to avoid.'
          }
        },
        {
          id: 'visualSnow',
          name: 'Visual Snow',
          description: 'A persistent visual disturbance where people see tiny, flickering dots across their entire visual field. Similar to the static noise on an old television. Can be constant or intermittent.',
          treatments: {
            available: true,
            options: [
              'Medications: lamotrigine, acetazolamide, topiramate (variable effectiveness)',
              'Tinted lenses (FL-41) to reduce symptoms',
              'Treatment of associated conditions (migraine, anxiety, depression)',
              'Cognitive behavioral therapy for associated anxiety',
              'Lifestyle modifications: reduce stress, adequate sleep, avoid triggers'
            ],
            notes: 'Visual snow syndrome has no definitive cure. Treatment is often trial-and-error. Some medications may help reduce symptoms. Research into the condition is ongoing.'
          }
        },
        {
          id: 'visualFloaters',
          name: 'Visual Floaters (Myodesopsia)',
          description: 'Shadows cast on the retina by debris floating in the vitreous humor. Includes cobweb/string floaters, dots/spots, ring floaters (Weiss Ring), and cloud/sheet floaters. Move with eye movement but lag behind, following fluid dynamics. Most visible against bright backgrounds, can interfere with reading and detailed tasks.',
          treatments: {
            available: true,
            options: [
              'Most floaters are harmless and require no treatment',
              'Vitrectomy: surgical removal of vitreous gel (for severe, persistent floaters)',
              'YAG laser vitreolysis: laser to break up floaters (limited effectiveness)',
              'Observation: many floaters settle or become less noticeable over time',
              'Address underlying causes: diabetic retinopathy, retinal tears, uveitis'
            ],
            notes: 'Most floaters are benign and do not require treatment. Sudden increase in floaters, especially with flashes, requires immediate eye exam to rule out retinal tear or detachment.'
          }
        },
        {
          id: 'hallucinations',
          name: 'Visual Hallucinations',
          description: 'Seeing things that are not actually present. Can be simple (lights, shapes) or complex (people, animals). Associated with various neurological conditions and medications.',
          treatments: {
            available: true,
            options: [
              'Treatment depends on underlying cause:',
              '• Charles Bonnet Syndrome (vision loss): reassurance, improved lighting, social interaction',
              '• Parkinson\'s disease: adjust medications, antipsychotics if severe',
              '• Dementia: cholinesterase inhibitors, antipsychotics (with caution)',
              '• Medication-induced: adjust or discontinue offending medication',
              '• Psychiatric conditions: antipsychotic medications, therapy',
              '• Epilepsy: anticonvulsant medications'
            ],
            notes: 'Treatment is highly dependent on the underlying cause. Charles Bonnet Syndrome (hallucinations due to vision loss) is usually harmless and may resolve on its own.'
          }
        },
        {
          id: 'diplopia',
          name: 'Diplopia (Double Vision)',
          description: 'Seeing two images of a single object. Can be monocular (affecting one eye) or binocular (affecting both eyes). Usually caused by misalignment of the eyes or problems within the eye itself.',
          treatments: {
            available: true,
            options: [
              'Treatment depends on cause:',
              '• Strabismus: eye muscle surgery, prism glasses, vision therapy, Botox injections',
              '• Cranial nerve palsy: treat underlying cause, prism glasses, eye patching, surgery if persistent',
              '• Thyroid eye disease: treat thyroid condition, steroids, surgery',
              '• Myasthenia gravis: medications (pyridostigmine, immunosuppressants)',
              '• Cataracts: cataract surgery',
              '• Corneal irregularities: contact lenses, corneal surgery',
              '• Brain tumor/stroke: treat underlying condition'
            ],
            notes: 'Monocular diplopia is usually due to eye problems (cataracts, corneal issues). Binocular diplopia requires treatment of eye alignment or underlying neurological conditions.'
          }
        },
        {
          id: 'glare',
          name: 'Glare Sensitivity',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Glare Sensitivity.webp`,
          description: 'Bloom or light-scatter effect proportional to scene luminance and eye adaptation state. Causes local veiling glare that washes out nearby details, especially after exposure to sudden brightness changes. Contrast recovery can be delayed to simulate photostress.',
          treatments: {
            available: true,
            options: [
              'Anti-glare sunglasses with polarized or tinted lenses',
              'FL-41 tinted lenses (rose-colored) for light sensitivity',
              'Treatment of underlying conditions: cataracts, dry eye, corneal issues',
              'Cataract surgery if cataracts are causing glare',
              'Lubricating eye drops for dry eye-related glare',
              'Avoiding bright light sources when possible',
              'Using hats or visors to block overhead light'
            ],
            notes: 'Glare sensitivity can be a symptom of various eye conditions. Treatment depends on the underlying cause. Anti-glare lenses and protective eyewear can significantly improve comfort.'
          }
        },
        {
          id: 'nightBlindness',
          name: 'Night Blindness (Nyctalopia)',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Night Blindness (Nyctalopia).webp`,
          description: 'Difficulty seeing in low light conditions or darkness. Vision becomes significantly impaired in dim lighting, making navigation and object recognition challenging. Often associated with rod cell dysfunction or vitamin A deficiency.',
          treatments: {
            available: true,
            options: [
              'Treatment depends on underlying cause:',
              '• Vitamin A deficiency: vitamin A supplementation',
              '• Retinitis pigmentosa: vitamin A palmitate, gene therapy (for specific mutations)',
              '• Cataracts: cataract surgery',
              '• Glaucoma: treatment to lower intraocular pressure',
              '• Refractive errors: prescription glasses or contact lenses',
              '• Zinc deficiency: zinc supplementation (often needed with vitamin A)',
              'Low vision aids: night vision devices, enhanced lighting',
              'Adaptive strategies: avoiding driving at night, using extra lighting'
            ],
            notes: 'Night blindness can be a symptom of various conditions. Some causes are treatable (vitamin deficiencies, cataracts), while others (retinitis pigmentosa) may be progressive. Early diagnosis is important.'
          }
        },
        {
          id: 'starbursting',
          name: 'Starbursting',
          imagePath: `${process.env.PUBLIC_URL || ''}/images/glossary/Starbursting.webp`,
          description: 'Light sources appearing as star-like rays or spikes extending outward from the center. Creates a "sunburst" or "starburst" pattern around bright lights, especially noticeable at night. Often caused by corneal irregularities or certain eye surgeries.',
          treatments: {
            available: true,
            options: [
              'Treatment depends on underlying cause:',
              '• Post-surgical (LASIK, PRK): usually improves over time, may require enhancement surgery',
              '• Corneal irregularities: rigid gas permeable contact lenses, corneal cross-linking',
              '• Cataracts: cataract surgery',
              '• Dry eye: lubricating eye drops, punctal plugs',
              '• Astigmatism: prescription glasses or contact lenses',
              'Anti-glare coatings on glasses',
              'Avoiding bright lights when possible',
              'Using polarized sunglasses at night (if legally allowed)'
            ],
            notes: 'Starbursting after refractive surgery often improves over 6-12 months. If persistent, it may require additional treatment. Corneal irregularities may need specialized contact lenses or surgical correction.'
          }
        }
      ]
    },
    {
      id: 'trauma-infections',
      name: 'Trauma & Infections',
      icon: <MedicalServicesIcon />,
      description: 'Conditions caused by injury, infection, or other external factors',
      conditions: [
        {
          id: 'sympatheticOphthalmia',
          name: 'Sympathetic Ophthalmia',
          description: 'An autoimmune response that can occur after injury to one eye, causing inflammation in both eyes. Can lead to complete blindness if not treated promptly.',
          relatedPeople: ['Louis Braille'],
          treatments: {
            available: true,
            options: [
              'High-dose systemic corticosteroids (oral or IV)',
              'Immunosuppressive medications: cyclosporine, azathioprine, mycophenolate, methotrexate',
              'Biologic agents: infliximab, adalimumab (for refractory cases)',
              'Long-term maintenance therapy to prevent recurrence',
              'Enucleation of injured eye (if vision is lost) may prevent SO but controversial'
            ],
            notes: 'Early, aggressive treatment is crucial to preserve vision. Treatment may need to be long-term to prevent recurrence. Modern treatment has improved outcomes significantly.'
          }
        },
        {
          id: 'meningitis',
          name: 'Meningitis',
          description: 'Inflammation of the membranes surrounding the brain and spinal cord. Can cause vision loss, hearing loss, and other neurological complications.',
          relatedPeople: ['Helen Keller', 'Ved Mehta'],
          treatments: {
            available: true,
            options: [
              'Immediate antibiotic or antiviral treatment (depending on cause)',
              'Corticosteroids to reduce inflammation and complications',
              'Supportive care: IV fluids, pain management, fever control',
              'Vision rehabilitation if vision loss occurs',
              'Prevention: vaccines (meningococcal, pneumococcal, Hib)',
              'Early treatment of infections that can lead to meningitis'
            ],
            notes: 'Immediate medical treatment is critical. Vision loss from meningitis is often permanent but early treatment can prevent complications. Vaccination is the best prevention.'
          }
        },
        {
          id: 'chemicalBurns',
          name: 'Chemical Burns',
          description: 'Severe damage to the eyes caused by exposure to chemicals. Can result in complete blindness and requires immediate medical attention.',
          relatedPeople: ['Joshua Miele'],
          treatments: {
            available: true,
            options: [
              'Immediate irrigation: flush eye with water or saline for 15-30 minutes',
              'Emergency medical treatment: continued irrigation, pH testing',
              'Topical antibiotics to prevent infection',
              'Lubricating eye drops and ointments',
              'Corticosteroids to reduce inflammation',
              'Amniotic membrane transplantation for severe burns',
              'Corneal transplantation (keratoplasty) if cornea is severely damaged',
              'Limbal stem cell transplantation for limbal stem cell deficiency',
              'Scleral contact lenses for severe surface damage'
            ],
            notes: 'Immediate irrigation is critical - seconds count. Alkali burns (lye, ammonia) are more severe than acid burns. Severe burns may require multiple surgeries and have variable outcomes.'
          }
        },
        {
          id: 'retinopathyPrematurity',
          name: 'Retinopathy of Prematurity (ROP)',
          description: 'Abnormal blood vessel development in the retina of premature infants. Can cause retinal detachment and blindness if not treated.',
          relatedPeople: ['Stevie Wonder'],
          treatments: {
            available: true,
            options: [
              'Laser photocoagulation: standard treatment for severe ROP',
              'Anti-VEGF injections (bevacizumab, ranibizumab)',
              'Cryotherapy (less common now)',
              'Vitrectomy surgery for retinal detachment',
              'Scleral buckle for retinal detachment',
              'Careful oxygen management in NICU to prevent ROP',
              'Regular screening exams for premature infants'
            ],
            notes: 'Early detection and treatment can prevent blindness. Treatment is most effective when done promptly. Modern NICU care and screening have significantly improved outcomes.'
          }
        },
        {
          id: 'neuromyelitisOptica',
          name: 'Neuromyelitis Optica (NMO)',
          description: 'Autoimmune disorder that attacks the optic nerves and spinal cord. Can cause severe vision loss and other neurological symptoms.',
          relatedPeople: ['Christine Ha'],
          treatments: {
            available: true,
            options: [
              'Acute attacks: high-dose IV corticosteroids, plasmapheresis',
              'Long-term prevention: immunosuppressive medications (azathioprine, mycophenolate, rituximab)',
              'Monoclonal antibodies: eculizumab, inebilizumab (FDA approved)',
              'IVIG (intravenous immunoglobulin)',
              'Vision rehabilitation and low vision aids',
              'Physical therapy for spinal cord involvement'
            ],
            notes: 'Early treatment of attacks and long-term immunosuppression can prevent further vision loss. Some vision may recover after attacks, but damage is often permanent. Modern treatments have significantly improved outcomes.'
          }
        },
        {
          id: 'juvenileRetinoschisis',
          name: 'Juvenile Retinoschisis',
          description: 'Genetic condition causing splitting of retinal layers, leading to progressive vision loss. Usually begins in childhood.',
          relatedPeople: ['Erik Weihenmayer'],
          treatments: {
            available: true,
            options: [
              'No cure currently available',
              'Regular monitoring for complications (retinal detachment, vitreous hemorrhage)',
              'Laser photocoagulation or cryotherapy for retinal tears',
              'Vitrectomy surgery for retinal detachment or persistent vitreous hemorrhage',
              'Low vision aids and rehabilitation',
              'Genetic counseling',
              'Gene therapy research is ongoing (experimental)'
            ],
            notes: 'Juvenile retinoschisis is progressive and currently incurable. Treatment focuses on managing complications and maximizing remaining vision. Regular monitoring is essential.'
          }
        },
        {
          id: 'incontinentiaPigmenti',
          name: 'Incontinentia Pigmenti',
          description: 'Rare genetic condition that can affect multiple body systems, including the eyes. Can cause vision loss from birth.',
          relatedPeople: ['Lucy Edwards'],
          treatments: {
            available: true,
            options: [
              'Regular eye exams to monitor for complications',
              'Laser photocoagulation for abnormal blood vessels',
              'Vitrectomy for retinal detachment or vitreous hemorrhage',
              'Treatment of other systemic manifestations',
              'Low vision aids and rehabilitation',
              'Genetic counseling',
              'Multidisciplinary care (neurology, dermatology, ophthalmology)'
            ],
            notes: 'Treatment focuses on managing eye complications and other systemic manifestations. Regular monitoring is essential. Vision loss varies widely among individuals.'
          }
        }
      ]
    }
  ], []);

  const [filteredCategories, setFilteredCategories] = useState(conditionCategories);

  const filterCategories = useCallback(() => {
    let filtered = conditionCategories;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.map(category => ({
        ...category,
        conditions: category.conditions.filter(condition =>
          condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          condition.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.conditions.length > 0);
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(category => category.id === categoryFilter);
    }

    setFilteredCategories(filtered);
  }, [searchTerm, categoryFilter, conditionCategories]);

  useEffect(() => {
    filterCategories();
  }, [filterCategories]);

  const handleCategoryChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? panel : false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFAQChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFAQ(isExpanded ? panel : false);
  };

  const handleTreatmentToggle = (conditionId: string) => {
    setExpandedTreatments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(conditionId)) {
        newSet.delete(conditionId);
      } else {
        newSet.add(conditionId);
      }
      return newSet;
    });
  };

  // Helper function to get image path for a condition
  // Tries .webp first (most common format), then falls back to .png
  const getConditionImagePath = (conditionName: string): string | null => {
    const basePath = `${process.env.PUBLIC_URL || ''}/images/glossary/${conditionName}`;
    // Try .webp first, then .png
    return `${basePath}.webp`;
  };

  const getCategoryColor = (_category: string) => {
    return '#1e3a8a';
  };

  // FAQ Items
  const faqItems: FAQItem[] = useMemo(() => [
    {
      id: 'darkness',
      question: 'Do blind people see complete darkness/blackness?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Not necessarily. About 85% of legally blind people have some remaining vision. Only 10-15% experience total darkness. Many see light/shadow, colors, or blurry shapes. Some who've never had sight don't experience "blackness" as a concept - similar to how you don't "see" blackness behind your head.
          </Typography>
        </Box>
      ),
      icon: <VisibilityIcon />,
      category: 'Vision & Perception'
    },
    {
      id: 'technology',
      question: 'How do blind people use smartphones and computers?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Screen readers (JAWS, NVDA, VoiceOver) convert text to speech or braille. Gestures and keyboard shortcuts replace mouse use. Many use normal smartphones with built-in accessibility features. Voice assistants like Siri are heavily utilized.
          </Typography>
        </Box>
      ),
      icon: <SmartphoneIcon />,
      category: 'Technology & Accessibility'
    },
    {
      id: 'independence',
      question: 'Can blind people live independently?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Yes. With proper training and adaptive techniques, blind people cook, clean, work, raise families, and live fully independent lives. They use systematic organization, tactile markers, assistive technology, and mobility tools.
          </Typography>
        </Box>
      ),
      icon: <HomeIcon />,
      category: 'Daily Life'
    },
    {
      id: 'navigation',
      question: 'How do blind people navigate and get around?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Blind people use various methods for navigation and mobility:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <DirectionsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="White canes detect obstacles and elevation changes" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DirectionsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Guide dogs provide intelligent disobedience and navigation" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DirectionsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="GPS apps with audio directions (Soundscape, BlindSquare)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DirectionsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Memorized routes and mental mapping" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DirectionsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Public transportation and rideshare apps" />
            </ListItem>
          </List>
        </Box>
      ),
      icon: <DirectionsIcon />,
      category: 'Navigation & Mobility'
    },
    {
      id: 'senses',
      question: 'Do blind people have heightened other senses?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            No, their other senses aren't biologically superior. They develop better attention to and processing of audio/tactile information through practice and necessity. It's enhanced perception, not enhanced sensation.
          </Typography>
        </Box>
      ),
      icon: <PsychologyIcon />,
      category: 'Vision & Perception'
    },
    {
      id: 'interaction',
      question: 'How should I interact with a blind person?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Here are some important guidelines for respectful interaction:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Speak normally and directly to them, not through companions" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Identify yourself when approaching" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Ask before helping - don't grab or push" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Give verbal descriptions when relevant" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Use normal language ('see you later' is fine)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Never pet or distract guide dogs" />
            </ListItem>
          </List>
        </Box>
      ),
      icon: <PersonIcon />,
      category: 'Social Interaction'
    },
    {
      id: 'legal-vs-total',
      question: 'What\'s the difference between legally blind and totally blind?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>Legally blind:</strong> Vision 20/200 or worse with correction, OR visual field less than 20 degrees
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Totally blind:</strong> No light perception (NLP)
          </Typography>
          <Typography variant="body1" paragraph>
            Most "blind" people fall somewhere between these extremes.
          </Typography>
        </Box>
      ),
      icon: <VisibilityIcon />,
      category: 'Vision & Perception'
    },
    {
      id: 'employment',
      question: 'Can blind people work regular jobs?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Yes. Blind people work as lawyers, teachers, programmers, musicians, psychologists, business owners, and countless other professions. Workplace accommodations (screen readers, braille displays) enable most jobs.
          </Typography>
        </Box>
      ),
      icon: <WorkIcon />,
      category: 'Employment & Career'
    },
    {
      id: 'identification',
      question: 'How do blind people identify money, colors, or objects?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            Blind people use various adaptive techniques for identification:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <ColorLensIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Money: Apps like Seeing AI, different folding methods, electronic identifiers, and different sizes for different denominations in various countries" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ColorLensIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Colors: Color identifier apps, asking others, buying pre-matched clothing" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ColorLensIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Objects: Systematic organization, braille/tactile labels, voice recording labels, memory" />
            </ListItem>
          </List>
        </Box>
      ),
      icon: <ColorLensIcon />,
      category: 'Daily Life'
    },
    {
      id: 'causes-treatment',
      question: 'What causes blindness and can it be cured?',
      answer: (
        <Box>
          <Typography variant="body1" paragraph>
            <strong>Leading causes globally:</strong>
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Cataracts (reversible)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Glaucoma" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Macular degeneration" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Diabetic retinopathy" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Genetic conditions" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Treatment depends on cause. Some conditions are preventable/treatable, others currently aren't. Research continues on treatments like gene therapy, stem cells, and bionic eyes.
          </Typography>
          <Typography variant="body1" paragraph>
            People can also lose their vision from neurological conditions like trauma or stroke.
          </Typography>
        </Box>
      ),
      icon: <MedicalServicesIcon />,
      category: 'Medical & Treatment'
    }
  ], []);

  return (
    <Box className="conditions-glossary" sx={{ pb: 10 }}>
      <NavigationBar showHomeButton={true} onHomeClick={handleHomeClick} />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Glossary & FAQ
        </Typography>
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            mb: 4, 
            color: 'text.primary',
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6,
            fontWeight: 400
          }}
        >
          Comprehensive definitions and explanations of vision conditions, visual impairments, and frequently asked questions about blindness and visual impairment.
        </Typography>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="glossary and faq tabs"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                minWidth: 120,
              }
            }}
          >
            <Tab label="Glossary" />
            <Tab label="FAQ" />
          </Tabs>
        </Box>

        {/* Glossary Tab Content */}
        {activeTab === 0 && (
          <>
            {/* Search and Filter Section */}
        <Box className="conditions-search-section">
          <Grid container spacing={1.5} sx={{ mb: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Search conditions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                className="conditions-search-input"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth className="conditions-filter-select">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {conditionCategories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {category.icon}
                        <Typography sx={{ ml: 1 }}>{category.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" className="conditions-stats">
              {filteredCategories.reduce((total, category) => total + category.conditions.length, 0)} conditions found
            </Typography>
            <Button onClick={clearFilters} variant="outlined" size="small" startIcon={<FilterListIcon />} className="conditions-clear-button">
              Clear Filters
            </Button>
          </Box>
        </Box>

        {/* Conditions by Category */}
        {filteredCategories.map((category) => (
          <Accordion 
            key={category.id}
            expanded={expandedCategory === category.id}
            onChange={handleCategoryChange(category.id)}
            className="condition-category-accordion"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className="condition-category-header"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5 }}>
                <Box className="condition-category-icon">
                  {category.icon}
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" component="h3" className="condition-category-title">
                  {category.name}
                </Typography>
                <Typography variant="body2" className="condition-category-subtitle">
                  {category.description} • {category.conditions.length} conditions
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List className="condition-list">
                {category.conditions.map((condition, index) => (
                  <React.Fragment key={condition.id}>
                    <ListItem className="condition-item" sx={{ position: 'relative' }}>
                      <ListItemIcon>
                        <Tooltip title="View in simulator">
                          <IconButton
                            size="small"
                            className="condition-simulator-button"
                            onClick={() => {
                              // Navigate to simulator with this condition
                              navigate('/simulator', { 
                                state: { 
                                  preconfiguredConditions: [condition.id],
                                  conditionName: condition.name
                                }
                              });
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemIcon>
                      <Box sx={{ width: '100%' }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6" component="h4" className="condition-name">
                                {condition.name}
                              </Typography>
                              {condition.relatedPeople && condition.relatedPeople.length > 0 && (
                                <Chip 
                                  label={`Featured in: ${condition.relatedPeople.join(', ')}`}
                                  size="small"
                                  className="condition-related-chip"
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" className="condition-description">
                              {condition.description}
                            </Typography>
                          }
                        />
                        {condition.treatments && (
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
                            <Box
                              onClick={() => handleTreatmentToggle(condition.id)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                cursor: 'pointer',
                                userSelect: 'none',
                                '&:hover': {
                                  opacity: 0.8
                                }
                              }}
                            >
                              <LocalHospitalIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', flexGrow: 1 }}>
                                Treatment Options
                              </Typography>
                              <ChevronRightIcon 
                                sx={{ 
                                  color: 'primary.main', 
                                  fontSize: 20,
                                  transform: expandedTreatments.has(condition.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s ease'
                                }} 
                              />
                            </Box>
                            <Collapse in={expandedTreatments.has(condition.id)}>
                              <Box sx={{ mt: 1.5 }}>
                                <List dense sx={{ pl: 0, mb: 1 }}>
                                  {condition.treatments.options.map((option, idx) => (
                                    <ListItem key={idx} sx={{ py: 0.5, pl: 2 }}>
                                      <ListItemIcon sx={{ minWidth: 8 }}>
                                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary={
                                          <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                                            {option}
                                          </Typography>
                                        }
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                                {condition.treatments.notes && (
                                  <Box sx={{ 
                                    mt: 1.5, 
                                    p: 1.5, 
                                    bgcolor: '#f8fafc', 
                                    borderRadius: 1, 
                                    borderLeft: '3px solid',
                                    borderColor: 'primary.main'
                                  }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                      <InfoIcon sx={{ color: 'primary.main', fontSize: 18, mt: 0.25 }} />
                                      <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontStyle: 'italic' }}>
                                        {condition.treatments.notes}
                                      </Typography>
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            </Collapse>
                          </Box>
                        )}
                      </Box>
                      {/* Thumbnail image on the right */}
                      {(condition.imagePath || getConditionImagePath(condition.name)) && (
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: { xs: 'none', md: 'block' },
                            width: 120,
                            height: 80,
                            borderRadius: 1,
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#f8fafc'
                          }}
                        >
                          <ThumbnailImage 
                            conditionName={condition.name}
                            imagePath={condition.imagePath}
                          />
                        </Box>
                      )}
                    </ListItem>
                    {index < category.conditions.length - 1 && <Divider className="condition-divider" />}
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}

        {filteredCategories.length === 0 && (
          <Box className="conditions-empty-state">
            <Typography variant="h6" color="text.secondary">
              No conditions found matching your search criteria.
            </Typography>
            <Button onClick={clearFilters} variant="contained" sx={{ mt: 2 }}>
              Clear All Filters
            </Button>
          </Box>
        )}

            {/* Additional Information */}
            <Box className="conditions-info-box">
              <Typography variant="h5" gutterBottom className="conditions-info-title">
                About This Glossary
              </Typography>
              <Typography variant="body1" paragraph className="conditions-info-text">
                This glossary contains comprehensive information about vision conditions and visual impairments. 
                Each condition includes detailed descriptions of symptoms, causes, and effects on daily life.
              </Typography>
              <Typography variant="body1" paragraph className="conditions-info-text">
                Conditions marked with "Featured in:" are associated with famous individuals in our simulator. 
                Click the eye icon next to any condition to experience it in our vision simulator.
              </Typography>
              <Typography variant="body1" className="conditions-info-text">
                This resource is designed to help users understand the various ways vision can be affected, 
                whether through genetic conditions, injury, disease, or other factors.
              </Typography>
            </Box>
          </>
        )}

        {/* FAQ Tab Content */}
        {activeTab === 1 && (
          <>
            {/* FAQ Items */}
            <Box sx={{ mb: 4 }}>
              {faqItems.map((faq, index) => (
                <Accordion 
                  key={faq.id}
                  expanded={expandedFAQ === faq.id}
                  onChange={handleFAQChange(faq.id)}
                  className="faq-accordion"
                  sx={{ mb: 1 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className="faq-summary"
                    sx={{
                      backgroundColor: getCategoryColor(faq.category),
                      color: 'white',
                      '&:hover': {
                        backgroundColor: getCategoryColor(faq.category),
                        opacity: 0.9,
                      },
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5 }}>
                      <Box className="faq-icon">
                        {faq.icon}
                      </Box>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0 }}>
                        <Typography variant="h6" component="h3" className="faq-question">
                          {index + 1}. {faq.question}
                        </Typography>
                        <Chip 
                          label={faq.category}
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontSize: '0.7rem',
                            height: '18px'
                          }}
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails className="faq-details">
                    {faq.answer}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Additional Information */}
            <Paper className="faq-info-box" elevation={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HelpIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" className="faq-info-title">
                  About These FAQs
                </Typography>
              </Box>
              <Typography variant="body1" paragraph className="faq-info-text">
                These frequently asked questions are based on common misconceptions and genuine curiosity about blindness and visual impairment. 
                The answers reflect the diverse experiences of blind and visually impaired individuals.
              </Typography>
              <Typography variant="body1" paragraph className="faq-info-text">
                Remember that every person's experience with vision loss is unique. What works for one person may not work for another, 
                and it's always best to ask individuals about their specific needs and preferences.
              </Typography>
              <Typography variant="body1" className="faq-info-text">
                For more detailed information about specific vision conditions, visit our <strong>Glossary</strong> tab above.
              </Typography>
            </Paper>
          </>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default ConditionsPage;
