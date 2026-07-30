import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  defaultColorScheme: 'dark',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#D32F2F',
          contrastText: '#ffffff',
        },
        background: {
          default: '#F4F4F6',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#212121',
          secondary: '#757575',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#D33939',
          contrastText: '#ffffff',
        },
        background: {
          default: '#303030',
          paper: '#3A3A3A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
        },
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: 'var(--mui-palette-background-paper)',
        },
      },
    },
  },
});

export default theme;
