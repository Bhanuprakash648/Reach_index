import express from 'express';
import { getGmailAuthUrl, getGmailTokens, setGmailCredentials } from './oauth/gmail.js';
import _default from './oauth/outlook.js';
import { addEmailJob } from './bullmq.js';
import  json  from 'body-parser';
const { getOutlookAuthUrl, getOutlookTokens }=_default;

const app = express();
const port = 3000;

app.use(json());
app.get('/auth/gmail', (req, res) => {
  const url = getGmailAuthUrl();
  res.redirect(url);
});

app.get('/auth/gmail/callback', async (req, res) => {
  const code = req.query.code;
  const tokens = await getGmailTokens(code);
  setGmailCredentials(tokens);
  res.send('Gmail account connected');
});

app.get('/auth/outlook', (req, res) => {
  const url = getOutlookAuthUrl();
  res.redirect(url);
});

app.get('/auth/outlook/callback', async (req, res) => {
  const code = req.query.code;
  const tokens = await getOutlookTokens(code);
  res.send('Outlook account connected');
});

app.post('/process-emails', async (req, res) => {
  const { gmailTokens, outlookTokens } = req.body;
  await addEmailJob(gmailTokens, outlookTokens);
  res.send('Processing emails...');
});
 
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
