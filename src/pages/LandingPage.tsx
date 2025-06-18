import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HeroComponent from '../utils/HeroImg';
import imageHero from '../assets/landingPage.png'; // Adjust the path as necessary
import PageShell from '../utils/Shell';
import Markdown from 'markdown-to-jsx';
import {landingPage} from './landingPageText'; // Adjust the path as necessary

export default function LandingPage() {
  return (
    <PageShell>
        <HeroComponent
            heroText={'The Blacktop Battle Royale!'}
            heroImage={imageHero}
            textGray='yes'
            textOutline='yes'
          />

        
        <Box sx={{ border: '2px solid #ccc',   
                   borderRadius: 2, 
                   mt: { xs: 5 },
                   ml: { xs: 5, md: 30 },
                   mr: { xs: 5, md: 30 },
                   mb: {xs: 5}}} >
        <Container>
    <Markdown>{landingPage}</Markdown>
        <Typography 
            sx={{ mb: {xs: 5}}}
            variant="h5">Conference Score: Minivan Mayhem 0 - Snacktime Bandits 0</Typography>
        </Container>
      </Box>
    
    </PageShell>
  );
}
