import 'reflect-metadata'
import express from 'express'
import morgan from 'morgan' 
import cors from 'cors'
const app=express() 
app.use(morgan('dev')) 
app.use(cors())
export default app 


