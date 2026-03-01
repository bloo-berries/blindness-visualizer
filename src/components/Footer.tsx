import React from 'react';
import { Box, Container, Typography, Link, Button, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Favorite, GitHub as GitHubIcon } from '@mui/icons-material';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 0.75, sm: 1 },
        bgcolor: 'var(--color-footer-bg)',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10001,
        borderTop: '1px solid var(--color-border)'
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1000px', px: { xs: 1.5, sm: 2 } }}>
        {/* Mobile Layout */}
        <Box 
          sx={{ 
            display: { xs: 'flex', sm: 'none' },
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 0.5, sm: 1 },
            py: 0,
            width: '100%',
            position: 'relative'
          }}
        >
          {/* Center - Support Button */}
          <Button
            variant="contained"
            href="https://linktr.ee/bloomedhealth"
            target="_blank"
            rel="noopener"
            startIcon={<Favorite sx={{ fontSize: '14px' }} />}
            sx={{
              backgroundColor: '#E53935',
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: { xs: '11px', sm: '14px' },
              padding: { xs: '4px 10px', sm: '6px 20px' },
              textTransform: 'none',
              minWidth: 'auto',
              flexShrink: 0,
              position: 'relative',
              zIndex: 1,
              '&:hover': {
                backgroundColor: '#C62828'
              }
            }}
          >
            {t('buttons.support')}
          </Button>
          
          {/* Right side - Resources & Feedback */}
          <Box sx={{
            position: 'absolute',
            right: 0,
            flexShrink: 0,
            display: 'flex',
            gap: 1
          }}>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/resources');
              }}
              aria-label={t('nav.resources')}
              sx={{
                color: 'var(--color-footer-text)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.65rem', sm: '0.875rem' },
                whiteSpace: 'nowrap',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                },
                '&:focus-visible': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px',
                  borderRadius: '2px'
                }
              }}
            >
              {t('nav.resources')}
            </Link>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/feedback');
              }}
              aria-label={t('footer.feedback')}
              sx={{
                color: 'var(--color-footer-text)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.65rem', sm: '0.875rem' },
                whiteSpace: 'nowrap',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                },
                '&:focus-visible': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px',
                  borderRadius: '2px'
                }
              }}
            >
              {t('footer.feedback')}
            </Link>
          </Box>
        </Box>

        {/* Desktop Layout */}
        <Box 
          sx={{ 
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            position: 'relative'
          }}
        >
          {/* Left section - Copyright */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              position: 'absolute',
              left: 0
            }}
          >
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </Typography>
          
          {/* Center section - Support & Donate */}
          <Button
            variant="contained"
            href="https://linktr.ee/bloomedhealth"
            target="_blank"
            rel="noopener"
            startIcon={<Favorite sx={{ fontSize: '18px' }} />}
            sx={{
              backgroundColor: '#E53935',
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: '14px',
              padding: '6px 20px',
              textTransform: 'none',
              position: 'relative',
              zIndex: 10002,
              pointerEvents: 'auto',
              '&:hover': {
                backgroundColor: '#C62828'
              }
            }}
          >
            {t('buttons.supportDonate')}
          </Button>

          {/* Right section - Other links */}
          <Box
            component="nav"
            aria-label="Footer navigation"
            sx={{
              display: 'flex',
              gap: 3,
              alignItems: 'center',
              position: 'absolute',
              right: 0
            }}
          >
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/resources');
              }}
              aria-label={t('nav.resources')}
              sx={{
                color: 'var(--color-footer-text)',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                },
                '&:focus-visible': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px',
                  borderRadius: '2px'
                }
              }}
            >
              {t('nav.resources')}
            </Link>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/feedback');
              }}
              aria-label={t('footer.feedback')}
              sx={{
                color: 'var(--color-footer-text)',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                },
                '&:focus-visible': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px',
                  borderRadius: '2px'
                }
              }}
            >
              {t('footer.feedback')}
            </Link>
            <Tooltip title={t('nav.viewOnGithub')}>
              <IconButton
                component="a"
                href="https://github.com/bloo-berries/blindness-visualizer"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('nav.viewOnGithub')}
                size="small"
                sx={{
                  color: 'var(--color-footer-text)',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'transparent'
                  },
                  '&:focus-visible': {
                    outline: '2px solid #1976d2',
                    outlineOffset: '2px',
                    borderRadius: '4px'
                  }
                }}
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 