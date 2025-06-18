import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HeroComponent from '../utils/HeroImg';
import imageHero from '../assets/schedule_img.png';
import PageShell from '../utils/Shell';
import Markdown from 'markdown-to-jsx';
import { schedule } from './schedulesText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';

export default function LeagueInfo() {
  const [teams, setTeams] = useState([]);
  const [teamMap, setTeamMap] = useState({});
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  const [selectedWeek, setSelectedWeek] = useState('ALL');
  const [scheduleData, setScheduleData] = useState([]);

  // Fetch all teams
  useEffect(() => {
    const fetchTeams = async () => {
      const res = await fetch('https://3ad3q1gz0c.execute-api.us-east-1.amazonaws.com/prod/teams');
      const data = await res.json();
      setTeams(data);
      const map = {};
      data.forEach((team: any) => {
        map[team.team_name] = team.team_number;
      });
      setTeamMap(map);
    };

    fetchTeams();
  }, []);

  // Fetch schedule whenever filters change
  useEffect(() => {
    const fetchSchedule = async () => {
      const params = new URLSearchParams();
      if (selectedTeam !== 'ALL') {
        params.append('team', selectedTeam);
      }
      if (selectedWeek !== 'ALL') {
        params.append('week', selectedWeek);
      }

      const res = await fetch(`https://3ad3q1gz0c.execute-api.us-east-1.amazonaws.com/prod/schedule?${params}`);
      const data = await res.json();
      setScheduleData(data);
    };

    fetchSchedule();
  }, [selectedTeam, selectedWeek]);

  return (
    <PageShell>
      <HeroComponent
        heroText={'The Battles'}
        heroImage={imageHero}
        textGray="yes"
        textOutline="yes"
      />
      <Container>
        <Markdown>{schedule}</Markdown>

        <Box mt={4}>
          <Grid container spacing={2}>
             <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Team</InputLabel>
                <Select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  label="Team"
                >
                  <MenuItem value="ALL">All</MenuItem>
                  {teams.map((team: any) => (
                    <MenuItem key={team.team_number} value={team.team_number}>
                      {team.team_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Week</InputLabel>
                <Select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  label="Week"
                >
                  <MenuItem value="ALL">All</MenuItem>
                  {[...Array(12)].map((_, i) => (
                    <MenuItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box mt={4}>
            <Typography variant="h6">Schedule Results</Typography>
            {scheduleData.length === 0 ? (
              <Typography>No games found.</Typography>
            ) : (
              scheduleData.map((game: any, idx: number) => (
                <Box key={idx} mb={2}>
                  <Typography>
                    <strong>Week {game.week}:</strong> {game.home_team} vs. {game.away_team}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Container>
    </PageShell>
  );
}
