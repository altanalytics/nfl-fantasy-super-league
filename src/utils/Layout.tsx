import { Outlet, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Standings', path: '/standings' },
  { label: 'Schedule', path: '/schedule' },
  { label: 'Live Scoring', path: '/live-scoring' },
];

export default function Layout() {
  const renderNavButton = ({ label, path }: { label: string; path: string }) => (
    <Button
      key={path}
      component={Link}
      to={path}
      sx={{
        fontSize: '1.1rem',
        color: 'white',
        fontWeight: 600,
        '&:hover': {
          color: '#ffcc00',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blacktop Royale
          </Typography>
          {navItems.map(renderNavButton)}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
