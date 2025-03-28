import React, { useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  VisuallyHidden
} from '@mui/material';
import {
  Videocam,
  Image,
  YouTube
} from '@mui/icons-material';
import { InputSource } from '../App';

interface InputSelectorProps {
  currentSource: InputSource;
  onSourceChange: (source: InputSource) => void;
}

const InputSelector: React.FC<InputSelectorProps> = ({ currentSource, onSourceChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const youtubeInputRef = useRef<HTMLInputElement>(null);

  const inputOptions = [
    {
      type: 'webcam',
      icon: <Videocam sx={{ fontSize: 48 }} aria-hidden="true" />,
      title: 'Use Webcam',
      description: 'Use your device camera to see effects in real-time'
    },
    {
      type: 'image',
      icon: <Image sx={{ fontSize: 48 }} aria-hidden="true" />,
      title: 'Upload Image',
      description: 'Upload an image from your device'
    },
    {
      type: 'youtube',
      icon: <YouTube sx={{ fontSize: 48 }} aria-hidden="true" />,
      title: 'YouTube Video',
      description: 'Enter a YouTube video URL'
    }
  ];

  return (
    <Box 
      sx={{ py: 2 }}
      role="region"
      aria-labelledby="input-selector-heading"
    >
      <Typography 
        variant="h6" 
        gutterBottom
        id="input-selector-heading"
      >
        Choose Your Input Source
      </Typography>
      
      <Grid container spacing={3}>
        {inputOptions.map((option) => (
          <Grid item xs={12} sm={4} key={option.type}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                height: '100%',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                },
                border: currentSource.type === option.type ? 2 : 0,
                borderColor: 'primary.main'
              }}
              onClick={() => {
                if (option.type === 'image') {
                  fileInputRef.current?.click();
                } else if (option.type === 'youtube') {
                  // Focus on YouTube input
                  youtubeInputRef.current?.focus();
                } else {
                  onSourceChange({ type: option.type as InputSource['type'] });
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={currentSource.type === option.type}
              aria-label={option.title}
              aria-describedby={`${option.type}-description`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (option.type === 'image') {
                    fileInputRef.current?.click();
                  } else if (option.type === 'youtube') {
                    youtubeInputRef.current?.focus();
                  } else {
                    onSourceChange({ type: option.type as InputSource['type'] });
                  }
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                {option.icon}
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ mt: 2 }}
                >
                  {option.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  id={`${option.type}-description`}
                >
                  {option.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onSourceChange({ 
              type: 'image', 
              url: URL.createObjectURL(file) 
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

      {currentSource.type === 'youtube' && (
        <Box 
          sx={{ mt: 3 }}
          role="form"
          aria-labelledby="youtube-form-label"
        >
          <Typography 
            id="youtube-form-label" 
            sx={{ mb: 1 }}
          >
            Enter YouTube URL:
          </Typography>
          <TextField
            fullWidth
            label="YouTube Video URL"
            variant="outlined"
            placeholder="https://www.youtube.com/watch?v=..."
            inputRef={youtubeInputRef}
            aria-label="YouTube video URL"
            helperText="Paste a YouTube video URL here and click Load Video"
            InputProps={{
              endAdornment: (
                <Button 
                  variant="contained" 
                  onClick={() => {
                    const url = youtubeInputRef.current?.value;
                    if (url) {
                      onSourceChange({ type: 'youtube', url });
                      // Announce to screen readers
                      const announcement = document.createElement('div');
                      announcement.setAttribute('role', 'status');
                      announcement.setAttribute('aria-live', 'polite');
                      announcement.textContent = 'YouTube video loaded successfully';
                      document.body.appendChild(announcement);
                      setTimeout(() => document.body.removeChild(announcement), 1000);
                    }
                  }}
                  aria-label="Load YouTube video"
                >
                  Load Video
                </Button>
              )
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default InputSelector; 