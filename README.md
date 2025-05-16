#  PaperTrade

**Your one-stop destination for market research, AI-assisted decision making, and paper trading.**

PaperTrade is a simulated trading platform designed for traders, learners, and researchers. Whether you're exploring strategies, backtesting ideas, or testing models in a risk-free environment, PaperTrade has you covered — all powered by intelligent automation and a seamless UI.

---

##  Overview

PaperTrade combines the power of data, simulation, and AI to bring you a complete trading lab in one app.

-  **Market Research**: Analyze historical data, identify trends, and explore strategies.
-  **AI Decision Support**: Get intelligent trade suggestions from a custom LangChain agent powered by **Groq (LLaMA-3)**.
-  **Paper Trading**: Simulate trades with no real money involved — ideal for strategy testing.

All these features work together to give you a smarter, faster, and safer way to learn and improve your trading skills.

---


## 📁 Project Structure

- **`client/`** – Frontend application (React) for user interaction.
- **`server/`** – Backend (Node.js/Express) with logic for trading simulation, ML model handling, and AI agent routing.

---

## Trading Bot with Groq

PaperTrade now includes an **AI-driven trading assistant** using:

- **Groq LLaMA-3**: Blazing fast, low-latency LLM inference.
- **LangChain JS**: For building tool-augmented agents.
- **Custom Tools**: Agents can call server endpoints to:
  - `buy` and `sell` trades
  - `get open positions`
  - `close trades`
  - `analyze market data`
- **Conversational Memory**: Maintains context throughout the trading session.

**Example**:  
> _"Buy 10 shares of AAPL if the price drops below $150."_  
The bot interprets it, evaluates market data, and simulates the trade.

---

## 📊 Database Model

![alt text](<Trade database.png>)

---

## 🚀 Features

- 📉 Paper trading with no real money involved
- 📈 Historical data analysis and strategy testing
- 🧠 AI-powered trading bot using Groq + LangChain
- 💡 Real-time decision support
- 💻 Modern UI/UX with React and Tailwind CSS

---

## 🛠️ Tech Stack

| Layer        | Tech                                    |
|--------------|-----------------------------------------|
| Frontend     | React, Tailwind CSS, Axios              |
| Backend      | Node.js, Express, Groq                  |
| AI           | Groq (LLaMA-3), Custom Tools            |
| Database     | MongoDB                                 |
| Tooling      | Git, Postman, VS Code                   |

---


