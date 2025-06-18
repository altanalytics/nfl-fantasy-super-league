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
      <Box mt={4}>
<Container>
    <Markdown>{landingPage}</Markdown>
        <Typography variant="h5">Conference Score: Minivan Mayhem 0 - Snacktime Bandits 0</Typography>
        </Container>
      </Box>
      <br />
      <br />
    </PageShell>
  );
}
