import { defineFunction } from '@aws-amplify/backend';

export const nflApi = defineFunction({
  name: 'nfl-api',
  entry: './handler.ts'
});
