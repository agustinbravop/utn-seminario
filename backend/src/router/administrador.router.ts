import { postAdministrador, getAllAdministrador, getAdministradorByNombre } from "../controller/administrador.controller";
import {Router} from 'express' 

const router=Router() 

router.post('/administrador', postAdministrador)
router.get('/administrador',getAllAdministrador )
router.get('/administrador/:nombre', getAdministradorByNombre)

export default router 
