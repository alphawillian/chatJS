import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
let initQ = 0;
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

  switch(initQ) {
    case 0:
      try {
        context.push({
          type: 'user',
          display: false,
          text: question1(userInfo),
        });
        const completion = await _call(context);
        context.push({
          type: 'gpt',
          display: true,
          text: completion.data.choices[0].text,
        });
        res.status(200).json({ result: context});
        initQ += 1;
      } catch(error) { }
      break;

    case 1:
      try {
        context.push({
          type: 'user',
          display: false,
          text: question2(userInfo),
        });
        const completion = await _call(context);
        context.push({
          type: 'gpt',
          display: true,
          text: completion.data.choices[0].text,
        });
        res.status(200).json({ result: context});
        initQ += 1;
      } catch(error) { }
      break;

    default:
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
        const completion = await _call(context);
        context.push({
          type: 'gpt',
          display: true,
          text: completion.data.choices[0].text,
        });
        res.status(200).json({ result: context});
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
      break;
  }
}


async function _call(context) {
  const prompt = context.map(i => i.text).join("\n\n");
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
  });
  console.log(JSON.stringify(completion.data.choices));
  return completion;
}


function question1(userInfo) {
  return `我的投资情况: 资产${userInfo.asset}元，持仓${userInfo.holdProfit >= 0 ? '收益' : '亏损'}${Math.abs(userInfo.holdProfit)}元，近半年交易${userInfo.tradeIn6Months}笔，请给出少于200字的评价。`;
}

function question2(userInfo) {
  return `我是一个${userInfo.riskLevelName}的投资者，当前市场状态，应该投偏股基金还是偏债基金？\n\n鉴于您是一个${userInfo.riskLevelName}投资者，`;
}
