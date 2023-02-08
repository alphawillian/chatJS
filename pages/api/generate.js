import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
let context = [];

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  console.log(JSON.stringify(req.body));

  const text = req.body.animal || '';
  const userInfo = req.body.userInfo || {};

  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text",
      }
    });
    return;
  }

  try {
    context.push({
      type: 'user',
      display: true,
      text: text,
    });
    const completion = await _call();
    console.log(JSON.stringify(completion.data.choices));
    // res.status(200).json({ result: context});
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }

}


async function _call() {
  // const prompt = context.map(i => i.text).join("\n\n");
  const prompt = genPrompt();
  console.log(prompt);
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.3,
    max_tokens: 400,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 1,
    best_of: 1,
    // stream: true,
  // }, { responseType: 'stream'});
  });
  // completion.data.on('data', data => {
  //   const lines = data.toString().split('\n').filter(line => line.trim() !== '');
  //   for (const line of lines) {
  //     const message = line.replace(/^data: /, '');
  //     if (message === '[DONE]') {
  //       return; // Stream finished
  //     }
  //     try {
  //       const parsed = JSON.parse(message);
  //       console.log(parsed.choices[0].text);
  //     } catch(error) {
  //       console.error('Could not JSON parse stream message', message, error);
  //     }
  //   }
  // })
  context.push({
    type: 'gpt',
    display: true,
    text: completion.data.choices[0].text,  // .replace("\n", "<br/>"),
  });
  return completion;
}


function genPrompt(preText) {
  preText = preText || '';
  let prompt = `嘉实基金官网是www.jsfund.cn，客户端叫嘉实理财嘉。我与嘉实基金客服gpt的对话：\n`;

  context.slice(-6).map(item => {
    prompt += `${item.type}:${item.text}\n`;
  });

  prompt += `gpt: ${preText}`;
  return prompt;
}
