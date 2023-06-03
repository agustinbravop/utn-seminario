import app from './app'
import {PrismaClient} from '@prisma/client'
const prisma=new PrismaClient()

app.listen(3000) 
