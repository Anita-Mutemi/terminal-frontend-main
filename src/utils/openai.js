import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';
const CHAT_GPT_KEY = process.env.REACT_APP_CHAT_GPT;

function createPrompt_1(
  name,
  website,
  about,
  content = 'not specified, rely only on about section and other available data',
) {
  const prompt_1 = `I will provide you a name of the company, about section from linkedin and website content, website URL. Based on this information, you will have to clearly understand what that company does and be able to say the difference and the competitors of that company.  Sometimes, website data or about section might not be present, so bear that in mind and it should not affect you. Here is the info:
{Company Name}:  ${name}
{Company Website}: ${website}
{Company About Section}: ${about}
{Company Website Content}:  ${content}
To help you better understand the industry and the company's position within it, please specify the following categories but keep the answers in your mind without actually producing the answers to those questions, you will have to producy only JSON:
Competing Space
Customer Segment
Company Type
Product Type
R&D Investment
Additionally, please keep that in your mind the following questions:
Does the company focus on data science?
Does the company require a physical presence to offer its product or service?
Does the company have a marketplace model?
Does the company focus on developing intellectual property or deep-tech?
Is the company sustainability-focused?
Does the company focus on building physical or digital infrastructure?
Does the company gather user data?
Does the company offer a subscription-based service?
Is the company's primary focus on improving or enhancing existing products or services?
Is the company's primary focus on providing a more efficient or cost-effective solution?
Does the company focus on a niche market or specific customer segment?
Does the company target a mass market or multiple customer segments?
Does the company's offering involve blockchain or distributed ledger technology?
Does the company's offering involve virtual or augmented reality?
Does the company emphasize social impact or corporate social responsibility?
Does the company need to collaborate with other organizations or form partnerships to achieve its goals?
Does the company offer customizable or personalized products or services?
Does the company provide self-service or DIY options for customers?

!PROVIDE JSON ONLY!
{
"Task-1": [{}]
"Task-2": [{}]
};
in the exact format above ^. Each task contains an array of objects: company_name, website
Base your answers for the following tasks on the previous company. Task 1: Return a list of up to 12 early-stage companies solving the same problem Task 2: Return a list of up to 13 early-stage companies offering the same solution. Be precise and specific, companies must be relatable to each other. Do not repeat the same company again, only unique ones, please!
!PROVIDE JSON ONLY! 
`;

  return prompt_1;
}

const fetchData = async (input, setLoadingStatus) => {
  setLoadingStatus && setLoadingStatus('Analyzing options...');
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      temperature: 0.1,
      messages: [{ role: 'user', content: input }],
      // max_tokens: 700,
      // n: 1,
      // stop: '.',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHAT_GPT_KEY}`,
      },
    },
  );
  setLoadingStatus && setLoadingStatus(null);
  return await response;
};

const configuration = new Configuration({
  apiKey: CHAT_GPT_KEY,
});

const openai = new OpenAIApi(configuration);

const generateResponse = async (newQuestion, setNewQuestion) => {
  let options = {
    model: 'text-davinci-003',
    temperature: 0,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ['/'],
  };

  let completeOptions = {
    ...options,
    prompt: newQuestion,
  };

  const response = await openai.createCompletion(completeOptions);
  // if (response.data.choices) {
  //   setStoredValues([
  //     {
  //       question: newQuestion,
  //       answer: response.data.choices[0].text,
  //     },
  //     ...storedValues,
  //   ]);
  //   setNewQuestion('');
  // }
};

async function getWebsiteData(website, access_token, setLoadingStatus) {
  setTimeout(() => {
    setLoadingStatus && setLoadingStatus('Scrapping website data...');
  }, 2000);
  const response = await axios.post(
    `/v1/search/parse?website_url=${website}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );
  // fetch data set response
  setLoadingStatus && setLoadingStatus(null);
  return await response;
}

// openai.apiKey = CHAT_GPT_KEY;

export async function feedBot(project, access_token, setLoadingStatus) {
  try {
    setLoadingStatus && setLoadingStatus('Initialization...');
    const projectWebsiteData = await getWebsiteData(
      project.website,
      access_token,
      setLoadingStatus,
    );
    const getPrompt_1 = createPrompt_1(
      project.title,
      project.website,
      project.description,
      projectWebsiteData.data,
    );
    const context = await fetchData(getPrompt_1, setLoadingStatus);
    const data = JSON.parse(context.data.choices[0].message.content);
    const mergedArray = [...data['Task-1'], ...data['Task-2']];
    const finalSet = new Set(mergedArray.map(JSON.stringify));
    const finalArray = Array.from(finalSet).map(JSON.parse);
    setLoadingStatus && setLoadingStatus(null);
    return finalArray;
  } catch (err) {
    setLoadingStatus && setLoadingStatus('An error occurred.');
    return err;
  }
  // console.log(JSON.parse(context));
  // const prompt = 'What is the weather in London today?';
  // openai.Completion.create({
  //   engine: 'text-davinci-002',
  //   prompt: prompt,
  // }).then((response) => {
  //   console.log(response);
  //   console.log(response.choices[0].text);
  // });
}

// const data = {
//   "Task-1": [
//       {
//           "company_name": "EVmatch",
//           "website": "https://www.evmatch.com/"
//       },
//       // rest of the objects
//   ],
//   "Task-2": [
//       {
//           "company_name": "EVmatch",
//           "website": "https://www.evmatch.com/"
//       },
//       // rest of the objects
//   ]
// };

// console.log(finalArray);
