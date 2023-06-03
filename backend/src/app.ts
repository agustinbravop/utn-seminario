import 'reflect-metadata'
import express from 'express'
import {PrismaClient} from '@prisma/client'
const prisma=new PrismaClient()
import morgan from 'morgan' 
import cors from 'cors'
const app=express() 
app.use(morgan('dev')) 
app.use(cors())
export default app 


