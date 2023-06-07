import {Router} from 'express' 
import { getSuscripcion, postSuscripcion } from '../controller/suscripcion.controller'


const router = Router() 
//controller de suscripcion
router.post("/suscripcion",postSuscripcion)
router.get("/suscripciones", getSuscripcion)
export default router 
