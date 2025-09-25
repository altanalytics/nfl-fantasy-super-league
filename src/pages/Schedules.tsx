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
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { get } from 'aws-amplify/api';
import { getUserTeamNumbers, getAuthorizedEmail } from '../utils/userTeams';
import outputs from "../../amplify_outputs.json";

const getPositionColor = (position: string) => {
  const colors: Record<string, string> = {
    'QB': '#e0e7ff',
    'RB': '#fce7f3', 
    'WR': '#e0f2fe',
    'TE': '#dcfce7',
    'K': '#fef3c7',
    'DST': '#f0fdfa',
    'FLEX': '#fef7ed'
  };
  return colors[position] || '#f8fafc';
};

const getPositionTextColor = (position: string) => {
  const colors: Record<string, string> = {
    'QB': '#3730a3',
    'RB': '#be185d', 
    'WR': '#0369a1',
    'TE': '#166534',
    'K': '#92400e',
    'DST': '#065f46',
    'FLEX': '#c2410c'
  };
  return colors[position] || '#475569';
};

const getNFLTeamColors = (team: string) => {
  const teamColors: Record<string, { background: string; text: string }> = {
    'ARI': { background: '#fecaca', text: '#991b1b' },
    'ATL': { background: '#fecaca', text: '#991b1b' },
    'BAL': { background: '#e0e7ff', text: '#3730a3' },
    'BUF': { background: '#dbeafe', text: '#1d4ed8' },
    'CAR': { background: '#e0f2fe', text: '#0369a1' },
    'CHI': { background: '#f1f5f9', text: '#334155' },
    'CIN': { background: '#fed7aa', text: '#c2410c' },
    'CLE': { background: '#fed7aa', text: '#c2410c' },
    'DAL': { background: '#dbeafe', text: '#1d4ed8' },
    'DEN': { background: '#fed7aa', text: '#c2410c' },
    'DET': { background: '#dbeafe', text: '#1d4ed8' },
    'GB': { background: '#dcfce7', text: '#166534' },
    'HOU': { background: '#f1f5f9', text: '#334155' },
    'IND': { background: '#dbeafe', text: '#1d4ed8' },
    'JAX': { background: '#fef3c7', text: '#92400e' },
    'KC': { background: '#fecaca', text: '#991b1b' },
    'LV': { background: '#f1f5f9', text: '#334155' },
    'LAC': { background: '#dbeafe', text: '#1d4ed8' },
    'LAR': { background: '#dbeafe', text: '#1d4ed8' },
    'MIA': { background: '#e0f2fe', text: '#0369a1' },
    'MIN': { background: '#e0e7ff', text: '#3730a3' },
    'NE': { background: '#dbeafe', text: '#1d4ed8' },
    'NO': { background: '#fef3c7', text: '#92400e' },
    'NYG': { background: '#dbeafe', text: '#1d4ed8' },
    'NYJ': { background: '#dcfce7', text: '#166534' },
    'PHI': { background: '#dcfce7', text: '#166534' },
    'PIT': { background: '#fef3c7', text: '#92400e' },
    'SF': { background: '#fecaca', text: '#991b1b' },
    'SEA': { background: '#dcfce7', text: '#166534' },
    'TB': { background: '#fecaca', text: '#991b1b' },
    'TEN': { background: '#dbeafe', text: '#1d4ed8' },
    'WAS': { background: '#fecaca', text: '#991b1b' }
  };
  return teamColors[team] || { background: '#f8fafc', text: '#64748b' };
};

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  borderRadius: '20px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)',
  border: '1px solid rgba(0,0,0,0.06)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
  }
}));

const PlayerRow = styled(Box)(({ theme, isBench }: { theme?: any; isBench: boolean }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  margin: '4px 0',
  borderRadius: '12px',
  background: isBench 
    ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: isBench
      ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
  }
}));

