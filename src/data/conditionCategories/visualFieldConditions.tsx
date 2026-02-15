import React from 'react';
import { RemoveRedEye as RemoveRedEyeIcon } from '@mui/icons-material';
import { ConditionCategory, PUBLIC_URL } from './types';

export const visualFieldCategory: ConditionCategory = {
  id: 'visual-field',
  name: 'Visual Field Loss',
  icon: <RemoveRedEyeIcon />,
  description: 'Conditions affecting specific areas of the visual field',
  conditions: [
    {
      id: 'hemianopiaLeft',
      name: 'Homonymous Hemianopia (Left-field)',
      imagePath: `${PUBLIC_URL}/images/glossary/Homonymous Hemianopia (Left-field).webp`,
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
      imagePath: `${PUBLIC_URL}/images/glossary/Homonymous Hemianopia (Right-field).webp`,
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
      imagePath: `${PUBLIC_URL}/images/glossary/Homonymous Inferior Quadrantanopia.webp`,
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
      imagePath: `${PUBLIC_URL}/images/glossary/Homonymous Superior Quadrantanopia.webp`,
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
      imagePath: `${PUBLIC_URL}/images/glossary/Complete Loss of Vision in Left Eye.webp`,
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
      imagePath: `${PUBLIC_URL}/images/glossary/Complete Loss of Vision in Right Eye.webp`,
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
      imagePath: `${PUBLIC_URL}/images/glossary/Bitemporal Hemianopia.webp`,
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
      imagePath: `${PUBLIC_URL}/images/glossary/Central Scotoma.webp`,
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
      imagePath: `${PUBLIC_URL}/images/glossary/Tunnel Vision.webp`,
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
};
