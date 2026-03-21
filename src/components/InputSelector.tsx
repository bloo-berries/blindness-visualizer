import React, { useRef, useState, useEffect } from 'react';
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
  IconButton,
  Snackbar
} from '@mui/material';
import {
  Videocam,
  Image,
  YouTube,
  Star,
  Close,
  Security,
  PhoneIphone
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { InputSource } from '../types/visualEffects';
import { useAccessibility } from '../contexts/AccessibilityContext';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

interface InputSelectorProps {
  currentSource: InputSource;
  onSourceChange: (source: InputSource) => void;
}

const InputSelector: React.FC<InputSelectorProps> = ({ currentSource, onSourceChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlRef = useRef<string | null>(null);
  const { preferences } = useAccessibility();
  const { t } = useTranslation();
  const [dataPolicyOpen, setDataPolicyOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Revoke blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const inputOptions = [
    {
      type: 'youtube',
      icon: <YouTube sx={{ fontSize: 36, color: '#1e3a8a' }} aria-hidden="true" />,
      title: t('inputSelector.demoVideo'),
      description: t('inputSelector.demoVideoDesc'),
      isPremium: false
    },
    {
      type: 'image',
      icon: <Image sx={{ fontSize: 36 }} aria-hidden="true" />,
      title: t('inputSelector.uploadImage'),
      description: t('inputSelector.uploadImageDesc'),
      isPremium: false
    },
    {
      type: 'webcam',
      icon: <Videocam sx={{ fontSize: 36 }} aria-hidden="true" />,
      title: t('inputSelector.webcam'),
      description: t('inputSelector.webcamDesc'),
      isPremium: true
    },
    {
      type: 'app',
      icon: <PhoneIphone sx={{ fontSize: 36 }} aria-hidden="true" />,
      title: 'Mobile App',
      description: 'Experience vision simulations on the go',
      isPremium: true
    }
  ];

  return (
    <Box 
      sx={{ py: 0.5 }}
      role="region"
    >
      
      <Grid container spacing={1.5}>
        {/* Demo Video - Large, prominent option */}
        <Grid item xs={12}>
          {(() => {
            const option = inputOptions.find(o => o.type === 'youtube')!;
            return (
              <Card
                className="demo-video-card"
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  },
                  '&:focus-visible': {
                    outline: '3px solid #1976d2',
                    outlineOffset: '2px',
                    boxShadow: '0 0 0 6px rgba(25, 118, 210, 0.2)'
                  },
                  border: currentSource.type === 'youtube' ? 2 : 0,
                  borderColor: 'primary.main',
                  maxWidth: '500px',
                  mx: 'auto',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  ...(preferences.highContrast && {
                    backgroundColor: '#ffffff !important',
                    background: '#ffffff !important'
                  })
                }}
                onClick={() => onSourceChange({ type: 'youtube' } as InputSource)}
                role="button"
                tabIndex={0}
                aria-pressed={currentSource.type === 'youtube'}
                aria-label={option.title}
                aria-describedby="youtube-description"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSourceChange({ type: 'youtube' } as InputSource);
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
                    sx={{ mt: 1, fontWeight: 700, color: '#1e293b' }}
                  >
                    {option.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    id="youtube-description"
                    className="demo-video-description"
                    sx={{ mt: 1, fontSize: '1rem', color: '#475569' }}
                  >
                    {option.description}
                  </Typography>
                </CardContent>
              </Card>
            );
          })()}
        </Grid>

        {/* Upload Image - Below demo video */}
        <Grid item xs={12}>
          {(() => {
            const option = inputOptions.find(o => o.type === 'image')!;
            return (
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  },
                  '&:focus-visible': {
                    outline: '3px solid #1976d2',
                    outlineOffset: '2px',
                    boxShadow: '0 0 0 6px rgba(25, 118, 210, 0.2)'
                  },
                  border: currentSource.type === 'image' ? 2 : 0,
                  borderColor: 'primary.main',
                  maxWidth: '500px',
                  mx: 'auto',
                }}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-pressed={currentSource.type === 'image'}
                aria-label={option.title}
                aria-describedby="image-description"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', position: 'relative', p: 1.5 }}>
                  <Box sx={{ fontSize: '32px', mb: 1 }}>
                    {option.icon}
                  </Box>
                  <Typography variant="body1" component="div" sx={{ mt: 1, fontWeight: 600 }}>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" id="image-description" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                    {option.description}
                  </Typography>
                </CardContent>
              </Card>
            );
          })()}
        </Grid>

        {/* Premium options - Side by side */}
        <Grid item xs={12}>
          <Grid container spacing={1.5} justifyContent="center">
            {inputOptions
              .filter(option => option.isPremium)
              .map((option) => (
                <Grid item xs={6} sm={6} md={5} key={option.type}>
                  <Card
                    sx={{
                      cursor: 'not-allowed',
                      height: '100%',
                      transition: '0.3s',
                      opacity: 0.6,
                    }}
                    role="button"
                    tabIndex={-1}
                    aria-label={`${option.title} (Coming Soon - Premium Feature)`}
                    aria-describedby={`${option.type}-description`}
                  >
                    <CardContent sx={{ textAlign: 'center', position: 'relative', p: 1.5 }}>
                      <Box sx={{ fontSize: '32px', mb: 1 }}>
                        {option.icon}
                      </Box>
                      <Typography variant="body1" component="div" sx={{ mt: 1, fontWeight: 600 }}>
                        {option.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" id={`${option.type}-description`} sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                        {option.description}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          icon={<Star sx={{ color: 'var(--color-primary-accent) !important' }} />}
                          label={t('inputSelector.comingSoon', 'Coming Soon: Premium Feature')}
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
          {t('inputSelector.dataPolicy', 'Data Policy')}
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
            {t('inputSelector.dataPolicy', 'Data Policy')}
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
            <strong>{t('inputSelector.dataPolicyPrivacy', 'Your privacy is protected.')}</strong>
          </Typography>
          <Typography variant="body2" paragraph>
            {t('inputSelector.dataPolicyBody1', 'When you upload a photo or use your webcam, your images and video stay entirely on your device. There is no server communication - we never upload, store, or transmit your images anywhere.')}
          </Typography>
          <Typography variant="body2" paragraph>
            {t('inputSelector.dataPolicyBody2', 'The image exists only in your browser\'s local memory during your session. It\'s automatically deleted when you navigate away or close your browser tab.')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {t('inputSelector.dataPolicyBody3', 'This application runs entirely in your browser with no backend server for image processing.')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDataPolicyOpen(false)} variant="contained" size="small">
            {t('inputSelector.gotIt', 'Got it')}
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
              // Validate file type
              if (!file.type.startsWith('image/')) {
                setUploadError(t('inputSelector.invalidFileType', 'Please select a valid image file.'));
                return;
              }
              // Validate file size
              if (file.size > MAX_FILE_SIZE) {
                setUploadError(t('inputSelector.fileTooLarge', 'File is too large. Maximum size is 20MB.'));
                return;
              }

              // Revoke previous blob URL to prevent memory leak
              if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
              }

              try {
                const imageUrl = URL.createObjectURL(file);
                blobUrlRef.current = imageUrl;

                onSourceChange({
                  type: 'image',
                  url: imageUrl
                });
                // Announce to screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.textContent = t('inputSelector.imageLoaded', { name: file.name, defaultValue: `Image ${file.name} loaded successfully` });
                document.body.appendChild(announcement);
                setTimeout(() => document.body.removeChild(announcement), 1000);
              } catch {
                setUploadError(t('inputSelector.uploadFailed', 'Failed to load image. Please try again.'));
              }
            }
          }}
          aria-label="Upload an image"
        />
      </Box>

      <Snackbar
        open={!!uploadError}
        autoHideDuration={5000}
        onClose={() => setUploadError(null)}
        message={uploadError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default InputSelector; 