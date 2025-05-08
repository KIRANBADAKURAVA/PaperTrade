import express from 'express';

import {createTrade , getTradesByStatus, closeTrade} from '../Controllers/Trade.controllers.js';

import { Tokenverification } from '../Middlewares/Auth.middleware.js';


const TradeRouter = express.Router();
// Create a new trade
TradeRouter.post('/create', Tokenverification, createTrade); 
TradeRouter.get('/by-status/:status', Tokenverification, getTradesByStatus);
TradeRouter.post('/close/:id', Tokenverification, closeTrade);

export default TradeRouter;