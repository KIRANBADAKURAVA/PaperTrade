import dotenv from "dotenv";
dotenv.config(); 

import Groq from "groq-sdk"; 

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const tools = [
  {
    type: "function",
    function: { // ✅ Nest the tool definition here
      name: "buyStock",
      description: "Buy a stock from the user",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The symbol of the stock to buy",
          },
          quantity: {
            type: "number",
            description: "The quantity of the stock to buy",
          },
        },
        required: ["symbol", "quantity"],
      },
    }
  },
  {
    type: "function",
    function: { 
      name: "getTradesByStatus",
      description: "sell a stock from the user",
      parameters: {
        type: "object",
        properties: {
          status: { 
            type: "string",
            description: "The status of the trades to get",
          },
        },
        required: ["status"],
      },
    }
  },
  {
    type: "function",
    function: { // ✅ Nest the tool definition here
      name: "sellStock",
      description: "sell a stock from the user",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The symbol of the stock to sell",
          },
          quantity: {
            type: "number",
            description: "The quantity of the stock to sell",
          },
        },
        required: ["symbol", "quantity"],
      },
    }
  },
];

export { groq, tools };
