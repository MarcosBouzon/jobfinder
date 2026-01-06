import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#004d40',
      light: '#004d4040',
      dark: '#00221c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffa000',
      contrastText: '#ffffff',
    },
    error: {
      main: '#bf360c',
      light: '#fddddd',
      dark: '#b40e0e',
    },
    success: {
      main: '#004d40',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.5)',
          },
          '&:active': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#004d40',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(0, 77, 64, 0.07)',
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#004d40',
          '&.Mui-checked': {
            color: '#004d40',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#004d40',
            '&:hover': {
              backgroundColor: 'rgba(0, 77, 64, 0.08)',
            },
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#004d40',
          },
        },
      },
    },
  },
});

export default theme;
