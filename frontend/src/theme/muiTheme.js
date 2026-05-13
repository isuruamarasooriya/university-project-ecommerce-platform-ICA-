import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary:   { main: '#5B2EFF', light: '#7C4DFF', dark: '#3D00D6' },
    secondary: { main: '#7C4DFF', light: '#9C6FFF', dark: '#5B00D6' },
    background:{ default: '#F8FAFC', paper: '#FFFFFF' },
    text:      { primary: '#1E293B', secondary: '#64748B' },
    success:   { main: '#10B981' },
    error:     { main: '#EF4444' },
    warning:   { main: '#F59E0B' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '9999px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #5B2EFF 0%, #00C6FF 100%)',
          boxShadow: '0 4px 20px rgba(91,46,255,0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4420CC 0%, #00A8DB 100%)',
            boxShadow: '0 6px 24px rgba(91,46,255,0.45)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

export default theme;
