import { Agenda } from 'agenda';
import { fetchGmailMessages, fetchOutlookMessages, categorizeEmail } from './mail/fetch.js';
import { getCategorizationAndReply } from './mail/openai.js';
import respond from './mail/respond.js';

const { sendGmailReply, sendOutlookReply } = respond;

// Initialize Agenda with MongoDB
const agenda = new Agenda({ db: { address: 'mongodb://localhost:27017/agenda' } });

// Define a job to process emails
agenda.define('processEmails', async (job) => {
  const { gmailTokens, outlookTokens } = job.attrs.data;

  const gmailMessages = await fetchGmailMessages(gmailTokens); 
  for (const message of gmailMessages) {
    const category = await categorizeEmail(message.snippet);
    const reply = await getCategorizationAndReply(message.snippet);
    await sendGmailReply(reply, message.threadId);
  }

  const outlookMessages = await fetchOutlookMessages(outlookTokens);
  for (const message of outlookMessages) {
    const category = await categorizeEmail(message.bodyPreview);
    const reply = await getCategorizationAndReply(message.bodyPreview); 
    await sendOutlookReply(reply, message.id, outlookTokens);
  }
});

// Function to add a job to the queue
const addEmailJob = async (gmailTokens, outlookTokens) => { 
  await agenda.start();
  await agenda.schedule(new Date(), 'processEmails', { gmailTokens, outlookTokens });
};

// Export the function to add jobs
export { addEmailJob };
