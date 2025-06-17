import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import HeroComponent from '../utils/HeroImg';
import imageHero from '../assets/landingPage.png'; // Adjust the path as necessary
import PageShell from '../utils/Shell';
import Markdown from 'markdown-to-jsx';
import {liveScoring} from './liveScoringText'; // Adjust the path as necessary


const teams = ['Team Alpha', 'Team Bravo', 'Team Chaos', 'Team Dynasty'];

export default function LiveScoring() {
  const [selectedTeam, setSelectedTeam] = useState('All');

  return (
    <PageShell>
        <HeroComponent
            heroText={'The Driveway Dynasty!!'}
            heroImage={imageHero}
            textOutline='yes'
          />
    <Container>
        <Markdown>{liveScoring}</Markdown>
      <Box mt={4}>
        
        <Typography variant="h3" gutterBottom>Live Scoring</Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="team-select-label">Filter by Team</InputLabel>
          <Select
            labelId="team-select-label"
            id="team-select"
            value={selectedTeam}
            label="Filter by Team"
            onChange={e => setSelectedTeam(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            {teams.map(team => (
              <MenuItem key={team} value={team}>{team}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={3}>
          <Typography>[Placeholder for live matchups filtered by {selectedTeam}]</Typography>
        </Box>
      </Box>
    </Container>
    </PageShell>
  );
}