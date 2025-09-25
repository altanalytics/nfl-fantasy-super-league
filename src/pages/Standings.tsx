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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SportsIcon from '@mui/icons-material/Sports';
import StarIcon from '@mui/icons-material/Star';
import { get } from 'aws-amplify/api';
import outputs from "../../amplify_outputs.json"; 

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
    background: 'linear-gradient(90deg, #4f46e5 0%, #764ba2 50%, #4f46e5 100%)',
  }
}));

const TeamRow = styled(Box)(({ theme, rank }: { theme?: any; rank: number }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '16px 20px',
  margin: '8px 0',
  borderRadius: '16px',
  background: rank === 1
    ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
    : rank <= 7
      ? 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: rank === 1
    ? '2px solid #10b981'
    : rank <= 7
      ? '1px solid #4f46e5'
      : '1px solid rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: rank === 1
      ? 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)'
      : rank <= 7
        ? 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
  }
}));

const getRankIcon = (rank: number) => {
  const isPlayoffTeam = rank <= 7;
  const isByeTeam = rank === 1;
  
  return (
    <Box 
      sx={{ 
        width: 36, 
        height: 36, 
        borderRadius: '8px', 
        background: isByeTeam 
          ? 'linear-gradient(45deg, #047857 0%, #047857 100%)'
          : isPlayoffTeam 
            ? 'linear-gradient(45deg, #4f46e5 0%, #764ba2 100%)'
            : 'linear-gradient(45deg, #94a3b8 0%, #64748b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.8)',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        border: isByeTeam ? '2px solid #10b981' : 'none'
      }}
    >
      {rank}
    </Box>
  );
};

const getLeagueGradient = (leagueId: string) => {
  return leagueId === '1' 
    ? 'linear-gradient(45deg, #4f46e5 0%, #764ba2 100%)'
    : 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)';
};

