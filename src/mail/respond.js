import { google } from 'googleapis';
import axios from 'axios';
import { getGmailClient } from '../oauth/gmail.js';

const sendGmailReply = async (message, threadId) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: getGmailClient() });
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: Buffer.from(`Content-Type: text/plain; charset="UTF-8"\r\n` +
          `Content-Transfer-Encoding: 7bit\r\n` +
          `To: recipient@example.com\r\n` +
          `Subject: Re: Subject\r\n` +
          `In-Reply-To: ${threadId}\r\n` +
          `References: ${threadId}\r\n` +
          `\r\n` +
          `${message}`).toString('base64'),
        threadId,
      },
    });
  } catch (error) {
    console.error('Error sending Gmail reply:', error);
    throw error;
  }
};

const sendOutlookReply = async (message, messageId, tokens) => {
  try {
    await axios.post(
      `https://graph.microsoft.com/v1.0/me/messages/${messageId}/reply`,
      {
        comment: message, // The content of your reply
      },
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending reply to Outlook:', error);
    throw error;
  }
};

export default { sendGmailReply, sendOutlookReply };
