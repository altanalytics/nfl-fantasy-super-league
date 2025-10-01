import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'us-east-1' });
const BUCKET = 'alt-nfl-bucket';
const DATA_PREFIX = 'fantasy_data/';

interface TeamRow {
  team_name: string;
  team_number: string;
  team_nickname: string;
  league_id: string;
  in_wins: string;
  total_points: string;
}

interface ScheduleRow {
  game_id: string;
  unique_slot: string;
  home_team: string;
  away_team: string;
  home_player: string;
  away_player: string;
  home_position: string;
  away_position: string;
  home_pro_team: string;
  away_pro_team: string;
  home_projected: string;
  home_actual: string;
  away_projected: string;
  away_actual: string;
  game_type: string;
  home_bbr_team_id: string;
  away_bbr_team_id: string;
}

interface ScoreboardRow {
  week: string;
  home_team: string;
  home_points: string;
  away_team: string;
  away_points: string;
  winning_team: string;
  winning_name: string;
  winning_league: string;
}

async function logRequest(event: APIGatewayProxyEvent): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  const filename = `logs/api_hit_${timestamp}_${rand}.csv`;
  const logContent = `event,timestamp,url\nAPI_HIT,${timestamp},${event.path || ''}\n`;

  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: filename,
      Body: logContent,
      ContentType: 'text/csv'
    }));
  } catch (error) {
    console.error('Failed to log request:', error);
  }
}

async function getS3Object(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: `${DATA_PREFIX}${key}`
    });
    const response = await s3Client.send(command);
    return await response.Body!.transformToString();
  } catch (error) {
    throw new Error(`Failed to get S3 object ${DATA_PREFIX}${key}: ${error}`);
  }
}

function parseCsv<T>(csvContent: string): T[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const rows: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

function createResponse(statusCode: number, body: any): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  await logRequest(event);

  const params = event.queryStringParameters || {};
  const path = event.path || '';

  try {
    if (path === '/teams') {
      const csvContent = await getS3Object('bbr_teams.csv');
      let rows = parseCsv<TeamRow>(csvContent);

      const league = params.league;
      if (league) {
        rows = rows.filter(r => r.league_id === league);
      }

      return createResponse(200, rows);

    } else if (path === '/schedule') {
      const week = params.week;
      const gameType = (params.game_type || 'all').toLowerCase();
      const team = params.team;

      if (!week) {
        return createResponse(400, { error: 'Missing week parameter' });
      }

      const key = `week_${week}.csv`;
      let csvContent: string;

      try {
        csvContent = await getS3Object(key);
      } catch (error) {
        return createResponse(404, { error: `File not found: ${DATA_PREFIX}${key}` });
      }

      let rows = parseCsv<ScheduleRow>(csvContent);

      // Apply filters
      if (gameType !== 'all') {
        rows = rows.filter(r => r.game_type.toLowerCase() === gameType);
      }
      if (team && team !== 'ALL') {
        rows = rows.filter(r =>
          team === r.home_bbr_team_id || team === r.away_bbr_team_id
        );
      }

      // Group by game_id with separator markers
      const output: any[] = [];
      rows.sort((a, b) => {
        if (a.game_id !== b.game_id) {
          return a.game_id.localeCompare(b.game_id);
        }
        return parseInt(a.unique_slot) - parseInt(b.unique_slot);
      });

      let currentGameId: string | null = null;

      for (const row of rows) {
        if (row.game_id !== currentGameId) {
          if (currentGameId !== null) {
            output.push({ separator: true });
          }
          currentGameId = row.game_id;
        }

        output.push({
          game_id: row.game_id,
          unique_slot: row.unique_slot,
          home_team: row.home_team,
          away_team: row.away_team,
          home_player: row.home_player,
          home_position: row.home_position,
          home_pro_team: row.home_pro_team,
          away_player: row.away_player,
          away_position: row.away_position,
          away_pro_team: row.away_pro_team,
          home_projected: row.home_projected,
          home_actual: row.home_actual,
          away_projected: row.away_projected,
          away_actual: row.away_actual,
        });
      }

      return createResponse(200, output);

    } else if (path === '/scoreboard') {
      const week = params.week;

      if (!week) {
        return createResponse(400, { error: 'Missing week parameter' });
      }

      const csvContent = await getS3Object('bbr_schedule.csv');
      let rows = parseCsv<ScoreboardRow>(csvContent);

      rows = rows.filter(r => r.week === week);

      return createResponse(200, rows);

    } else {
      return createResponse(400, { error: 'Invalid endpoint' });
    }

  } catch (error) {
    console.error('Lambda error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
