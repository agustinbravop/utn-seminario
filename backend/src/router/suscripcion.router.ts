import {Router} from 'express' 
import { getSuscripcion, getSuscripcionbyId, postSuscripcion, postSuscripcionTipo } from '../controller/suscripcion.controller'

const router = Router() 
//controller de suscripcion
router.post("/suscripciones",postSuscripcion)
router.post('/suscripciones/:nombre',postSuscripcionTipo)
router.get("/suscripciones", getSuscripcion)
router.get('/suscripcion/:id', getSuscripcionbyId)



export default router 
