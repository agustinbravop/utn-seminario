import 'reflect-metadata'
import express, {Application} from 'express'
import suscripcionRouter from './router/router'
import morgan from 'morgan' 
import cors from 'cors'
const app: Application=express() 
app.use(express.json()) 
app.use("/api", suscripcionRouter)
app.use(morgan('dev')) 
app.use(cors())
export default app 


