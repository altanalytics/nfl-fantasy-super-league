import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import HeroComponent from '../utils/HeroImg';
import imageHero from '../assets/standings_img.png';
import PageShell from '../utils/Shell';
import Markdown from 'markdown-to-jsx';
import { standings } from './standingsText'; 

export default function Standings() {
  const [league1, setLeague1] = useState([]);
  const [league2, setLeague2] = useState([]);

  useEffect(() => {
    const fetchLeague = async (id: string, setter: Function) => {
      const res = await fetch(`https://3ad3q1gz0c.execute-api.us-east-1.amazonaws.com/prod/teams?league=${id}`);
      const data = await res.json();

      const cleaned = data.map((team: any) => ({
        ...team,
        in_wins: parseInt(team.in_wins || '0'),
        total_points: parseInt(team.total_points || '0'),
      }));

      const sorted = cleaned.sort((a, b) =>
        b.in_wins - a.in_wins || b.total_points - a.total_points
      );

      setter(sorted);
    };
    fetchLeague('1', setLeague2);
    fetchLeague('2', setLeague1);

  }, []);

  return (
    <PageShell>
      <HeroComponent
        heroText="Where do you Rank?"
        heroImage={imageHero}
        textGray='yes'
        textOutline="yes"
      />

      <Box mt={4}>
        <Container>
          <Markdown>{standings}</Markdown>
          <Typography variant="h5" gutterBottom>
            Conference Score: Minivan Mayhem 0 - Snacktime Bandits 0
          </Typography>

          <Grid container spacing={4}>
             <Grid size={{ xs: 12, md: 6 }}>

              <Typography variant="h6" gutterBottom>Minivan Mayhem</Typography>
              {league1.map((team: any, idx: number) => (
                <Box key={idx} mb={1}>
                  <Typography>
                    {team.team_name} - {team.team_nickname} ({team.in_wins} wins, {team.total_points} pts)
                  </Typography>
                </Box>
              ))}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>Snacktime Bandits</Typography>
              {league2.map((team: any, idx: number) => (
                <Box key={idx} mb={1}>
                  <Typography>
                    {team.team_name} - {team.team_nickname} ({team.in_wins} wins, {team.total_points} pts)
                  </Typography>
                </Box>
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PageShell>
  );
}
