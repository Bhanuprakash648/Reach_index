import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const getCategorizationAndReply = async (emailContent) => {
  const prompt = `Categorize the following email content and suggest a reply based on the category:
  "${emailContent}"`;
  
  const response = await openai.completions.create({
    model: 'text-davinci-003',
    prompt,
    max_tokens: 150
  });
  
  return response.choices[0].text.trim();
};

export { getCategorizationAndReply };
