import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
dotenv.config(); 

const app = express()

// cors 

//console.log( process.env.CORS_ORIGIN)
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
};


app.use(cors(corsOptions)); 

// Parse incoming requests with JSON payloads and limit size
app.use(express.json({
  limit: '16kb'
}));

// Parse URL-encoded data with a size limit
app.use(express.urlencoded({
  extended: true,
  limit: '16kb'
}));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Cookie parser middleware for handling cookies
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_ID,
    ttl: 24 * 60 * 60, 
  }),
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// Import routers
import router from './Routes/User.routes.js'
import TradeRouter from './Routes/Trade.routes.js'
import AgentRouter from './Routes/Agent.routes.js'
// Simple test route to verify the server
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API routing for user and trade-related requests
app.use('/api/v1/user', router);
app.use('/api/v1/trade', TradeRouter);
app.use('/api/v1/agent', AgentRouter);

// Start server
app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});

export default app;