export default function LeagueInfo() {
  const [teams, setTeams] = useState([]);
  const [teamMap, setTeamMap] = useState({});
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  //const [selectedWeek, setSelectedWeek] = useState('1');
  const [selectedGameType, setSelectedGameType] = useState('all');
  const [scheduleData, setScheduleData] = useState([]);
  const [expandedGames, setExpandedGames] = useState<Record<string, boolean>>({});

  const getDefaultWeek = () => {
    const today = new Date();
    const seasonStart = new Date(today.getFullYear(), 8, 4); // September is month 8 (0-based index)
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
          apiName: 'nfl-fantasy-api',
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

        // Set default team based on authorized email
        const authorizedEmail = getAuthorizedEmail();
        if (authorizedEmail) {
          const userTeamNumbers = getUserTeamNumbers(data, authorizedEmail);
          if (userTeamNumbers.length > 0) {
            setSelectedTeam(userTeamNumbers[0]); // Default to first team if multiple
          }
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
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
          apiName: 'nfl-fantasy-api',
          path: `/schedule?${params}`
        });
        const response = await restOperation.response;
        const data = await response.body.json() as any[];
        setScheduleData(data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
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

    const homeTotal = parseFloat(totalRow?.home_actual || '0');
    const awayTotal = parseFloat(totalRow?.away_actual || '0');
    const homeWinning = homeTotal > awayTotal;
    const homeProjTotal = parseFloat(totalRow?.home_projected || '0');
    const awayProjTotal = parseFloat(totalRow?.away_projected || '0');

    return (
      <StyledCard key={idx} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header Section */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center" gap={3}>
                <SportsFootballIcon sx={{ color: '#667eea', fontSize: 28 }} />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.5px'
                  }}
                >
                  {home_team} vs. {away_team}
                </Typography>
              </Box>
              <IconButton 
                onClick={() => toggleGameExpand(game_id)}
                sx={{ 
                  background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  width: 48,
                  height: 48,
                  '&:hover': { 
                    background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ExpandMoreIcon sx={{ 
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', 
                  transition: '0.4s ease',
                  fontSize: 28
                }} />
              </IconButton>
            </Box>
            
            {/* Score Display */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" gap={4}>
                <Box textAlign="center">
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: homeWinning ? '#059669' : '#1e293b',
                      textShadow: homeWinning ? '0 0 20px rgba(74, 222, 128, 0.5)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {homeTotal.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                    {home_team}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  width: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)'
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    VS
                  </Typography>
                </Box>
                
                <Box textAlign="center">
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: !homeWinning ? '#059669' : '#1e293b',
                      textShadow: !homeWinning ? '0 0 20px rgba(74, 222, 128, 0.5)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {awayTotal.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                    {away_team}
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" justifyContent="center" gap={4} mt={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Projected: {homeProjTotal.toFixed(1)} - {awayProjTotal.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>

          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ px: 3, pb: 3 }}>
              {/* Desktop Header Row */}
              <Box 
                display="flex" 
                alignItems="center"
                px={2}
                py={2}
                sx={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  borderRadius: '12px',
                  mb: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                {/* Home Team Headers */}
                <Box flex={1} sx={{ color: '#1e293b', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>POS</Box>
                <Box flex={1} sx={{ color: '#1e293b', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>TEAM</Box>
                <Box flex={3} sx={{ color: '#1e293b', fontWeight: 'bold', fontSize: '0.9rem' }}>HOME PLAYER</Box>
                <Box flex={1.5} sx={{ color: '#1e293b', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>PROJ</Box>
                <Box flex={1.5} sx={{ color: '#1e293b', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>ACTUAL</Box>
                
                {/* Away Team Headers */}
                <Box flex={1} sx={{ color: '#1e293b', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>POS</Box>
                <Box flex={1} sx={{ color: '#1e293b', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>TEAM</Box>
                <Box flex={3} sx={{ color: '#1e293b', fontWeight: 'bold', fontSize: '0.9rem' }}>AWAY PLAYER</Box>
                <Box flex={1.5} sx={{ color: '#1e293b', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>PROJ</Box>
                <Box flex={1.5} sx={{ color: '#1e293b', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>ACTUAL</Box>
              </Box>

              {/* Mobile Header */}
              <Box 
                sx={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  borderRadius: '12px',
                  mb: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: { xs: 'block', sm: 'none' },
                  p: 2
                }}
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" sx={{ 
                      color: '#1e293b', 
                      fontWeight: 'bold', 
                      fontSize: '0.8rem',
                      textAlign: 'center'
                    }}>
                      HOME PLAYER
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" sx={{ 
                      color: '#1e293b', 
                      fontWeight: 'bold', 
                      fontSize: '0.8rem',
                      textAlign: 'center'
                    }}>
                      AWAY PLAYER
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {detailRows.map((row, i) => {
                const slot = parseInt(row.unique_slot);
                const prevSlot = i > 0 ? parseInt(detailRows[i - 1].unique_slot) : null;
                const isBench = slot >= 10;
                const homeActual = parseFloat(row.home_actual);
                const awayActual = parseFloat(row.away_actual);
                const homeProj = parseFloat(row.home_projected);
                const awayProj = parseFloat(row.away_projected);

                return (
                  <Box key={i}>
                    {i > 0 && slot >= 10 && prevSlot < 10 && (
                      <Box sx={{ my: 3, textAlign: 'center' }}>
                        <Chip 
                          label="BENCH PLAYERS" 
                          sx={{ 
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            px: 2,
                            py: 1
                          }} 
                        />
                      </Box>
                    )}
                    {/* Desktop Layout - Full Table with Chips */}
                    <PlayerRow isBench={isBench} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                      {/* Home Team */}
                      <Box flex={1} display="flex" justifyContent="center">
                        <Chip 
                          label={row.home_position || 'N/A'} 
                          size="small"
                          sx={{
                            background: getPositionColor(row.home_position),
                            color: getPositionTextColor(row.home_position),
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            border: 'none'
                          }}
                        />
                      </Box>
                      <Box flex={1} display="flex" justifyContent="center">
                        <Chip 
                          label={row.home_pro_team || 'N/A'} 
                          size="small"
                          sx={{
                            backgroundColor: getNFLTeamColors(row.home_pro_team).background,
                            color: getNFLTeamColors(row.home_pro_team).text,
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            minWidth: '40px',
                            border: `1px solid ${getNFLTeamColors(row.home_pro_team).text}`
                          }}
                        />
                      </Box>
                      <Box flex={3} sx={{ color: '#1e293b', fontWeight: '500' }}>{row.home_player}</Box>
                      <Box flex={1.5} sx={{ color: '#64748b', textAlign: 'center' }}>{homeProj.toFixed(1)}</Box>
                      <Box flex={1.5} sx={{ 
                        fontWeight: 'bold', 
                        textAlign: 'center',
                        color: homeActual > homeProj ? '#059669' : homeActual < homeProj ? '#dc2626' : '#1e293b'
                      }}>
                        {homeActual.toFixed(1)}
                        {homeActual > homeProj && <TrendingUpIcon sx={{ fontSize: 16, ml: 0.5, color: '#059669' }} />}
                        {homeActual < homeProj && <TrendingDownIcon sx={{ fontSize: 16, ml: 0.5, color: '#dc2626' }} />}
                      </Box>
                      
                      {/* Away Team */}
                      <Box flex={1} display="flex" justifyContent="center">
                        <Chip 
                          label={row.away_position || 'N/A'} 
                          size="small"
                          sx={{
                            background: getPositionColor(row.away_position),
                            color: getPositionTextColor(row.away_position),
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            border: 'none'
                          }}
                        />
                      </Box>
                      <Box flex={1} display="flex" justifyContent="center">
                        <Chip 
                          label={row.away_pro_team || 'N/A'} 
                          size="small"
                          sx={{
                            backgroundColor: getNFLTeamColors(row.away_pro_team).background,
                            color: getNFLTeamColors(row.away_pro_team).text,
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            minWidth: '40px',
                            border: `1px solid ${getNFLTeamColors(row.away_pro_team).text}`
                          }}
                        />
                      </Box>
                      <Box flex={3} sx={{ color: '#1e293b', fontWeight: '500' }}>{row.away_player}</Box>
                      <Box flex={1.5} sx={{ color: '#64748b', textAlign: 'center' }}>{awayProj.toFixed(1)}</Box>
                      <Box flex={1.5} sx={{ 
                        fontWeight: 'bold', 
                        textAlign: 'center',
                        color: awayActual > awayProj ? '#059669' : awayActual < awayProj ? '#dc2626' : '#1e293b'
                      }}>
                        {awayActual.toFixed(1)}
                        {awayActual > awayProj && <TrendingUpIcon sx={{ fontSize: 16, ml: 0.5, color: '#059669' }} />}
                        {awayActual < awayProj && <TrendingDownIcon sx={{ fontSize: 16, ml: 0.5, color: '#dc2626' }} />}
                      </Box>
                    </PlayerRow>

                    {/* Mobile Layout - Clean Text Format */}
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                      <PlayerRow isBench={isBench} sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2 }}>
                        <Grid container spacing={2}>
                          {/* Home Player */}
                          <Grid size={{ xs: 6 }}>
                            <Box>
                              <Typography variant="body2" sx={{ 
                                color: '#1e293b', 
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                mb: 0.5
                              }}>
                                {row.home_player}
                              </Typography>
                              <Box display="flex" gap={2} mb={0.5}>
                                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                                  {homeProj.toFixed(1)}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  fontWeight: 'bold',
                                  fontSize: '0.8rem',
                                  color: homeActual > homeProj ? '#059669' : homeActual < homeProj ? '#dc2626' : '#1e293b'
                                }}>
                                  {homeActual.toFixed(1)}
                                  {homeActual > homeProj && <TrendingUpIcon sx={{ fontSize: 12, ml: 0.5, color: '#059669' }} />}
                                  {homeActual < homeProj && <TrendingDownIcon sx={{ fontSize: 12, ml: 0.5, color: '#dc2626' }} />}
                                </Typography>
                              </Box>
                              <Box display="flex" gap={0.5} alignItems="center">
                                <Chip 
                                  label={row.home_position || 'N/A'} 
                                  size="small"
                                  sx={{
                                    background: getPositionColor(row.home_position),
                                    color: getPositionTextColor(row.home_position),
                                    fontWeight: 'bold',
                                    fontSize: '0.65rem',
                                    height: '18px',
                                    border: 'none'
                                  }}
                                />
                                <Chip 
                                  label={row.home_pro_team || 'N/A'} 
                                  size="small"
                                  sx={{
                                    backgroundColor: getNFLTeamColors(row.home_pro_team).background,
                                    color: getNFLTeamColors(row.home_pro_team).text,
                                    fontWeight: 'bold',
                                    fontSize: '0.65rem',
                                    height: '18px',
                                    minWidth: '32px',
                                    border: `1px solid ${getNFLTeamColors(row.home_pro_team).text}`
                                  }}
                                />
                              </Box>
                            </Box>
                          </Grid>

                          {/* Away Player */}
                          <Grid size={{ xs: 6 }}>
                            <Box>
                              <Typography variant="body2" sx={{ 
                                color: '#1e293b', 
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                mb: 0.5
                              }}>
                                {row.away_player}
                              </Typography>
                              <Box display="flex" gap={2} mb={0.5}>
                                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                                  {awayProj.toFixed(1)}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  fontWeight: 'bold',
                                  fontSize: '0.8rem',
                                  color: awayActual > awayProj ? '#059669' : awayActual < awayProj ? '#dc2626' : '#1e293b'
                                }}>
                                  {awayActual.toFixed(1)}
                                  {awayActual > awayProj && <TrendingUpIcon sx={{ fontSize: 12, ml: 0.5, color: '#059669' }} />}
                                  {awayActual < awayProj && <TrendingDownIcon sx={{ fontSize: 12, ml: 0.5, color: '#dc2626' }} />}
                                </Typography>
                              </Box>
                              <Box display="flex" gap={0.5} alignItems="center">
                                <Chip 
                                  label={row.away_position || 'N/A'} 
                                  size="small"
                                  sx={{
                                    background: getPositionColor(row.away_position),
                                    color: getPositionTextColor(row.away_position),
                                    fontWeight: 'bold',
                                    fontSize: '0.65rem',
                                    height: '18px',
                                    border: 'none'
                                  }}
                                />
                                <Chip 
                                  label={row.away_pro_team || 'N/A'} 
                                  size="small"
                                  sx={{
                                    backgroundColor: getNFLTeamColors(row.away_pro_team).background,
                                    color: getNFLTeamColors(row.away_pro_team).text,
                                    fontWeight: 'bold',
                                    fontSize: '0.65rem',
                                    height: '18px',
                                    minWidth: '32px',
                                    border: `1px solid ${getNFLTeamColors(row.away_pro_team).text}`
                                  }}
                                />
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </PlayerRow>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </CardContent>
      </StyledCard>
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
      <Box sx={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        minHeight: '100vh',
        pt: 4
      }}>
        <Container>
          <StyledCard sx={{ 
            p: 4,
            mb: 4,
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              color: '#1e293b',
              fontWeight: 'bold',
              mb: 2
            },
            '& p': {
              color: '#475569',
              lineHeight: 1.6,
              mb: 2
            },
            '& ul, & ol': {
              color: '#475569',
              pl: 3
            },
            '& li': {
              mb: 1
            },
            '& strong': {
              color: '#1e293b',
              fontWeight: 'bold'
            },
            '& em': {
              color: '#334155',
              fontStyle: 'italic'
            },
            '& code': {
              backgroundColor: '#f1f5f9',
              color: '#059669',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.9em'
            },
            '& pre': {
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto'
            }
          }}>
            <Markdown>{schedule}</Markdown>
          </StyledCard>

          <Box mt={4}>
            <StyledCard sx={{ 
              p: 4, 
              mb: 4
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  color: '#1e293b',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <SportsFootballIcon sx={{ color: '#667eea' }} />
                Filter Options
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel 
                      sx={{ 
                        color: '#64748b',
                        '&.Mui-focused': { color: '#667eea' }
                      }}
                    >
                      Team
                    </InputLabel>
                    <Select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      label="Team"
                      sx={{
                        color: '#1e293b',
                        backgroundColor: '#ffffff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#cbd5e1',
                          borderWidth: '2px'
                        },
                        '&:hover': {
                          backgroundColor: '#f8fafc',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#94a3b8'
                          }
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px'
                        },
                        '& .MuiSelect-icon': {
                          color: '#64748b'
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            '& .MuiMenuItem-root': {
                              color: '#1e293b',
                              '&:hover': {
                                backgroundColor: '#f1f5f9'
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#e0e7ff'
                              }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="ALL">All Teams</MenuItem>
                      {(() => {
                        const authorizedEmail = getAuthorizedEmail();
                        const userTeamNumbers = authorizedEmail ? getUserTeamNumbers(teams, authorizedEmail) : [];
                        const userTeams = teams.filter((team: any) => userTeamNumbers.includes(team.team_number));
                        const otherTeams = teams.filter((team: any) => !userTeamNumbers.includes(team.team_number));
                        
                        return [
                          ...userTeams.map((team: any) => (
                            <MenuItem key={team.team_number} value={team.team_number} sx={{ fontWeight: 'bold', color: '#4ade80 !important' }}>
                              {team.team_name} ⭐
                            </MenuItem>
                          )),
                          ...otherTeams.map((team: any) => (
                            <MenuItem key={team.team_number} value={team.team_number}>
                              {team.team_name}
                            </MenuItem>
                          ))
                        ];
                      })()}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel 
                      sx={{ 
                        color: '#64748b',
                        '&.Mui-focused': { color: '#667eea' }
                      }}
                    >
                      Week
                    </InputLabel>
                    <Select
                      value={selectedWeek}
                      onChange={(e) => setSelectedWeek(e.target.value)}
                      label="Week"
                      sx={{
                        color: '#1e293b',
                        backgroundColor: '#ffffff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#cbd5e1',
                          borderWidth: '2px'
                        },
                        '&:hover': {
                          backgroundColor: '#f8fafc',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#94a3b8'
                          }
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px'
                        },
                        '& .MuiSelect-icon': {
                          color: '#64748b'
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            '& .MuiMenuItem-root': {
                              color: '#1e293b',
                              '&:hover': {
                                backgroundColor: '#f1f5f9'
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#e0e7ff'
                              }
                            }
                          }
                        }
                      }}
                    >
                      {[...Array(12)].map((_, i) => (
                        <MenuItem key={i + 1} value={(i + 1).toString()}>
                          Week {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel 
                      sx={{ 
                        color: '#64748b',
                        '&.Mui-focused': { color: '#667eea' }
                      }}
                    >
                      League
                    </InputLabel>
                    <Select
                      value={selectedGameType}
                      onChange={(e) => setSelectedGameType(e.target.value)}
                      label="League"
                      sx={{
                        color: '#1e293b',
                        backgroundColor: '#ffffff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#cbd5e1',
                          borderWidth: '2px'
                        },
                        '&:hover': {
                          backgroundColor: '#f8fafc',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#94a3b8'
                          }
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px'
                        },
                        '& .MuiSelect-icon': {
                          color: '#64748b'
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            '& .MuiMenuItem-root': {
                              color: '#1e293b',
                              '&:hover': {
                                backgroundColor: '#f1f5f9'
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#e0e7ff'
                              }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="all">All Leagues</MenuItem>
                      <MenuItem value="espn">ESPN League</MenuItem>
                      <MenuItem value="blacktop">Blacktop League</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </StyledCard>

            <Box display="flex" alignItems="center" gap={2} mb={4}>
              <SportsFootballIcon sx={{ color: '#667eea', fontSize: 32 }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '1px'
                }}
              >
                Fantasy Battleground
              </Typography>
            </Box>
            
            {Object.values(groupedByGameId).length === 0 ? (
              <StyledCard sx={{ p: 6, textAlign: 'center' }}>
                <SportsFootballIcon sx={{ fontSize: 64, color: '#667eea', mb: 2 }} />
                <Typography variant="h5" sx={{ color: '#1e293b', mb: 1 }}>
                  No Battles Found
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                  No games match your current filters. Try adjusting your selection.
                </Typography>
              </StyledCard>
            ) : (
              Object.values(groupedByGameId).map((group: any, idx: number) => renderGame(group, idx))
            )}
          </Box>
        </Container>
      </Box>
    </PageShell>
  );
}