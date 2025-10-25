import React, { useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip
} from '@mui/material';
import {
  Videocam,
  Image,
  YouTube,
  Star
} from '@mui/icons-material';
import { InputSource } from '../types/visualEffects';

interface InputSelectorProps {
  currentSource: InputSource;
  onSourceChange: (source: InputSource) => void;
}

const InputSelector: React.FC<InputSelectorProps> = ({ currentSource, onSourceChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputOptions = [
    {
      type: 'webcam',
      icon: <Videocam sx={{ fontSize: 36 }} aria-hidden="true" />,
      title: 'Use Camera',
      description: 'Use your device camera to see effects in real-time',
      isPremium: true
    },
    {
      type: 'image',
      icon: <Image sx={{ fontSize: 36 }} aria-hidden="true" />,
      title: 'Upload Image',
      description: 'Upload an image from your device',
      isPremium: false
    },
    {
      type: 'youtube',
      icon: <YouTube sx={{ fontSize: 36 }} aria-hidden="true" />,
      title: 'Demo Video',
      description: 'Watch our demo video with applied effects',
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
                sx={{ 
                  cursor: option.isPremium ? 'not-allowed' : 'pointer',
                  height: '100%',
                  transition: '0.3s',
                  opacity: option.isPremium ? 0.6 : 1,
                  '&:hover': {
                    transform: option.isPremium ? 'none' : 'translateY(-4px)',
                    boxShadow: option.isPremium ? 1 : 3
                  },
                  border: currentSource.type === option.type ? 2 : 0,
                  borderColor: 'primary.main',
                  backgroundColor: option.isPremium ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                  maxWidth: '500px',
                  mx: 'auto',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
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
                    sx={{ mt: 1, fontWeight: 700 }}
                  >
                    {option.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    id={`${option.type}-description`}
                    sx={{ mt: 1, fontSize: '1rem' }}
                  >
                    {option.description}
                  </Typography>
                  {option.isPremium && (
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        icon={<Star />}
                        label="Coming Soon: Premium Feature"
                        color="primary"
                        variant="outlined"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          height: '24px',
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
                            icon={<Star />}
                            label="Coming Soon: Premium Feature"
                            color="primary"
                            variant="outlined"
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '0.65rem',
                              height: '18px',
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