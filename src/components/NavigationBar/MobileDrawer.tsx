import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: Array<{ label: string; path: string }>;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  open,
  onClose,
  navItems,
  currentPath,
  onNavigate
}) => {
  const { t } = useTranslation();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      aria-label={t('nav.mobileNavigation')}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 'min(280px, 75vw)',
          backgroundColor: 'var(--color-drawer-bg)',
          color: 'white',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          pt: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        role="presentation"
      >
        <Box sx={{ flex: 1 }}>
          <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'white',
                fontSize: '1.25rem',
              }}
            >
              {t('nav.navigation')}
            </Typography>
            <IconButton
              onClick={onClose}
              aria-label={t('nav.closeMenu', 'Close menu')}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
          <List>
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      onNavigate(item.path);
                      onClose();
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      backgroundColor: isActive ? 'rgba(96, 165, 250, 0.15)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(96, 165, 250, 0.1)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#60a5fa' : 'white',
                        fontSize: '1rem',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* GitHub Link at Bottom */}
        <Box sx={{ mt: 'auto', pb: { xs: 10, sm: 2 } }}>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mb: 2 }} />
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href="https://github.com/bloo-berries/blindness-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                py: 1.5,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(96, 165, 250, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <GitHubIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('nav.viewOnGithub')}
                primaryTypographyProps={{
                  color: 'white',
                  fontSize: '1rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;
