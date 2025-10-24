import React from 'react';
import { 
  Box, 
  Breadcrumbs, 
  Link, 
  Typography, 
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Home as HomeIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';

interface BreadcrumbNavProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick?: (step: number) => void;
  showHomeLink?: boolean;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  onStepClick,
  showHomeLink = true
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleStepClick = (step: number) => {
    if (onStepClick) {
      onStepClick(step);
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 0:
        return <VisibilityIcon fontSize="small" />;
      case 1:
        return <SettingsIcon fontSize="small" />;
      case 2:
        return <PlayIcon fontSize="small" />;
      default:
        return <VisibilityIcon fontSize="small" />;
    }
  };

  const breadcrumbItems = [
    ...(showHomeLink ? [{
      label: 'Home',
      icon: <HomeIcon fontSize="small" />,
      onClick: handleHomeClick,
      clickable: true,
      isCurrent: false,
      isCompleted: false
    }] : []),
    ...stepLabels.map((label, index) => ({
      label,
      icon: getStepIcon(index),
      onClick: () => handleStepClick(index),
      clickable: index < currentStep,
      isCurrent: index === currentStep,
      isCompleted: index < currentStep
    }))
  ];

  return (
    <Box sx={{ 
      mb: 2,
      p: { xs: 1, sm: 2 },
      backgroundColor: 'background.paper',
      borderRadius: 2,
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <Breadcrumbs 
        separator="›" 
        sx={{ 
          '& .MuiBreadcrumbs-separator': {
            color: 'text.secondary',
            fontSize: '1.2rem',
            fontWeight: 600
          }
        }}
        aria-label="Simulator navigation breadcrumb"
      >
        {breadcrumbItems.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {item.clickable ? (
              <Link
                component="button"
                onClick={item.onClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  textDecoration: 'none',
                  color: item.isCompleted ? 'primary.main' : 'text.secondary',
                  fontWeight: item.isCurrent ? 600 : 400,
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  },
                  '&:focus': {
                    outline: '2px solid #1e3a8a',
                    outlineOffset: '2px',
                    borderRadius: '4px'
                  }
                }}
                aria-label={`Go to ${item.label}`}
              >
                {item.icon}
                {!isMobile && item.label}
              </Link>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {item.icon}
                <Typography
                  variant={isMobile ? 'caption' : 'body2'}
                  sx={{
                    color: item.isCurrent ? 'primary.main' : 'text.secondary',
                    fontWeight: item.isCurrent ? 600 : 400,
                    display: isMobile ? 'none' : 'block'
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            )}
            
            {item.isCurrent && (
              <Chip
                label={`Step ${currentStep + 1} of ${totalSteps}`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  ml: 1,
                  fontSize: '0.75rem',
                  height: '24px',
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            )}
          </Box>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbNav;
