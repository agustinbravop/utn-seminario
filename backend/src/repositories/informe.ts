import {
  PrismaClient,
} from "@prisma/client";
import { queryHorarios } from "../services/informes.js";


export type Semanas = { 
    "Lunes":number, 
    "Martes":Number, 
    "Miercoles":number, 
    "Jueves":number, 
    "Viernes":number, 
    "Sabado":number, 
    "Domingo":number
}


export interface InformeRepository { 
    getAllReserva(query:queryHorarios):Promise<Semanas>; 
}

export class PrismaInformeRepository implements InformeRepository
{ 
    private prisma:PrismaClient; 

    constructor (Prisma:PrismaClient) 
    { 
        this.prisma=Prisma; 
    }; 

    private include = {
        disponibilidad: {
          include: {
            disciplina: true,
            dias: true,
            cancha: {
                include: {
                  establecimiento: true,
                },
              },
          },
        },
        pagoReserva: true,
        pagoSenia: true,
      };
    

    async getAllReserva(query:queryHorarios):Promise<Semanas>
    { 
        
        const diasSemana= { 
            'Lunes':0, 
            'Martes':0, 
            'Miercoles':0, 
            'Jueves':0, 
            'Viernes':0, 
            'Sabado':0,
            'Domingo':0
        }
        const reserva=await this.prisma.reserva.findMany({ 
            where: {disponibilidad: 
            { 
                cancha: { 
                    idEstablecimiento:query.idEst
                }
            }},
            include:this.include
        }) 
        const reservaHorarios=reserva.filter((res)=>res.disponibilidad.horaInicio>=query.horaInicio && res.disponibilidad.horaInicio<=query.horaFinal
        && res.disponibilidad.horaFin>=query.horaInicio && res.disponibilidad.horaFin<=query.horaFinal
        )
        reservaHorarios.forEach((element)=>element.disponibilidad.dias.forEach((x)=>
        { 
          switch(x.dia) 
          { 
            case "Lunes": 
                diasSemana.Lunes=diasSemana.Lunes+1; 
                break; 
            case "Martes":
                diasSemana.Martes=diasSemana.Martes+1; 
                break; 
            case "Miércoles": 
                diasSemana.Miercoles=diasSemana.Miercoles+1; 
                break; 
            case "Jueves":
                diasSemana.Jueves=diasSemana.Jueves+1; 
                break; 
            case "Viernes": 
                diasSemana.Jueves=diasSemana.Jueves+1; 
                break; 
            case "Sábado":
                    diasSemana.Sabado=diasSemana.Sabado+1; 
                    break; 
            case "Domingo":
                    diasSemana.Domingo=diasSemana.Domingo+1; 
                    break; 
          }
        }))  
        console.log("reserva", reserva);         
        return diasSemana; 
    
    }
}
