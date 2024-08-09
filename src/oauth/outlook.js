import { AuthorizationCode } from 'simple-oauth2';

const outlookClient = new AuthorizationCode({
  client: {
    id: process.env.OUTLOOK_CLIENT_ID,
    secret: process.env.OUTLOOK_CLIENT_SECRET,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: '/common/oauth2/v2.0/authorize',
    tokenPath: '/common/oauth2/v2.0/token',
  },
});

const getOutlookAuthUrl = () => {
  const authorizationUri = outlookClient.authorizeURL({
    redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
    scope: ['https://graph.microsoft.com/Mail.Read', 'https://graph.microsoft.com/Mail.Send'],
  });
  return authorizationUri;
};

const getOutlookTokens = async (code) => {
  const tokenParams = {
    code,
    redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
    scope: 'https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.Send',
  };
  const accessToken = await outlookClient.getToken(tokenParams);
  return accessToken.token;
};

export default { getOutlookAuthUrl, getOutlookTokens };
