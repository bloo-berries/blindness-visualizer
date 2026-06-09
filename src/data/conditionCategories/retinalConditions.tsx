import React from 'react';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { ConditionCategory, PUBLIC_URL } from './types';

export const retinalConditionsCategory: ConditionCategory = {
  id: 'retinal-disorders',
  name: 'Retinal Disorders',
  icon: <VisibilityIcon />,
  description: 'Conditions affecting the retina and its specialized cells',
  conditions: [
    {
      id: 'retinitisPigmentosa',
      name: 'Retinitis Pigmentosa',
      imagePath: `${PUBLIC_URL}/images/glossary/Retinitis Pigmentosa.webp`,
      description: 'Progressive genetic disorder causing gradual degeneration of photoreceptor cells in the retina. Creates distinctive tunnel vision with progressive peripheral vision loss, night blindness requiring 10-100x more light, severe light sensitivity and glare issues, color desaturation, and eventual complete blindness at advanced stages. The visual field constricts from normal 180° to 40°, 20°, or less, making navigation extremely challenging.',
      prevalence: '~1 in 4,000 worldwide',
      relatedPeople: ['Erik Weihenmayer'],
      resourceLinks: [
        { label: 'NEI - Retinitis Pigmentosa', url: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/retinitis-pigmentosa' },
        { label: 'Foundation Fighting Blindness', url: 'https://www.fightingblindness.org/diseases/retinitis-pigmentosa' }
      ],
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
      imagePath: `${PUBLIC_URL}/images/glossary/Stargardt Disease.webp`,
      description: 'Genetic eye disorder causing progressive vision loss in the macula. Usually begins in childhood or adolescence, affecting central vision while peripheral vision remains.',
      prevalence: '~1 in 8,000-10,000 people',
      relatedPeople: ['Marla Runyan'],
      resourceLinks: [
        { label: 'NEI - Stargardt Disease', url: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/stargardt-disease' },
        { label: 'Foundation Fighting Blindness', url: 'https://www.fightingblindness.org/diseases/stargardt-disease' }
      ],
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
      imagePath: `${PUBLIC_URL}/images/glossary/Retinal Detachment.webp`,
      description: 'Separation of the retina from the underlying tissue. Can cause sudden flashes of light, floaters, and a curtain-like shadow over the visual field. Requires immediate medical attention.',
      prevalence: '~1 in 10,000 people per year',
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
    },
    {
      id: 'crao',
      name: 'Central Retinal Artery Occlusion (CRAO)',
      description: 'Sudden, painless vision loss caused by blockage of the central retinal artery, often called an "eye stroke." Results in ischemia of the inner retina and can cause permanent, severe vision loss within hours if untreated. Often presents with a classic "cherry red spot" on fundoscopic examination.',
      prevalence: '~1-2 per 100,000 people per year',
      treatments: {
        available: true,
        options: [
          'Emergency treatment required within hours',
          'Ocular massage to dislodge the embolus',
          'Anterior chamber paracentesis to lower intraocular pressure',
          'Intra-arterial thrombolysis (experimental)',
          'Hyperbaric oxygen therapy',
          'Evaluation for systemic vascular disease (stroke risk)',
          'Long-term cardiovascular risk factor management'
        ],
        notes: 'CRAO is a medical emergency. Vision loss is often permanent if not treated within 90 minutes. Patients with CRAO have a high risk of subsequent stroke and require urgent cardiovascular workup.'
      }
    },
    {
      id: 'crvo',
      name: 'Central Retinal Vein Occlusion (CRVO)',
      description: 'Blockage of the central retinal vein causing hemorrhages, retinal edema, and vision loss. The blocked vein leads to increased pressure in retinal capillaries, resulting in widespread hemorrhage and fluid leakage. Can be ischemic (severe) or non-ischemic (milder) forms.',
      prevalence: '~1-2 per 1,000 people over age 40',
      treatments: {
        available: true,
        options: [
          'Anti-VEGF injections (ranibizumab, aflibercept, bevacizumab) for macular edema',
          'Intravitreal corticosteroid implants (dexamethasone)',
          'Panretinal laser photocoagulation for neovascularization',
          'Management of underlying conditions (hypertension, diabetes, glaucoma)',
          'Regular monitoring for complications',
          'Blood pressure and cholesterol management'
        ],
        notes: 'Non-ischemic CRVO has a better prognosis with ~65% of patients regaining useful vision. Ischemic CRVO has higher risk of neovascular complications. Regular follow-up is essential.'
      }
    },
    {
      id: 'lhon',
      name: 'Leber Hereditary Optic Neuropathy (LHON)',
      resourceLinks: [
        { label: 'NEI - Leber Hereditary Optic Neuropathy', url: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/leber-hereditary-optic-neuropathy' },
        { label: 'NIH Genetic and Rare Diseases', url: 'https://rarediseases.info.nih.gov/diseases/6870/leber-hereditary-optic-neuropathy' }
      ],
      description: 'A mitochondrial genetic disorder causing rapid, painless central vision loss, typically affecting young adults aged 15-35. Usually begins in one eye, with the second eye affected within weeks to months. Caused by mutations in mitochondrial DNA affecting the optic nerve. Males are affected 4-5 times more often than females.',
      prevalence: '~1 in 30,000-50,000 people',
      treatments: {
        available: true,
        options: [
          'Idebenone (Raxone) - approved in EU, may improve visual outcomes if started early',
          'Gene therapy (lenadogene nolparvovec/Lumevoq) - approved in EU for specific mutations',
          'Avoid tobacco and excessive alcohol (known to trigger onset)',
          'Coenzyme Q10 and other mitochondrial supplements (limited evidence)',
          'Low vision rehabilitation and aids',
          'Genetic counseling for maternal inheritance pattern'
        ],
        notes: 'LHON is maternally inherited through mitochondrial DNA. Spontaneous partial recovery occurs in ~20-25% of cases, usually within the first year. Early treatment with idebenone may improve outcomes.'
      }
    }
  ]
};
