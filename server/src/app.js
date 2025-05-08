import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// cors 

const corsOptions = {
  origin: 'http://localhost:5173', // your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions)); // Use CORS middleware with the options

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

// Import routers
import router from './Routes/User.routes.js'
import TradeRouter from './Routes/Trade.routes.js'

// Simple test route to verify the server
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API routing for user and trade-related requests
app.use('/api/v1/user', router);
app.use('/api/v1/trade', TradeRouter);

// Start server
app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});

export default app;
