import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { getGmailAuthUrl, getGmailTokens, setGmailCredentials } from './gmail.js';
import _default from './outlook.js';
const { getOutlookAuthUrl, getOutlookTokens } = _default;

const TOKEN_PATH = join(__dirname, 'tokens.json');

const saveTokens = (tokens) => {
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
};

const loadTokens = () => {
  if (existsSync(TOKEN_PATH)) {
    const tokens = readFileSync(TOKEN_PATH);
    return JSON.parse(tokens);
  }
  return null;
};

const setupGmailOAuth = async () => {
  const url = getGmailAuthUrl();
  console.log(`Authorize this app by visiting this URL: ${url}`);

  const code = await prompt('Enter the code from that page here: ');
  const tokens = await getGmailTokens(code);
  setGmailCredentials(tokens);
  saveTokens({ gmail: tokens });
};

const setupOutlookOAuth = async () => {
  const url = getOutlookAuthUrl();
  console.log(`Authorize this app by visiting this URL: ${url}`);

  const code = await prompt('Enter the code from that page here: ');
  const tokens = await getOutlookTokens(code);
  saveTokens({ outlook: tokens });
};

const prompt = (question) => {
  return new Promise((resolve) => {
    const rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const initializeOAuth = async () => {
  let tokens = loadTokens();
  if (!tokens || !tokens.gmail) {
    await setupGmailOAuth();
    tokens = loadTokens(); // Reload tokens after Gmail setup
  } else {
    setGmailCredentials(tokens.gmail);
  }

  if (!tokens || !tokens.outlook) {
    await setupOutlookOAuth();
    tokens = loadTokens(); // Reload tokens after Outlook setup
  }

  console.log('OAuth setup completed');
};

initializeOAuth();
