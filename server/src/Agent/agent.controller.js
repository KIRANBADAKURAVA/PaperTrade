import { currentPrice, buyStock, sellStock, getTradesByStatus } from './agent.functions.js';
import { AsyncHandler } from '../Utils/Asynchandler.js';
import { groq, tools } from './agent.js';
import { ApiResponse } from '../Utils/ApiResponse.js';

const handleQuery = AsyncHandler(async (req, res) => {
  console.log(req.session.messages);
  const { userQuery } = req.body;
  const accessToken = req.accessToken;

  console.log('start');
  console.log(accessToken);
  console.log(userQuery);

  const toolMap = {
    buyStock: (symbol, quantity) => buyStock(symbol, quantity, accessToken),
    sellStock: (symbol, quantity) => sellStock(symbol, quantity, accessToken),
    getTradesByStatus: (status) => getTradesByStatus(status, accessToken),
    currentPrice: (symbol) => currentPrice(symbol),
  };

  async function callToolByName(name, args) {
    if (toolMap[name]) {
      const result = await toolMap[name]({ ...args, accessToken });
      console.log(result);
      return result;
    } else {
      return JSON.stringify({ error: 'Unknown tool' });
    }
  }

  // Initialize or load conversation memory
  req.session.messages = req.session.messages || [
    {
      role: 'system',
      content:
        'You are a smart trading assistant. Help the user with trading-related queries, including market research, stock/crypto analysis, and trade decisions. Answer the users questions conversationally and clearly. Use tools only when necessary — such as placing trades, checking prices, or accessing user positions — but not for general advice or research. For example, if the user asks, "Do the market research of Avalanche crypto", respond with insights, trends, or summaries without calling tools. Your priority is to assist the user in understanding the market and making informed decisions. When a direct action is requested (e.g., "Buy 2 BTCUSDT now", "Close my Ethereum position"), call the appropriate tool.',
    },
  ];

  const messages = req.session.messages;
  messages.push({ role: 'user', content: userQuery });

  const first = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    messages,
    tools,
    tool_choice: 'auto',
  });

  const response = first.choices[0].message;
  const toolCalls = response.tool_calls;

  if (toolCalls) {
    messages.push(response); // Assistant message with tool call

    for (const toolCall of toolCalls) {
      const toolName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      const toolResult = await callToolByName(toolName, args);

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        name: toolName,
        content: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult),
      });
    }

    const second = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages,
    });

    const finalMsg = second.choices[0].message.content;
    messages.push({ role: 'assistant', content: finalMsg });

    // Optional: Truncate memory to last 20 interactions
    if (messages.length > 20) {
      messages.splice(1, messages.length - 20); // keep system + last 19
    }

    return res.status(200).json(new ApiResponse(finalMsg, 'Success'));
  } else {
    messages.push(response);

    // Optional: Truncate memory
    if (messages.length > 20) {
      messages.splice(1, messages.length - 20);
    }

    return res.status(200).json(new ApiResponse(response.content || 'No action needed.', 'Success'));
  }
});

export { handleQuery };
