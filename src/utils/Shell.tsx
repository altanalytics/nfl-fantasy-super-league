import { ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getMPTheme from './getMPTheme';
import Box from '@mui/material/Box';
import AppAppBar from './Layout';
import './shell.css';

interface PageShellProps {
  children: ReactNode;
}

export default function PageShell({ children }: PageShellProps) {

  const MPTheme = createTheme(getMPTheme('light'));



  return (
    <ThemeProvider theme={MPTheme}>
      <CssBaseline enableColorScheme />

      <AppAppBar/>

      <Box
        id="page-shell"
        sx={{
          width: '100%',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          margin: 0,
          paddingTop: '0px', // Add padding equal to AppBar height
        }}
      >
        {children}
      </Box>

    </ThemeProvider>
  );
}
