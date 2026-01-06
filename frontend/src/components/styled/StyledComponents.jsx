import { styled } from '@mui/material/styles';
import {
  Box,
  Paper,
  AppBar,
  Toolbar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';

// Navigation Components
export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  backgroundColor: theme.palette.primary.main,
  zIndex: 100,
}));

export const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 2rem',
});

export const NavTitle = styled('h1')(({ theme }) => ({
  margin: 0,
  color: theme.palette.primary.contrastText,
}));

// Table Components
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  margin: '2rem auto',
  width: '80%',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const StyledTable = styled(Table)({
  borderCollapse: 'collapse',
});

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableRow-root': {
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiTableCell-head': {
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    padding: '0.75rem 1rem',
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.primary.light}`,
  },
}));

export const ActionIcon = styled('span')(({ theme }) => ({
  margin: '0 0.25rem',
  padding: '0.25rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

// Form Components
export const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  margin: '2rem 0',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StyledForm = styled('form')(({ theme }) => ({
  width: '40%',
  minWidth: '600px',
  padding: '5rem',
  border: `10px solid ${theme.palette.primary.main}`,
  borderRadius: '5rem',
  boxShadow: '2px 4px 10px 2px rgba(0, 34, 28, 0.56)',
}));

export const FormControlGroup = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '1rem 0',
  justifyContent: 'center',
  alignItems: 'center',
});

export const FormActions = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  margin: '5rem 0 0 0',
  justifyContent: 'flex-end',
  gap: '1rem',
});

export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& input::placeholder': {
    fontStyle: 'italic',
    fontSize: '0.8rem',
  },
}));

// Search Form
export const SearchForm = styled('form')(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
  padding: '2rem',
  justifyContent: 'center',
  alignItems: 'flex-end',
}));

// Notification Components
export const NotificationContainer = styled(Box)({
  position: 'fixed',
  bottom: '1rem',
  left: 0,
  zIndex: 200,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
});

export const NotificationPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'visible',
})(({ theme, visible }) => ({
  display: 'flex',
  width: '25rem',
  position: 'relative',
  left: visible ? '0' : '-100%',
  transition: 'left 0.3s ease-out',
  boxShadow: '1px 3px 4px rgba(0, 37, 30, 0.54)',
  overflow: 'hidden',
}));

export const NotificationSidebar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})(({ theme, variant }) => {
  const colors = {
    success: theme.palette.success.main,
    warning: theme.palette.secondary.main,
    error: theme.palette.error.main,
  };

  return {
    display: 'flex',
    width: '10%',
    color: theme.palette.primary.contrastText,
    backgroundColor: colors[variant] || colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  };
});

export const NotificationContent = styled(Box)({
  position: 'relative',
  width: '90%',
  padding: '0.5rem 1rem',
  '& h5': {
    margin: '0.5rem 0 0 0',
  },
  '& p': {
    margin: '0.5rem 0',
    fontSize: '14px',
  },
});

// Spinner
export const SpinnerContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  padding: '2rem',
  justifyContent: 'center',
});

// Tooltip
export const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 11,
  },
}));

// Settings Components
export const SettingControl = styled(Box)({
  display: 'flex',
  width: '100%',
  padding: '1rem',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const GroupLabel = styled('h4')(({ theme }) => ({
  width: '100%',
  margin: '1rem 0',
  color: theme.palette.text.primary,
}));

// Stepper Components
export const StepperContainer = styled(Box)({
  padding: '2rem',
  width: '100%',
});

export const StepContentPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '2rem 0',
  padding: '2rem',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.66), 0px 8px 10px 1px rgba(0, 0, 0, 0.12), 0px 3px 14px 2px rgba(0, 0, 0, 0.15)',
}));

export const StepImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
});

export const IconImage = styled('img')({
  width: '2rem',
  height: 'auto',
});

export const CookieInput = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '1rem 0',
}));

export const StepFooter = styled(Box)({
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-end',
  marginTop: '1rem',
});
