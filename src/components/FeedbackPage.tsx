import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Send as SendIcon,
  Feedback as FeedbackIcon,
  BugReport as BugReportIcon,
  Lightbulb as LightbulbIcon,
  Star as StarIcon
} from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface FeedbackForm {
  type: 'general' | 'bug' | 'feature' | 'improvement' | 'other';
  name: string;
  email: string;
  subject: string;
  message: string;
  rating?: number;
}

const FeedbackPage: React.FC = () => {
  const { preferences } = useAccessibility();
  const [formData, setFormData] = useState<FeedbackForm>({
    type: 'general',
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: <FeedbackIcon />, color: 'primary' },
    { value: 'bug', label: 'Bug Report', icon: <BugReportIcon />, color: 'error' },
    { value: 'feature', label: 'Feature Request', icon: <LightbulbIcon />, color: 'success' },
    { value: 'improvement', label: 'Improvement Suggestion', icon: <StarIcon />, color: 'warning' },
    { value: 'other', label: 'Other', icon: <FeedbackIcon />, color: 'default' }
  ];

  const handleInputChange = (field: keyof FeedbackForm) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission (replace with actual submission logic)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({
        type: 'general',
        name: '',
        email: '',
        subject: '',
        message: '',
        rating: 5
      });
      
      setShowSuccess(true);
    } catch (error) {
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.subject.trim() && formData.message.trim();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <NavigationBar />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              mb: 2
            }}
          >
            Submit Feedback
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}
          >
            Help us improve the Vision Simulator by sharing your thoughts, reporting bugs, or suggesting new features.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Feedback Types */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: 'fit-content', position: 'sticky', top: 100 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  What would you like to share?
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                  {feedbackTypes.map((type) => (
                    <Chip
                      key={type.value}
                      icon={type.icon}
                      label={type.label}
                      variant={formData.type === type.value ? 'filled' : 'outlined'}
                      color={formData.type === type.value ? type.color as any : 'default'}
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
                      sx={{
                        justifyContent: 'flex-start',
                        height: 'auto',
                        py: 1.5,
                        '& .MuiChip-label': {
                          fontWeight: formData.type === type.value ? 600 : 400
                        }
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Feedback Form */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 4,
                borderRadius: 3,
                backgroundColor: 'background.paper'
              }}
            >
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Name and Email */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      required
                      variant="outlined"
                      sx={{ minWidth: '200px' }}
                    />
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      required
                      variant="outlined"
                      sx={{ minWidth: '200px' }}
                    />
                  </Box>

                  {/* Subject */}
                  <TextField
                    fullWidth
                    label="Subject"
                    value={formData.subject}
                    onChange={handleInputChange('subject')}
                    required
                    variant="outlined"
                    placeholder="Brief description of your feedback"
                  />

                  {/* Message */}
                  <TextField
                    fullWidth
                    label="Your Message"
                    value={formData.message}
                    onChange={handleInputChange('message')}
                    required
                    multiline
                    rows={8}
                    variant="outlined"
                    placeholder={
                      formData.type === 'bug' 
                        ? "Please describe the bug you encountered, including steps to reproduce it and any error messages you saw."
                        : formData.type === 'feature'
                        ? "Describe the feature you'd like to see added and how it would improve the experience."
                        : formData.type === 'improvement'
                        ? "Tell us how we can improve an existing feature or the overall experience."
                        : "Share your thoughts, suggestions, or any other feedback you have."
                    }
                    sx={{
                      '& .MuiInputBase-root': {
                        alignItems: 'flex-start'
                      }
                    }}
                  />

                  {/* Rating (for general feedback) */}
                  {formData.type === 'general' && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        How would you rate your overall experience?
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            variant={formData.rating === rating ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setFormData(prev => ({ ...prev, rating }))}
                            sx={{ minWidth: '40px' }}
                          >
                            {rating}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Submit Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={!isFormValid || isSubmitting}
                      startIcon={<SendIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 2
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {/* Additional Information */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            We appreciate your feedback and will review all submissions carefully. 
            While we can't respond to every message individually, your input helps us make the Vision Simulator better for everyone.
          </Typography>
        </Box>
      </Container>

      <Footer />

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Thank you for your feedback! We've received your submission and will review it carefully.
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          There was an error submitting your feedback. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedbackPage;
