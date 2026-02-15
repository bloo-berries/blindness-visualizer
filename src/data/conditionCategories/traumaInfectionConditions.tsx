import React from 'react';
import { MedicalServices as MedicalServicesIcon } from '@mui/icons-material';
import { ConditionCategory } from './types';

export const traumaInfectionConditionsCategory: ConditionCategory = {
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
};
