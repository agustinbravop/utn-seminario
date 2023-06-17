import {NextFunction ,Request, Response} from 'express' 
import {AnyZodObject, ZodError} from 'zod' 

export const schemaValidation=
(schema:AnyZodObject)=>
(req:Request, res:Response, next:NextFunction)=> { 
    try { 
        schema.parse({ 
            body:req.body 
           
        }); 
        next()
    }catch(error) { 
        console.log(error, req.body) 
        if (error instanceof ZodError) { 
            return res.status(400).json(
                error.issues.map((issue)=> ({ 
                    path:issue.path, 
                    message:issue.message,
                }))
            ); 
        }
        return res.status(400).json({message: "Error interno del servidor"})
    }
} 
