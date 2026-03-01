import React, { Suspense, useMemo } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  CircularProgress,
  Box
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import VisionSimulator from './components/VisionSimulator';
import FamousBlindPeople from './components/FamousBlindPeople.tsx';
import ConditionsPage from './components/ConditionsPage';
import FAQPage from './components/FAQPage';
import AboutPage from './components/AboutPage';
import FeedbackPage from './components/FeedbackPage';
import ResourcesPage from './components/ResourcesPage';
import { AccessibilityProvider, useAccessibility } from './contexts/AccessibilityContext';
import type { ThemeMode } from './contexts/AccessibilityContext';
import ErrorBoundary from './components/ErrorBoundary';
import './i18n'; // Initialize i18n
import './styles/App.css';

const getBasename = (): string => {
  const publicUrl = process.env.PUBLIC_URL || '';
  if (!publicUrl) {
    return '';
  }
  if (publicUrl.startsWith('http')) {
    try {
      const url = new URL(publicUrl);
      return url.pathname.replace(/\/$/, '') || '';
    } catch {
      return '';
    }
  }
  return publicUrl.replace(/\/$/, '');
};

function buildTheme(mode: ThemeMode) {
  const isDark = mode === 'dim' || mode === 'dark';

  const palettes = {
    light: {
      background: { default: '#f8fafc', paper: '#ffffff' },
      text: { primary: '#1e293b', secondary: '#64748b' },
      divider: '#e2e8f0',
      grey: {
        50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
        400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
        800: '#1e293b', 900: '#0f172a',
      },
    },
    dim: {
      background: { default: '#15202b', paper: '#1c2b3a' },
      text: { primary: '#e7e9ea', secondary: '#8b98a5' },
      divider: '#38444d',
      // Inverted grey scale so grey.50 = lightest in dark contexts
      grey: {
        50: '#e7e9ea', 100: '#d9dbde', 200: '#8b98a5', 300: '#6e7c87',
        400: '#536471', 500: '#38444d', 600: '#2c3a47', 700: '#253341',
        800: '#1c2b3a', 900: '#15202b',
      },
    },
    dark: {
      background: { default: '#000000', paper: '#16181c' },
      text: { primary: '#e7e9ea', secondary: '#71767b' },
      divider: '#2f3336',
      grey: {
        50: '#e7e9ea', 100: '#d9dbde', 200: '#71767b', 300: '#536471',
        400: '#3d4144', 500: '#2f3336', 600: '#1e2023', 700: '#16181c',
        800: '#0e0f11', 900: '#000000',
      },
    },
  };

  const p = palettes[mode];

  let theme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: isDark ? '#60a5fa' : '#1e3a8a',
        light: isDark ? '#93c5fd' : '#3b82f6',
        dark: isDark ? '#3b82f6' : '#1e40af',
      },
      secondary: {
        main: '#64748b',
        light: '#94a3b8',
        dark: '#475569',
      },
      background: p.background,
      text: p.text,
      divider: p.divider,
      grey: p.grey as any,
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.2 },
      h2: { fontWeight: 600, fontSize: '2rem', lineHeight: 1.3 },
      h3: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.4 },
      h4: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.4 },
      h5: { fontWeight: 500, fontSize: '1.125rem', lineHeight: 1.4 },
      h6: { fontWeight: 500, fontSize: '1rem', lineHeight: 1.4 },
      body1: { fontSize: '1rem', lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', lineHeight: 1.6 },
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
              outline: `3px solid ${isDark ? '#60a5fa' : '#1e3a8a'}`,
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
              outline: `3px solid ${isDark ? '#60a5fa' : '#1e3a8a'}`,
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
            border: `1px solid ${p.divider}`,
            backgroundColor: p.background.paper,
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            backgroundColor: p.background.paper,
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            borderTop: 'none !important',
            boxShadow: 'none',
            top: 0,
            margin: 0,
            padding: 0,
            '&::before': {
              display: 'none',
              borderTop: 'none',
            },
            '&::after': {
              display: 'none',
            },
          }
        }
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: '#60A5FA',
          }
        }
      },
      MuiCssBaseline: {
        styleOverrides: {
          a: {
            color: '#60A5FA',
          },
        }
      }
    },
  });

  theme = responsiveFontSizes(theme);
  return theme;
}

const ThemedApp: React.FC = () => {
  const { preferences } = useAccessibility();

  const theme = useMemo(() => buildTheme(preferences.themeMode), [preferences.themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense
        fallback={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              bgcolor: 'background.default'
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <Router
          basename={getBasename()}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/simulator" element={<VisionSimulator />} />
            <Route path="/famous-people" element={<FamousBlindPeople />} />
            <Route path="/conditions" element={<ConditionsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
          </Routes>
        </Router>
      </Suspense>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <ThemedApp />
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};

export default App;