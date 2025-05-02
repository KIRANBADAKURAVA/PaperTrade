import express from 'express';

import {createTrade } from '../Controllers/Trade.controllers.js';

import { Tokenverification } from '../Middlewares/Auth.middleware.js';


const TradeRouter = express.Router();
// Create a new trade
TradeRouter.post('/', Tokenverification, createTrade); 


export default TradeRouter;