export default function Standings() {
  const [league1, setLeague1] = useState([]);
  const [league2, setLeague2] = useState([]);
  
  const league1Wins = league1.reduce((sum: number, team: any) => sum + team.in_wins, 0);
  const league2Wins = league2.reduce((sum: number, team: any) => sum + team.in_wins, 0);

  useEffect(() => {
    const fetchLeague = async (id: string, setter: Function) => {
      try {
        const restOperation = get({
          apiName: 'nfl-fantasy-api',
          path: `/teams?league=${id}`
        });
        const response = await restOperation.response;
        const data = await response.body.json() as any[];

        const cleaned = data.map((team: any) => ({
          ...team,
          in_wins: parseInt(team.in_wins || '0'),
          total_points: parseInt(team.total_points || '0'),
        }));

        const sorted = cleaned.sort((a, b) =>
          b.in_wins - a.in_wins || b.total_points - a.total_points
        );

        setter(sorted);
      } catch (error) {
        console.error('Error fetching league:', error);
      }
    };

    fetchLeague('1', setLeague1);
    fetchLeague('2', setLeague2);
  }, []);

  return (
    <PageShell>
      <HeroComponent
        heroText="Where do you Rank?"
        heroImage={imageHero}
        textGray='yes'
        textOutline="yes"
      />

      <Box sx={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        minHeight: '100vh',
        pt: 4
      }}>
        <Container>
          {/* Markdown Content */}
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
              color: '#047857',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.9em'
            }
          }}>
            <Markdown>{standings}</Markdown>
          </StyledCard>

          {/* Conference Score */}
          <StyledCard sx={{ p: 4, mb: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
              <SportsIcon sx={{ color: '#4f46e5', fontSize: 32, mr: 2 }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: '#4f46e5',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '1px'
                }}
              >
                Conference Battle
              </Typography>
            </Box>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" gap={4}>
                <Box textAlign="center">
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: league1Wins > league2Wins ? '#047857' : '#475569',
                      textShadow: league1Wins > league2Wins ? '0 0 20px rgba(74, 222, 128, 0.5)' : 'none'
                    }}
                  >
                    {league1Wins}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748b', mt: 1 }}>
                    Minivan Mayhem
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  backgroundColor: '#4f46e5',
                  borderRadius: '50%',
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)'
                }}>
                  <Typography variant="h5" sx={{ color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.8)', fontWeight: 'bold' }}>
                    VS
                  </Typography>
                </Box>
                
                <Box textAlign="center">
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: league2Wins > league1Wins ? '#047857' : '#475569',
                      textShadow: league2Wins > league1Wins ? '0 0 20px rgba(74, 222, 128, 0.5)' : 'none'
                    }}
                  >
                    {league2Wins}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748b', mt: 1 }}>
                    Snacktime Bandits
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </StyledCard>

          {/* League Standings */}
          <Grid container spacing={4}>
            {/* Minivan Mayhem */}
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledCard sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      background: getLeagueGradient('1'),
                      mr: 2 
                    }} 
                  />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 'bold',
                      background: getLeagueGradient('1'),
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Minivan Mayhem
                  </Typography>
                </Box>
                
                {league1.map((team: any, idx: number) => (
                  <Box key={idx}>
                    <TeamRow rank={idx + 1}>
                      <Box display="flex" alignItems="center" flex={1}>
                        <Box mr={2}>
                          {getRankIcon(idx + 1)}
                        </Box>
                        <Box flex={1}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#0f172a', 
                              fontWeight: 'bold',
                              mb: 0.5
                            }}
                          >
                            {team.team_name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ color: '#334155' }}
                          >
                            {team.team_nickname}
                          </Typography>
                        </Box>
                      <Box textAlign="right">
                        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                          <Box display="flex" gap={1}>
                            <Chip 
                              label={`${team.in_wins} W`}
                              sx={{
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                border: '1px solid #16a34a'
                              }}
                            />
                            <Chip 
                              label={`${team.total_points} pts`}
                              sx={{
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                border: '1px solid #d97706'
                              }}
                            />
                          </Box>
                          {idx === 0 && (
                            <Chip 
                              label="🏆 BYE WEEK" 
                              sx={{
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                px: 1,
                                border: '2px solid #16a34a'
                              }}
                            />
                          )}
                          {idx > 0 && idx < 7 && (
                            <Chip 
                              label="🎯 PLAYOFFS" 
                              sx={{
                                backgroundColor: '#e0e7ff',
                                color: '#3730a3',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                px: 1,
                                border: '2px solid #4f46e5'
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </TeamRow>
                  {idx === 6 && (
                    <Box sx={{ my: 3, textAlign: 'center' }}>
                      <Box sx={{ 
                        height: '2px', 
                        background: 'linear-gradient(90deg, transparent 0%, #dc2626 20%, #dc2626 80%, transparent 100%)',
                        mb: 2
                      }} />
                      <Chip 
                        label="PLAYOFF LINE" 
                        sx={{
                          background: 'linear-gradient(45deg, #dc2626 0%, #b91c1c 100%)',
                          color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      />
                    </Box>
                  )}
                </Box>
                ))}
              </StyledCard>
            </Grid>

            {/* Snacktime Bandits */}
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledCard sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      background: getLeagueGradient('2'),
                      mr: 2 
                    }} 
                  />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 'bold',
                      background: getLeagueGradient('2'),
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Snacktime Bandits
                  </Typography>
                </Box>
                
                {league2.map((team: any, idx: number) => (
                  <Box key={idx}>
                    <TeamRow rank={idx + 1}>
                      <Box display="flex" alignItems="center" flex={1}>
                        <Box mr={2}>
                          {getRankIcon(idx + 1)}
                        </Box>
                        <Box flex={1}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#0f172a', 
                              fontWeight: 'bold',
                              mb: 0.5
                            }}
                          >
                            {team.team_name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ color: '#334155' }}
                          >
                            {team.team_nickname}
                          </Typography>
                        </Box>
                      <Box textAlign="right">
                        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                          <Box display="flex" gap={1}>
                            <Chip 
                              label={`${team.in_wins} W`}
                              sx={{
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                border: '1px solid #16a34a'
                              }}
                            />
                            <Chip 
                              label={`${team.total_points} pts`}
                              sx={{
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                border: '1px solid #d97706'
                              }}
                            />
                          </Box>
                          {idx === 0 && (
                            <Chip 
                              label="🏆 BYE WEEK" 
                              sx={{
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                px: 1,
                                border: '2px solid #16a34a'
                              }}
                            />
                          )}
                          {idx > 0 && idx < 7 && (
                            <Chip 
                              label="🎯 PLAYOFFS" 
                              sx={{
                                backgroundColor: '#e0e7ff',
                                color: '#3730a3',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                px: 1,
                                border: '2px solid #4f46e5'
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </TeamRow>
                  {idx === 6 && (
                    <Box sx={{ my: 3, textAlign: 'center' }}>
                      <Box sx={{ 
                        height: '2px', 
                        background: 'linear-gradient(90deg, transparent 0%, #dc2626 20%, #dc2626 80%, transparent 100%)',
                        mb: 2
                      }} />
                      <Chip 
                        label="PLAYOFF LINE" 
                        sx={{
                          background: 'linear-gradient(45deg, #dc2626 0%, #b91c1c 100%)',
                          color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      />
                    </Box>
                  )}
                </Box>
                ))}
              </StyledCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PageShell>
  );
}
