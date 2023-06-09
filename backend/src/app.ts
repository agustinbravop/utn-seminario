import 'reflect-metadata'
import express, {Application} from 'express'
import suscripcionRouter from './router/suscripcion.router'
import tarjetaRouter from './router/tarjeta.router'
import establecimientoRouter from './router/establecimiento.router'
import morgan from 'morgan'
const multer = require('multer')
const cloudinary=require('cloudinary')
const path=require('path')
import cors from 'cors'
const app: Application=express() 
app.use(express.json()) 
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/imagenes/'),
    filename: (req:any, file:any, cb:any, filename:any) => {
        console.log(file);
        cb(null,file.originalname);
    }
}) 
app.use(multer({storage}).single('image'));

app.use("/api", suscripcionRouter)
app.use('/api', tarjetaRouter)
app.use('/api', establecimientoRouter)



app.use(morgan('dev')) 
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
export default app 


