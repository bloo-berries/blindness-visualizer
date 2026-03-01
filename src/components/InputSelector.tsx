import React, { useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@mui/material';
import {
  Videocam,
  Image,
  YouTube,
  Star,
  Close,
  Security
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { InputSource } from '../types/visualEffects';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface InputSelectorProps {
  currentSource: InputSource;
  onSourceChange: (source: InputSource) => void;
}

const InputSelector: React.FC<InputSelectorProps> = ({ currentSource, onSourceChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { preferences } = useAccessibility();
  const { t } = useTranslation();
  const [dataPolicyOpen, setDataPolicyOpen] = useState(false);

  const inputOptions = [
    {
      type: 'webcam',
      icon: <Videocam sx={{ fontSize: 36 }} aria-hidden="true" />,
      title: t('inputSelector.webcam'),
      description: t('inputSelector.webcamDesc'),
      isPremium: true
    },
    {
      type: 'image',
      icon: <Image sx={{ fontSize: 36 }} aria-hidden="true" />,
      title: t('inputSelector.uploadImage'),
      description: t('inputSelector.uploadImageDesc'),
      isPremium: false
    },
    {
      type: 'youtube',
      icon: <YouTube sx={{ fontSize: 36, color: '#1e3a8a' }} aria-hidden="true" />,
      title: t('inputSelector.demoVideo'),
      description: t('inputSelector.demoVideoDesc'),
      isPremium: false
    }
  ];

  return (
    <Box 
      sx={{ py: 0.5 }}
      role="region"
    >
      
      <Grid container spacing={1.5}>
        {/* Demo Video - Large, prominent option */}
        {inputOptions
          .filter(option => option.type === 'youtube')
          .map((option) => (
            <Grid item xs={12} key={option.type}>
              <Card
                className={option.type === 'youtube' ? 'demo-video-card' : ''}
                sx={{
                  cursor: option.isPremium ? 'not-allowed' : 'pointer',
                  height: '100%',
                  transition: '0.3s',
                  opacity: option.isPremium ? 0.6 : 1,
                  '&:hover': {
                    transform: option.isPremium ? 'none' : 'translateY(-4px)',
                    boxShadow: option.isPremium ? 1 : 3
                  },
                  '&:focus-visible': {
                    outline: '3px solid #1976d2',
                    outlineOffset: '2px',
                    boxShadow: '0 0 0 6px rgba(25, 118, 210, 0.2)'
                  },
                  border: currentSource.type === option.type ? 2 : 0,
                  borderColor: 'primary.main',
                  backgroundColor: option.isPremium ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                  maxWidth: '500px',
                  mx: 'auto',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  ...(preferences.highContrast && option.type === 'youtube' && {
                    backgroundColor: '#ffffff !important',
                    background: '#ffffff !important'
                  })
                }}
                onClick={() => {
                  if (option.isPremium) {
                    return; // Do nothing for premium features
                  }
                  if (option.type === 'image') {
                    fileInputRef.current?.click();
                  } else {
                    onSourceChange({ type: option.type } as InputSource);
                  }
                }}
                role="button"
                tabIndex={option.isPremium ? -1 : 0}
                aria-pressed={currentSource.type === option.type}
                aria-label={option.isPremium ? `${option.title} (Coming Soon - Premium Feature)` : option.title}
                aria-describedby={`${option.type}-description`}
                onKeyDown={(e) => {
                  if (option.isPremium) {
                    return; // Do nothing for premium features
                  }
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (option.type === 'image') {
                      fileInputRef.current?.click();
                    } else {
                      onSourceChange({ type: option.type } as InputSource);
                    }
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', position: 'relative', p: 3 }}>
                  <Box sx={{ fontSize: '48px', mb: 2 }}>
                    {option.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="div"
                    className="demo-video-title"
                    sx={{
                      mt: 1,
                      fontWeight: 700,
                      color: '#1e293b',
                    }}
                  >
                    {option.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    id={`${option.type}-description`}
                    className="demo-video-description"
                    sx={{
                      mt: 1,
                      fontSize: '1rem',
                      color: '#475569',
                    }}
                  >
                    {option.description}
                  </Typography>
                  {option.isPremium && (
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        icon={<Star sx={{ color: 'var(--color-primary-accent) !important' }} />}
                        label="Coming Soon: Premium Feature"
                        variant="outlined"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          height: '24px',
                          color: 'var(--color-primary-accent)',
                          borderColor: 'var(--color-primary-accent)',
                          '& .MuiChip-icon': {
                            fontSize: '16px'
                          }
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        
        {/* Other options - Side by side */}
        <Grid item xs={12}>
          <Grid container spacing={1.5} justifyContent="center">
            {inputOptions
              .filter(option => option.type !== 'youtube')
              .map((option) => (
                <Grid item xs={12} sm={6} md={5} key={option.type}>
                  <Card
                    sx={{
                      cursor: option.isPremium ? 'not-allowed' : 'pointer',
                      height: '100%',
                      transition: '0.3s',
                      opacity: option.isPremium ? 0.6 : 1,
                      '&:hover': {
                        transform: option.isPremium ? 'none' : 'translateY(-4px)',
                        boxShadow: option.isPremium ? 1 : 3
                      },
                      '&:focus-visible': {
                        outline: '3px solid #1976d2',
                        outlineOffset: '2px',
                        boxShadow: '0 0 0 6px rgba(25, 118, 210, 0.2)'
                      },
                      border: currentSource.type === option.type ? 2 : 0,
                      borderColor: 'primary.main',
                      backgroundColor: option.isPremium ? 'rgba(0, 0, 0, 0.02)' : 'transparent'
                    }}
                    onClick={() => {
                      if (option.isPremium) {
                        return; // Do nothing for premium features
                      }
                      if (option.type === 'image') {
                        fileInputRef.current?.click();
                      } else {
                        onSourceChange({ type: option.type } as InputSource);
                      }
                    }}
                    role="button"
                    tabIndex={option.isPremium ? -1 : 0}
                    aria-pressed={currentSource.type === option.type}
                    aria-label={option.isPremium ? `${option.title} (Coming Soon - Premium Feature)` : option.title}
                    aria-describedby={`${option.type}-description`}
                    onKeyDown={(e) => {
                      if (option.isPremium) {
                        return; // Do nothing for premium features
                      }
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (option.type === 'image') {
                          fileInputRef.current?.click();
                        } else {
                          onSourceChange({ type: option.type } as InputSource);
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', position: 'relative', p: 1.5 }}>
                      <Box sx={{ fontSize: '32px', mb: 1 }}>
                        {option.icon}
                      </Box>
                      <Typography 
                        variant="body1" 
                        component="div" 
                        sx={{ mt: 1, fontWeight: 600 }}
                      >
                        {option.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        id={`${option.type}-description`}
                        sx={{ mt: 0.5, fontSize: '0.75rem' }}
                      >
                        {option.description}
                      </Typography>
                      {option.isPremium && (
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            icon={<Star sx={{ color: 'var(--color-primary-accent) !important' }} />}
                            label="Coming Soon: Premium Feature"
                            variant="outlined"
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '0.65rem',
                              height: '18px',
                              color: 'var(--color-primary-accent)',
                              borderColor: 'var(--color-primary-accent)',
                              '& .MuiChip-icon': {
                                fontSize: '12px'
                              }
                            }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Data Policy Link */}
      <Box sx={{ textAlign: 'center', mt: 1.5 }}>
        <Link
          component="button"
          variant="caption"
          onClick={() => setDataPolicyOpen(true)}
          sx={{
            fontSize: '0.7rem',
            color: 'text.secondary',
            textDecoration: 'underline',
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          Data Policy
        </Link>
      </Box>

      {/* Data Policy Dialog */}
      <Dialog
        open={dataPolicyOpen}
        onClose={() => setDataPolicyOpen(false)}
        maxWidth="xs"
        fullWidth
        aria-labelledby="data-policy-title"
      >
        <DialogTitle id="data-policy-title" sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security fontSize="small" color="primary" />
          <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
            Data Policy
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setDataPolicyOpen(false)}
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            <strong>Your privacy is protected.</strong>
          </Typography>
          <Typography variant="body2" paragraph>
            When you upload a photo or use your webcam, your images and video stay entirely on your device. There is no server communication - we never upload, store, or transmit your images anywhere.
          </Typography>
          <Typography variant="body2" paragraph>
            The image exists only in your browser's local memory during your session. It's automatically deleted when you navigate away or close your browser tab.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            This application runs entirely in your browser with no backend server for image processing.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDataPolicyOpen(false)} variant="contained" size="small">
            Got it
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              const imageUrl = URL.createObjectURL(file);

              onSourceChange({ 
                type: 'image', 
                url: imageUrl 
              });
              // Announce to screen readers
              const announcement = document.createElement('div');
              announcement.setAttribute('role', 'status');
              announcement.setAttribute('aria-live', 'polite');
              announcement.textContent = `Image ${file.name} loaded successfully`;
              document.body.appendChild(announcement);
              setTimeout(() => document.body.removeChild(announcement), 1000);
            }
          }}
          aria-label="Upload an image"
        />
      </Box>
    </Box>
  );
};

export default InputSelector; 