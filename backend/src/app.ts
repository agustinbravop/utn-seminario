import 'reflect-metadata'
import express, {Application} from 'express'
import suscripcionRouter from './router/suscripcion.router'
import tarjetaRouter from './router/tarjeta.router'
import morgan from 'morgan' 
import cors from 'cors'
const app: Application=express() 
app.use(express.json()) 
app.use("/api", suscripcionRouter)
app.use('/api', tarjetaRouter)
app.use('/api', administradorRouter)
app.use(morgan('dev')) 
app.use(cors())
export default app 


