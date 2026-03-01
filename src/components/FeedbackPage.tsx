import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Snackbar,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent
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
import { sendFeedbackEmailServerless, FeedbackEmailData } from '../utils/emailService';

type FeedbackType = 'general' | 'bug' | 'feature' | 'improvement' | 'other';
type ChipColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';

interface FeedbackForm {
  type: FeedbackType;
  name: string;
  email: string;
  subject: string;
  message: string;
  rating?: number;
  favoriteFeature?: string;
  userType?: string;
  browser?: string;
  accessibilityNeeds?: string[];
}

interface FeedbackTypeOption {
  value: FeedbackType;
  labelKey: string;
  icon: React.ReactElement;
  color: ChipColor;
}

const FeedbackPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FeedbackForm>({
    type: 'general',
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5,
    favoriteFeature: '',
    userType: '',
    browser: '',
    accessibilityNeeds: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const feedbackTypes: FeedbackTypeOption[] = [
    { value: 'general', labelKey: 'feedbackPage.feedbackTypes.general', icon: <FeedbackIcon />, color: 'primary' },
    { value: 'bug', labelKey: 'feedbackPage.feedbackTypes.bug', icon: <BugReportIcon />, color: 'error' },
    { value: 'feature', labelKey: 'feedbackPage.feedbackTypes.feature', icon: <LightbulbIcon />, color: 'success' },
    { value: 'improvement', labelKey: 'feedbackPage.feedbackTypes.improvement', icon: <StarIcon />, color: 'warning' },
    { value: 'other', labelKey: 'feedbackPage.feedbackTypes.other', icon: <FeedbackIcon />, color: 'default' }
  ];

  const favoriteFeatures = [
    { value: 'demo-video', labelKey: 'feedbackPage.favoriteFeature.options.demoVideo' },
    { value: 'upload-photo', labelKey: 'feedbackPage.favoriteFeature.options.uploadPhoto' },
    { value: 'famous-people', labelKey: 'feedbackPage.favoriteFeature.options.famousPeople' }
  ];

  const userTypes = [
    { value: 'student', labelKey: 'feedbackPage.userType.options.student' },
    { value: 'educator', labelKey: 'feedbackPage.userType.options.educator' },
    { value: 'healthcare', labelKey: 'feedbackPage.userType.options.healthcare' },
    { value: 'researcher', labelKey: 'feedbackPage.userType.options.researcher' },
    { value: 'general', labelKey: 'feedbackPage.userType.options.general' },
    { value: 'other', labelKey: 'feedbackPage.userType.options.other' }
  ];

  const browsers = [
    { value: 'chrome', labelKey: 'feedbackPage.browser.options.chrome' },
    { value: 'firefox', labelKey: 'feedbackPage.browser.options.firefox' },
    { value: 'safari', labelKey: 'feedbackPage.browser.options.safari' },
    { value: 'edge', labelKey: 'feedbackPage.browser.options.edge' },
    { value: 'opera', labelKey: 'feedbackPage.browser.options.opera' },
    { value: 'other', labelKey: 'feedbackPage.browser.options.other' }
  ];

  const accessibilityOptions = [
    { value: 'screen-reader', labelKey: 'feedbackPage.accessibility.options.screenReader' },
    { value: 'voice-control', labelKey: 'feedbackPage.accessibility.options.voiceControl' },
    { value: 'keyboard-navigation', labelKey: 'feedbackPage.accessibility.options.keyboardNavigation' },
    { value: 'magnification', labelKey: 'feedbackPage.accessibility.options.magnification' },
    { value: 'high-contrast', labelKey: 'feedbackPage.accessibility.options.highContrast' },
    { value: 'none', labelKey: 'feedbackPage.accessibility.options.none' }
  ];

  const handleInputChange = useCallback((field: keyof FeedbackForm) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleAccessibilityChange = useCallback((event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      accessibilityNeeds: typeof value === 'string' ? value.split(',') : value
    }));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Send feedback email
      await sendFeedbackEmailServerless(formData as FeedbackEmailData);
      
      // Reset form
      setFormData({
        type: 'general',
        name: '',
        email: '',
        subject: '',
        message: '',
        rating: 5,
        favoriteFeature: '',
        userType: '',
        browser: '',
        accessibilityNeeds: []
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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 10 }}>
      <NavigationBar />
      
      <Container component="main" id="main-content" maxWidth={false} sx={{ maxWidth: '1000px', pt: 12, pb: 8 }}>
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
            {t('feedbackPage.title')}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}
          >
            {t('feedbackPage.subtitle')}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Feedback Types */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: 'fit-content', position: 'sticky', top: 100 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }} id="feedback-type-label">
                  {t('feedbackPage.whatToShare')}
                </Typography>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}
                  role="radiogroup"
                  aria-labelledby="feedback-type-label"
                >
                  {feedbackTypes.map((type) => (
                    <Chip
                      key={type.value}
                      icon={type.icon}
                      label={t(type.labelKey)}
                      variant={formData.type === type.value ? 'filled' : 'outlined'}
                      color={formData.type === type.value ? type.color : 'default'}
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      role="radio"
                      aria-checked={formData.type === type.value}
                      tabIndex={0}
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
              className="feedback-form-paper"
              sx={{ 
                p: 4,
                borderRadius: 3,
                backgroundColor: 'background.paper'
              }}
            >
              <form onSubmit={handleSubmit} className="feedback-form" aria-label={t('feedbackPage.title')}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Name and Email */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      fullWidth
                      label={t('feedbackPage.form.name')}
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      required
                      variant="outlined"
                      sx={{ minWidth: '200px' }}
                    />
                    <TextField
                      fullWidth
                      label={t('feedbackPage.form.email')}
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
                    label={t('feedbackPage.form.subject')}
                    value={formData.subject}
                    onChange={handleInputChange('subject')}
                    required
                    variant="outlined"
                    placeholder={t('feedbackPage.form.subjectPlaceholder')}
                  />

                  {/* Favorite Feature Dropdown */}
                  <FormControl fullWidth>
                    <InputLabel>{t('feedbackPage.favoriteFeature.label')}</InputLabel>
                    <Select
                      value={formData.favoriteFeature}
                      onChange={handleInputChange('favoriteFeature')}
                      label={t('feedbackPage.favoriteFeature.label')}
                    >
                      {favoriteFeatures.map((feature) => (
                        <MenuItem key={feature.value} value={feature.value}>
                          {t(feature.labelKey)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* User Type and Browser - Side by Side */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: '200px', flex: 1 }}>
                      <InputLabel>{t('feedbackPage.userType.label')}</InputLabel>
                      <Select
                        value={formData.userType}
                        onChange={handleInputChange('userType')}
                        label={t('feedbackPage.userType.label')}
                      >
                        {userTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {t(type.labelKey)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: '200px', flex: 1 }}>
                      <InputLabel>{t('feedbackPage.browser.label')}</InputLabel>
                      <Select
                        value={formData.browser}
                        onChange={handleInputChange('browser')}
                        label={t('feedbackPage.browser.label')}
                      >
                        {browsers.map((browser) => (
                          <MenuItem key={browser.value} value={browser.value}>
                            {t(browser.labelKey)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Accessibility Needs Dropdown */}
                  <FormControl fullWidth>
                    <InputLabel>{t('feedbackPage.accessibility.label')}</InputLabel>
                    <Select
                      multiple
                      value={formData.accessibilityNeeds || []}
                      onChange={handleAccessibilityChange}
                      input={<OutlinedInput label={t('feedbackPage.accessibility.label')} />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const option = accessibilityOptions.find(o => o.value === value);
                            return (
                              <Chip
                                key={value}
                                label={option ? t(option.labelKey) : value}
                                size="small"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {accessibilityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Message */}
                  <TextField
                    fullWidth
                    label={t('feedbackPage.form.message')}
                    value={formData.message}
                    onChange={handleInputChange('message')}
                    required
                    multiline
                    rows={8}
                    variant="outlined"
                    placeholder={
                      formData.type === 'bug'
                        ? t('feedbackPage.form.messagePlaceholders.bug')
                        : formData.type === 'feature'
                        ? t('feedbackPage.form.messagePlaceholders.feature')
                        : formData.type === 'improvement'
                        ? t('feedbackPage.form.messagePlaceholders.improvement')
                        : t('feedbackPage.form.messagePlaceholders.general')
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
                      <Typography variant="body2" color="text.secondary" gutterBottom id="rating-label">
                        {t('feedbackPage.rating.label')}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }} role="group" aria-labelledby="rating-label">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            variant={formData.rating === rating ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setFormData(prev => ({ ...prev, rating }))}
                            sx={{ minWidth: '40px' }}
                            aria-label={`${t('feedbackPage.rating.label')} ${rating} out of 5`}
                            aria-pressed={formData.rating === rating}
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
                      {isSubmitting ? t('feedbackPage.submit.submitting') : t('feedbackPage.submit.button')}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>

      </Container>

      <Footer />

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={10000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 90, sm: 90 }, zIndex: 9999, maxWidth: '600px' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
          role="alert"
          aria-live="polite"
        >
          {t('feedbackPage.messages.success')}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 90, sm: 90 }, zIndex: 9999 }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          sx={{ width: '100%' }}
          role="alert"
          aria-live="assertive"
        >
          {t('feedbackPage.messages.error')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedbackPage;
