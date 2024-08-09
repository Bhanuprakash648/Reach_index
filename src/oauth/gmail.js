import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

export const getGmailAuthUrl = () => {
  const scopes = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];
  return oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });
};

export const getGmailTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

export const setGmailCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

export const getGmailClient = () => oauth2Client;
