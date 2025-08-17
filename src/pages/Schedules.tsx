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
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { get } from 'aws-amplify/api';
import outputs from "../../amplify_outputs.json";

export default function LeagueInfo() {
  const [teams, setTeams] = useState([]);
  const [teamMap, setTeamMap] = useState({});
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  //const [selectedWeek, setSelectedWeek] = useState('1');
  const [selectedGameType, setSelectedGameType] = useState('blacktop');
  const [scheduleData, setScheduleData] = useState([]);
  const [expandedGames, setExpandedGames] = useState<Record<string, boolean>>({});

  const getDefaultWeek = () => {
    const today = new Date();
    const seasonStart = new Date(today.getFullYear(), 8, 9); // September is month 8 (0-based index)
    const diffInMs = today.getTime() - seasonStart.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const week = diffInDays < 0 ? 1 : Math.min(12, 1 + Math.floor(diffInDays / 7));
    return week.toString();
  };

const [selectedWeek, setSelectedWeek] = useState(getDefaultWeek());

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const restOperation = get({
          apiName: Object.keys(outputs.custom?.API || {})[0],
          path: '/teams'
        });
        const response = await restOperation.response;
        const data = await response.body.json() as any[];
        setTeams(data);
        const map: Record<string, string> = {};
        data.forEach((team: any) => {
          map[team.team_name] = team.team_number;
        });
        setTeamMap(map);
      } catch (error) {
        console.error('Error fetching teams:', error);
        // Fallback to hardcoded URL if API not configured yet
        const res = await fetch('https://3ad3q1gz0c.execute-api.us-east-1.amazonaws.com/prod/teams');
        const data = await res.json();
        setTeams(data);
        const map: Record<string, string> = {};
        data.forEach((team: any) => {
          map[team.team_name] = team.team_number;
        });
        setTeamMap(map);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      const params = new URLSearchParams();
      params.append('week', selectedWeek);
      if (selectedTeam !== 'ALL') params.append('team', selectedTeam);
      if (selectedGameType !== 'all') params.append('game_type', selectedGameType);

      try {
        const restOperation = get({
          apiName: Object.keys(outputs.custom?.API || {})[0],
          path: `/schedule?${params}`
        });
        const response = await restOperation.response;
        const data = await response.body.json() as any[];
        setScheduleData(data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        // Fallback to hardcoded URL if API not configured yet
        const res = await fetch(`https://3ad3q1gz0c.execute-api.us-east-1.amazonaws.com/prod/schedule?${params}`);
        const data = await res.json();
        setScheduleData(data);
      }
    };

    fetchSchedule();
  }, [selectedTeam, selectedWeek, selectedGameType]);

  const toggleGameExpand = (gameId: string) => {
    setExpandedGames(prev => ({ ...prev, [gameId]: !prev[gameId] }));
  };

  const renderGame = (group: any[], idx: number) => {
    if (!group.length) return null;
    const { game_id, home_team, away_team } = group[0];
    const isExpanded = expandedGames[game_id] || false;
    const totalRow = group.find(g => g.home_player === 'TOTAL');
    const detailRows = group.filter(g => g.home_player !== 'TOTAL');

    return (
      <Box key={idx} mb={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{home_team} vs. {away_team}</Typography>
          <IconButton onClick={() => toggleGameExpand(game_id)}>
            <ExpandMoreIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }} />
          </IconButton>
        </Box>
        <Box>
          <Typography variant="body2"><strong>Total:</strong> {parseFloat(totalRow?.home_actual).toFixed(1)} - {parseFloat(totalRow?.away_actual).toFixed(1)} (Projected: {parseFloat(totalRow?.home_projected).toFixed(1)} - {parseFloat(totalRow?.away_projected).toFixed(1)})</Typography>
        </Box>
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box mt={1}>
            <Box display="flex" fontWeight="bold" px={1} py={0.5} borderBottom={1}>
            <Box flex={3}>Home Player</Box>
            <Box flex={2}>H. Proj</Box>
            <Box flex={2}>H. Actual</Box>
            <Box flex={3}>Away Player</Box>
            <Box flex={2}>A. Proj</Box>
            <Box flex={2}>A. Actual</Box>
          </Box>

          {detailRows.map((row, i) => {
            const slot = parseInt(row.unique_slot);
            const prevSlot = i > 0 ? parseInt(detailRows[i - 1].unique_slot) : null;
            const isBench = slot >= 10;

            return (
              <Box key={i}>
                {i > 0 && slot >= 10 && prevSlot < 10 && (
                  <Divider sx={{ my: 1, borderColor: 'grey.700', borderBottomWidth: 2 }} />
                )}
                <Box
                  display="flex"
                  px={1}
                  py={0.5}
                  sx={{
                    backgroundColor: isBench ? 'grey.100' : 'transparent',
                  }}
                >
                  <Box flex={3}>{row.home_player}</Box>
                  <Box flex={2}>{parseFloat(row.home_projected).toFixed(1)}</Box>
                  <Box flex={2}>{parseFloat(row.home_actual).toFixed(1)}</Box>
                  <Box flex={3}>{row.away_player}</Box>
                  <Box flex={2}>{parseFloat(row.away_projected).toFixed(1)}</Box>
                  <Box flex={2}>{parseFloat(row.away_actual).toFixed(1)}</Box>
                </Box>
              </Box>
            );
          })}
          </Box>
        </Collapse>
        <Divider sx={{ mt: 2 }} />
      </Box>
    );
  };

  const groupedByGameId = scheduleData.reduce((acc: Record<string, any[]>, row: any) => {
    if (row.separator) return acc;
    if (!acc[row.game_id]) acc[row.game_id] = [];
    acc[row.game_id].push(row);
    return acc;
  }, {});

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
                  {[...Array(12)].map((_, i) => (
                    <MenuItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>View</InputLabel>
                <Select
                  value={selectedGameType}
                  onChange={(e) => setSelectedGameType(e.target.value)}
                  label="View"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="espn">ESPN</MenuItem>
                  <MenuItem value="blacktop">Blacktop</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box mt={4}>
            <Typography variant="h6">Schedule Results</Typography>
            {Object.values(groupedByGameId).length === 0 ? (
              <Typography>No games found.</Typography>
            ) : (
              Object.values(groupedByGameId).map((group: any, idx: number) => renderGame(group, idx))
            )}
          </Box>
        </Box>
      </Container>
    </PageShell>
  );
}