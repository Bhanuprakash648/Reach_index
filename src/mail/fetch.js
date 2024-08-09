// src/mail/fetch.js
import { google } from 'googleapis';
import axios from 'axios';
import { getGmailClient } from '../oauth/gmail.js';
import outlook from '../oauth/outlook.js';

const fetchGmailMessages = async () => {
  const gmail = google.gmail({ version: 'v1', auth: getGmailClient() });
  const res = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });
  return res.data.messages || [];
};

const fetchOutlookMessages = async (tokens) => {
  const res = await axios.get('https://graph.microsoft.com/v1.0/me/messages', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  return res.data.value || [];
};

const categorizeEmail = async (email) => {
  // Dummy implementation, replace with OpenAI API call to categorize email
  if (email.includes('interested')) return 'Interested';
  if (email.includes('more information')) return 'More Information';
  return 'Not Interested';
};

export { fetchGmailMessages, fetchOutlookMessages, categorizeEmail };
