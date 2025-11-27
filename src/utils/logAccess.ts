import { post } from 'aws-amplify/api';

export const logPageAccess = async (email: string, page: string) => {
  try {
    await post({
      apiName: 'nfl-fantasy-api',
      path: 'log-access',
      options: {
        body: {
          email,
          page
        }
      }
    });
  } catch (error) {
    console.error('Failed to log access:', error);
  }
};
