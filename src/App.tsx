import React from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  responsiveFontSizes
} from '@mui/material';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import VisionSimulator from './components/VisionSimulator';
import FamousBlindPeople from './components/FamousBlindPeople';
import ConditionsPage from './components/ConditionsPage';
import FAQPage from './components/FAQPage';
import AboutPage from './components/AboutPage';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import './styles/App.css';

let theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // Dark blue
      light: '#3b82f6',
      dark: '#1e40af',
    },
    secondary: {
      main: '#64748b', // Slate grey
      light: '#94a3b8',
      dark: '#475569',
    },
    background: {
      default: '#f8fafc', // Very light grey
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // Dark slate
      secondary: '#64748b', // Medium grey
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px',
          padding: '10px 24px',
          '&.Mui-focusVisible': {
            outline: '3px solid #1e3a8a',
            outlineOffset: '2px'
          }
        },
        contained: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: '3px solid #1e3a8a',
            outlineOffset: '2px'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        }
      }
    }
  },
});

theme = responsiveFontSizes(theme);

const App: React.FC = () => {
  return (
    <AccessibilityProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/simulator" element={<VisionSimulator />} />
            <Route path="/famous-people" element={<FamousBlindPeople />} />
            <Route path="/conditions" element={<ConditionsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AccessibilityProvider>
  );
};

export default App; 