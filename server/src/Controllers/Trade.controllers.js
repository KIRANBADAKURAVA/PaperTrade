import Trade from '../Models/Trade.model.js';
import User from '../Models/User.model.js';
import Account from '../Models/Accounts.model.js';
import Transaction from '../Models/Transaction.model.js';
import Position from '../Models/Position.model.js';
import { AsyncHandler } from '../Utils/Asynchandler.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';

const createTrade = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log(req.body);
  const { symbol, quantity, price, action } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const account = await Account.findOne({ userId });
  if (!account) throw new ApiError(404, 'Account not found');

  if (action === 'buy') {
    const totalCost = price * quantity;

    if (account.balance < totalCost) {
      return res.status(400).json(
        new ApiResponse(400, {
          message: 'Insufficient balance',
        }, 'Insufficient balance')
        
      );    
    }

    account.balance -= totalCost;
    await account.save({ validateBeforeSave: false });
    console.log('while crating', price)

    await Position.create({
      accountId: account._id,
      symbol,
      quantity,
      entryPrice: price,
      status: 'open',
      action: 'buy',
      tradeType: 'long',
    });

  } else if (action === 'sell') {
    const totalCost = price * quantity;

    if (account.balance < totalCost) {
      return res.status(400).json(
        new ApiResponse(400, {
          message: 'Insufficient balance',
        }, 'Insufficient balance')
        
      );   
    }
    await Position.create({
      accountId: account._id,
      symbol,
      quantity,
      entryPrice: price,
      status: 'open',
      action: 'sell',
      tradeType: 'short',
    });

    await account.save({ validateBeforeSave: false });

  } else {
    throw new ApiError(400, 'Invalid action');
  }

  const trade = await Trade.create({
    accountId: account._id,
    symbol,
    quantity,
    price,
    action,
  });

  await Transaction.create({
    userId,
    accountId: account._id,
    type: 'trade',
    amount: action === 'buy' ? -price * quantity : price * quantity,
    symbol,
    quantity,
  });

  return res.status(201).json(
    new ApiResponse(201, {
      trade: {
        _id: trade._id,
        symbol: trade.symbol,
        quantity: trade.quantity,
        price: trade.price,
        action: trade.action,
      },
      account: {
        _id: account._id,
        balance: account.balance,
      },
    }, 'Trade created successfully')
  );
});

const getTradesByStatus = AsyncHandler(async (req, res) => {
  const { status } = req.params;

  if (!['open', 'closed', 'pending'].includes(status)) {
    throw new ApiError(400, 'Invalid status parameter');
  }

  const userId = req.user._id;
  const account = await Account.findOne({ userId });
  if (!account) throw new ApiError(404, 'Account not found');

  const allPositions = await Position.find({ accountId: account._id });
  const positions = allPositions.filter(position => position.status === status);

  return res.status(200).json(
    new ApiResponse(200, positions, `${status.charAt(0).toUpperCase() + status.slice(1)} positions fetched successfully`)
  );
});


const closeTrade = AsyncHandler(async (req, res) => {
  const  positionId  = req.params.id;
  console.log(req.params);
  if(!positionId) throw new ApiError(400, 'Position ID is required');
  
  const { price } = req.body;
  if(price<0) console.log('negative')
  console.log('current price',price)
  // Fetch the position that needs to be closed
  const position = await Position.findById(positionId);
  if (!position) throw new ApiError(404, 'Position not found');

  // Fetch the corresponding account for the position
  const account = await Account.findById(position.accountId);
  if (!account) throw new ApiError(404, 'Account not found');

  // Check if the position is already closed
  if (position.status !== 'open') {
    throw new ApiError(400, 'Position is already closed');
  }

  // Calculate the Profit and Loss (PnL)
  let profitLoss = 0;
  if (position.tradeType === 'long') {
    console.log('entry price' ,position.entryPrice)
    // For a long trade, PnL = (Exit Price - Entry Price) * Quantity
    profitLoss = (price - position.entryPrice) * position.quantity;
  } else if (position.tradeType === 'short') {
    // For a short trade, PnL = (Entry Price - Exit Price) * Quantity
    profitLoss = (position.entryPrice - price) * position.quantity;
  }

  // Update the position to be closed and set the exit price and PnL
  position.status = 'closed';
  position.exitPrice = price;
  position.profitLoss = profitLoss;
  console.log(profitLoss);
  // Save the position and account
  await position.save({ validateBeforeSave: false });
  
  account.balance += profitLoss; // Update the account balance with the PnL
  await account.save({ validateBeforeSave: false });

  // Create a new trade record for the closed position
  const trade = await Trade.create({
    accountId: position.accountId,
    symbol: position.symbol,
    quantity: position.quantity,
    price,
    action: position.action === 'buy' ? 'sell' : 'buy', // Reverse action
  });

  // Create a new transaction record for the closing of the trade
  await Transaction.create({
    userId: req.user._id,
    accountId: position.accountId,
    type: 'trade',
    amount: profitLoss, // Profit or loss amount
    symbol: position.symbol,
    quantity: position.quantity,
  });

  // Return a response with the updated account and trade info
  return res.status(200).json(
    new ApiResponse(200, {
      position: {
        _id: position._id,
        symbol: position.symbol,
        quantity: position.quantity,
        entryPrice: position.entryPrice,
        exitPrice: price,
        profitLoss,
        status: 'closed',
      },
      trade: {
        _id: trade._id,
        symbol: trade.symbol,
        quantity: trade.quantity,
        price: trade.price,
        action: trade.action,
      },
      account: {
        _id: account._id,
        balance: account.balance,
      },
    }, 'Trade closed successfully')
  );
});



export {
  createTrade,
  getTradesByStatus,
  closeTrade
};
