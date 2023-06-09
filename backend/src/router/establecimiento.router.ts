import {Router} from 'express'
const multer=require('multer')
import { postEstablecimiento } from '../controller/establecimiento.controller'

const router=Router() 
const upload=multer({dest:'/public/imagenes'})

router.post('/establecimiento',postEstablecimiento)
export default router 