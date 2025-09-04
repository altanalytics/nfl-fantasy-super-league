export const getUserTeamNumbers = (teams: any[], authorizedEmail: string): string[] => {
  if (!authorizedEmail || !teams.length) return [];
  
  return teams
    .filter(team => team.email?.toLowerCase() === authorizedEmail.toLowerCase())
    .map(team => team.team_number);
};

export const getAuthorizedEmail = (): string | null => {
  return localStorage.getItem('authorizedEmail');
};
