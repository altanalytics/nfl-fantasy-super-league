import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HeroComponent from '../utils/HeroImg';
import imageHero from '../assets/landingPage.png'; // Adjust the path as necessary
import PageShell from '../utils/Shell';
import Markdown from 'markdown-to-jsx';
import {leagueInfo} from './leagueInfotext'; // Adjust the path as necessary

export default function LeagueInfo() {
  return (
        <PageShell>
        <HeroComponent
            heroText={'The Driveway Dynasty!!'}
            heroImage={imageHero}
            textOutline='yes'
          />
    <Container>
       <Markdown>{leagueInfo}</Markdown>
      <Box mt={4}>
       
        <Typography variant="h3" gutterBottom>League Information</Typography>

        <Box mt={2}>
          <Typography variant="h5">Teams</Typography>
          <Typography>[Placeholder for team list]</Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="h5">Schedule</Typography>
          <Typography>[Placeholder for schedule]</Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="h5">Standings</Typography>
          <Typography>[Placeholder for standings]</Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="h5">Results</Typography>
          <Typography>[Placeholder for results]</Typography>
        </Box>
      </Box>
    </Container>
    </PageShell>
  );
}