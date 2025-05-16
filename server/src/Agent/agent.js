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
  }
];

export { groq, tools };
