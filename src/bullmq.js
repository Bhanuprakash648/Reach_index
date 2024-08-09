import pkg from 'bullmq';

const { Queue, QueueEvents, Worker } = pkg;  // Import BullMQ classes
import Redis from 'ioredis'; // Ensure this is installed
import { fetchGmailMessages, fetchOutlookMessages, categorizeEmail } from './mail/fetch.js';
import { getCategorizationAndReply } from './mail/openai.js';
import respond from './mail/respond.js';

const { sendGmailReply, sendOutlookReply } = respond;

// Create a Redis connection
const client = Redis.createClient({
  host: "localhost",
  port: 6379,
  password: "1234",
  user: "username"
});

const emailQueue = new Queue('emailQueue', { connection: client });
const queueScheduler = new QueueEvents('emailQueue', { connection: client });

const worker = new Worker('emailQueue', async (job) => {
  const { gmailTokens, outlookTokens } = job.data;

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
}, { connection: redisConnection });

const addEmailJob = async (gmailTokens, outlookTokens) => { 
  await emailQueue.add('processEmails', { gmailTokens, outlookTokens });
};

export { addEmailJob };
