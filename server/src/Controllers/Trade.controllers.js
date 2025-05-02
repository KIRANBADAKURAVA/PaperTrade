import Trade from '../Models/Trade.model.js';
import User from '../Models/User.model.js';
import Account from '../Models/Accounts.model.js';
import Transaction from '../Models/Transaction.model.js';
import { AsyncHandler } from '../Utils/Asynchandler.js';
import {ApiError} from '../Utils/ApiError.js';
import {ApiResponse} from '../Utils/ApiResponse.js';
import Position from '../Models/Position.model.js';


const createTrade = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
   // console.log(userId);
    const { symbol, quantity, price, action } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }   
    const account = await Account.findOne({ userId });
   // console.log(account.balance);
    if (!account) {
        throw new ApiError(404, 'Account not found');
    }
   

    if(action === 'buy') {
        if (account.balance < price * quantity) {
            throw new ApiError(400, 'Insufficient balance');
        }
        account.balance -= price * quantity;
        await account.save({ validateBeforeSave: false });

        const position = await Position.findOne({ symbol, userId });
        if (position) {
            position.quantity += quantity;
            await position.save();
        } else {
           // console.log(account._id, symbol, quantity);
            await Position.create({ accountId: account._id, symbol, quantity });
        }
    }else if(action === 'sell') {
        const position = await Position.findOne({ symbol, userId });
        if (!position || position.quantity < quantity) {
            throw new ApiError(400, 'Insufficient position');
        }
        position.quantity -= quantity;
        account.balance += price * quantity;
        await account.save();
        await position.save();
    }else {
        throw new ApiError(400, 'Invalid action');
    }
    const trade = await Trade.create({accountId: account._id, symbol, quantity, price, action });
    if (!trade) {
        throw new ApiError(500, 'Trade creation failed');
    }

    const transaction = await Transaction.create({
        userId,
        accountId: account._id,
        type: 'trade'  ,
        amount: action === 'buy' ? price * quantity : -price * quantity,
        symbol,
        quantity,
    });
    if (!transaction) {
        throw new ApiError(500, 'Transaction creation failed');
    }

    return new ApiResponse(res, 201, '', {
        trade: {
            _id: trade._id,
            symbol: trade.symbol,
            quantity: trade.quantity,
            price: trade.price,
            action: trade.action,
            createdAt: trade.createdAt,
        },
        account: {
            _id: account._id,
            balance: account.balance,
        },

    }, 'Trade created successfully');
}
);


export {
    createTrade
}