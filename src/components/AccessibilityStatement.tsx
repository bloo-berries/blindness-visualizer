import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

interface AccessibilityStatementProps {
  open: boolean;
  onClose: () => void;
}

const AccessibilityStatement: React.FC<AccessibilityStatementProps> = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      aria-labelledby="accessibility-title"
    >
      <DialogTitle id="accessibility-title">Accessibility Statement</DialogTitle>
      <DialogContent>
        <Typography paragraph>
          We are committed to ensuring digital accessibility for people with disabilities. We are continually
          improving the user experience for everyone, and applying the relevant accessibility standards.
        </Typography>
        
        <Typography variant="h6">Conformance status</Typography>
        <Typography paragraph>
          This website is designed to be compatible with WCAG 2.1 AA standards.
        </Typography>
        
        <Typography variant="h6">Accessibility features</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Keyboard Navigation" secondary="All interactive elements can be accessed using a keyboard" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Screen Reader Support" secondary="All content and controls are properly labeled for screen readers" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Text Descriptions" secondary="Visual simulations include text descriptions of the effects" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Skip to Content" secondary="Skip navigation link is available" />
          </ListItem>
        </List>
        
        <Typography variant="h6">Feedback</Typography>
        <Typography paragraph>
          We welcome your feedback on the accessibility of this website. Please let us know if you encounter 
          accessibility barriers:
        </Typography>
        <Typography>
          E-mail: accessibility@example.com
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccessibilityStatement; 