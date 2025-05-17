import { WebSocket } from "ws";
// --- Get current price via Binance WebSocket ---
const currentPrice = (symbol) => {
  return new Promise((resolve, reject) => {
    console.log(symbol);
    if(!symbol) {
      reject(new Error("Symbol is required"));
    }
    const socket = new WebSocket(`wss://fstream.binance.com/ws/${symbol.toLowerCase()}@trade`);

    socket.onopen = () => {
      console.log(`WebSocket connected: ${symbol}`);
    };

    socket.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      const price = parseFloat(trade.p);
      console.log(`Received price: ${price}`);
      socket.close();
      resolve(price);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error: ${symbol}`, error);
      socket.close();
      reject(error);
    };

    socket.onclose = () => {
      console.log(`WebSocket closed: ${symbol}`);
    };

    setTimeout(() => {
      socket.close();
      reject(new Error("Price fetch timed out"));
    }, 5000);
  });
};

// BUY Function
const buyStock = async ({symbol, quantity, accessToken}) => {


  const price =  await currentPrice(symbol)

  if (!price) throw new Error("Failed to get current price");

  const tradeData = {
    symbol,
    quantity,
    price,
    action: "buy",
    type: "market",
  };

  const response = await fetch("http://localhost:8000/api/v1/trade/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(tradeData),
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result.message || "Trade failed");

  return result;
}
// SELL Function
const sellStock = async ({symbol, quantity, accessToken}) => {


  const price =  await currentPrice(symbol)

  if (!price) throw new Error("Failed to get current price");

  const tradeData = {
    symbol,
    quantity,
    price,
    action: "sell",
    type: "market",
  };

  const response = await fetch("http://localhost:8000/api/v1/trade/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(tradeData),
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result.message || "Trade failed");

  return result;
}

// GET Trades by Status
const getTradesByStatus = async ({status, accessToken}) => {
  const response = await fetch(`http://localhost:8000/api/v1/trade/by-status/${status}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result.message || "Failed to get trades");

  return result;
}


export {
  currentPrice,
  buyStock,
  sellStock,
  getTradesByStatus,
};
