import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Standings', path: '/standings' },
  { label: 'Schedule', path: '/schedule' },
 // { label: 'Live Scoring', path: '/live-scoring' },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Blacktop Royale
      </Typography>
      <List>
        {navItems.map(({ label, path }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton component={Link} to={path}>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blacktop Royale
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            navItems.map(({ label, path }) => (
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
            ))
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
