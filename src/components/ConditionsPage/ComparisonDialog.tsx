import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CompareArrows as CompareArrowsIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import type { ConditionCategory } from '../../data/conditionCategories/types';

type Condition = ConditionCategory['conditions'][number];

interface ComparisonDialogProps {
  open: boolean;
  onClose: () => void;
  selectedConditions: Condition[];
  onNavigateToSimulator: (conditionId: string, conditionName: string) => void;
}

const ComparisonDialog: React.FC<ComparisonDialogProps> = ({
  open,
  onClose,
  selectedConditions,
  onNavigateToSimulator
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompareArrowsIcon />
          Compare Conditions
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, minWidth: 120 }}> </TableCell>
                {selectedConditions.map(condition => (
                  <TableCell key={condition.id} sx={{ fontWeight: 700, minWidth: 200 }}>
                    {condition.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                {selectedConditions.map(condition => (
                  <TableCell key={condition.id}>
                    <Typography variant="body2">{condition.description}</Typography>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Prevalence</TableCell>
                {selectedConditions.map(condition => (
                  <TableCell key={condition.id}>
                    <Typography variant="body2">{condition.prevalence || 'Data not available'}</Typography>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Treatments</TableCell>
                {selectedConditions.map(condition => (
                  <TableCell key={condition.id}>
                    {condition.treatments ? (
                      <List dense disablePadding>
                        {condition.treatments.options.slice(0, 5).map((opt, idx) => (
                          <ListItem key={idx} disablePadding sx={{ py: 0.25 }}>
                            <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>• {opt}</Typography>
                          </ListItem>
                        ))}
                        {condition.treatments.options.length > 5 && (
                          <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontStyle: 'italic', color: 'text.secondary' }}>
                            +{condition.treatments.options.length - 5} more...
                          </Typography>
                        )}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">No treatment data</Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Resources</TableCell>
                {selectedConditions.map(condition => (
                  <TableCell key={condition.id}>
                    {condition.resourceLinks && condition.resourceLinks.length > 0 ? (
                      condition.resourceLinks.map((link, idx) => (
                        <Typography
                          key={idx}
                          component="a"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="body2"
                          display="block"
                          sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, fontSize: '0.8125rem', mb: 0.5 }}
                        >
                          {link.label} ↗
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">No resources</Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Try in Simulator</TableCell>
                {selectedConditions.map(condition => (
                  <TableCell key={condition.id}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => onNavigateToSimulator(condition.id, condition.name)}
                      sx={{ textTransform: 'none' }}
                    >
                      {t('glossaryPage.viewInSimulator')}
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComparisonDialog;
