import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Box,
  Paper,
  Link,
  Divider
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  MenuBook as MenuBookIcon,
  School as SchoolIcon,
  Article as ArticleIcon,
  Support as SupportIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Devices as DevicesIcon,
  Pets as PetsIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import PageMeta from './PageMeta';

interface Resource {
  titleKey: string;
  descriptionKey: string;
  url: string;
  icon: React.ReactNode;
}

interface ResourceCategory {
  nameKey: string;
  resources: Resource[];
}

const resourceCategories: ResourceCategory[] = [
  {
    nameKey: 'resourcesPage.categories.organizations',
    resources: [
      {
        titleKey: 'resourcesPage.resources.nfb.title',
        descriptionKey: 'resourcesPage.resources.nfb.description',
        url: 'https://nfb.org',
        icon: <BusinessIcon />
      },
      {
        titleKey: 'resourcesPage.resources.acb.title',
        descriptionKey: 'resourcesPage.resources.acb.description',
        url: 'https://www.acb.org',
        icon: <BusinessIcon />
      },
      {
        titleKey: 'resourcesPage.resources.rnib.title',
        descriptionKey: 'resourcesPage.resources.rnib.description',
        url: 'https://www.rnib.org.uk',
        icon: <BusinessIcon />
      },
      {
        titleKey: 'resourcesPage.resources.wbu.title',
        descriptionKey: 'resourcesPage.resources.wbu.description',
        url: 'https://worldblindunion.org',
        icon: <BusinessIcon />
      },
      {
        titleKey: 'resourcesPage.resources.perkins.title',
        descriptionKey: 'resourcesPage.resources.perkins.description',
        url: 'https://www.perkins.org',
        icon: <SchoolIcon />
      }
    ]
  },
  {
    nameKey: 'resourcesPage.categories.assistiveTech',
    resources: [
      {
        titleKey: 'resourcesPage.resources.jaws.title',
        descriptionKey: 'resourcesPage.resources.jaws.description',
        url: 'https://www.freedomscientific.com/products/software/jaws/',
        icon: <DevicesIcon />
      },
      {
        titleKey: 'resourcesPage.resources.nvda.title',
        descriptionKey: 'resourcesPage.resources.nvda.description',
        url: 'https://www.nvaccess.org',
        icon: <DevicesIcon />
      },
      {
        titleKey: 'resourcesPage.resources.voiceover.title',
        descriptionKey: 'resourcesPage.resources.voiceover.description',
        url: 'https://support.apple.com/guide/voiceover/welcome/mac',
        icon: <DevicesIcon />
      },
      {
        titleKey: 'resourcesPage.resources.bemyeyes.title',
        descriptionKey: 'resourcesPage.resources.bemyeyes.description',
        url: 'https://www.bemyeyes.com',
        icon: <VisibilityIcon />
      }
    ]
  },
  {
    nameKey: 'resourcesPage.categories.education',
    resources: [
      {
        titleKey: 'resourcesPage.resources.hadley.title',
        descriptionKey: 'resourcesPage.resources.hadley.description',
        url: 'https://hadleyhelps.org/learn?topic_id=15',
        icon: <SchoolIcon />
      },
      {
        titleKey: 'resourcesPage.resources.visionaware.title',
        descriptionKey: 'resourcesPage.resources.visionaware.description',
        url: 'https://visionaware.org',
        icon: <SchoolIcon />
      },
      {
        titleKey: 'resourcesPage.resources.allaboutvision.title',
        descriptionKey: 'resourcesPage.resources.allaboutvision.description',
        url: 'https://www.allaboutvision.com',
        icon: <ArticleIcon />
      }
    ]
  },
  {
    nameKey: 'resourcesPage.categories.dailyLiving',
    resources: [
      {
        titleKey: 'resourcesPage.resources.braille.title',
        descriptionKey: 'resourcesPage.resources.braille.description',
        url: 'https://twoblindbrothers.com/pages/braille',
        icon: <MenuBookIcon />
      },
      {
        titleKey: 'resourcesPage.resources.caneTips.title',
        descriptionKey: 'resourcesPage.resources.caneTips.description',
        url: 'https://askablindperson.wordpress.com/2024/03/31/7-cane-tips-for-getting-jabbed-in-the-stomach-less-often/',
        icon: <ArticleIcon />
      },
      {
        titleKey: 'resourcesPage.resources.guidedogs.title',
        descriptionKey: 'resourcesPage.resources.guidedogs.description',
        url: 'https://www.guidedogsofamerica.org',
        icon: <PetsIcon />
      }
    ]
  },
  {
    nameKey: 'resourcesPage.categories.support',
    resources: [
      {
        titleKey: 'resourcesPage.resources.freeCane.title',
        descriptionKey: 'resourcesPage.resources.freeCane.description',
        url: 'https://nfb.org/programs-services/free-white-cane-program',
        icon: <SupportIcon />
      },
      {
        titleKey: 'resourcesPage.resources.phoneLines.title',
        descriptionKey: 'resourcesPage.resources.phoneLines.description',
        url: 'https://oepatients.org/accessibility-support-phone-lines-you-should-know/',
        icon: <PhoneIcon />
      },
      {
        titleKey: 'resourcesPage.resources.ada.title',
        descriptionKey: 'resourcesPage.resources.ada.description',
        url: 'https://www.ada.gov',
        icon: <SupportIcon />
      }
    ]
  }
];

const ResourcesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title="Vision & Accessibility Resources"
        description="Explore curated resources about vision conditions, accessibility, assistive technology, and organizations supporting people with visual impairments."
        path="/resources"
      />
      <NavigationBar />
      <Box sx={{ pt: '80px', pb: 10 }}>
        <Container maxWidth={false} sx={{ maxWidth: '1000px', py: 4 }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}>
              {t('resourcesPage.title')}
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              {t('resourcesPage.subtitle')}
            </Typography>
          </Box>

          {/* Categorized Resources */}
          {resourceCategories.map((category, catIndex) => (
            <Box key={catIndex} sx={{ mb: 5 }}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                {t(category.nameKey)}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {category.resources.map((resource, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 3,
                    mb: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{
                      mr: 2,
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      minWidth: '48px'
                    }}>
                      {resource.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Link
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textDecoration: 'none',
                          color: 'primary.main',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="h3"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          {t(resource.titleKey)}
                          <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                        </Typography>
                      </Link>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6, mt: 1 }}
                      >
                        {t(resource.descriptionKey)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          ))}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ResourcesPage;
