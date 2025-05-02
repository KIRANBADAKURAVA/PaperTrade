import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// cors 
app.use(cors({
    options: process.env.FRONTEND_URL,
    credentials: true
}))

//json 
app.use(express.json({
    limit: '16kb'
}))

//url

app.use(express.urlencoded({
    extended:true,
    limit: '16kb'
}))


//cache
app.use(express.static('public'))

app.use(cookieParser())

// router import 
import router from './Routes/User.routes.js'
import TradeRouter from './Routes/Trade.routes.js'



//routing 
app.use('/api/v1/user', router)
app.use('/api/v1/trade', TradeRouter)




export default app