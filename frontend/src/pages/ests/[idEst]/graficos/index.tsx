import { EstablecimientoMenu } from "@/components/navigation";
import { Bar } from 'react-chartjs-2';
import {Select, Container, HStack, Heading, Center} from "@chakra-ui/react"
import { useState} from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Console } from "console";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const horarios=[ 
    { 
        "hora":"13:00", 
        "dias":{ 
            "Lunes":10, 
            "Martes":23, 
            "Miercoles":23,
            "Jueves":30,
            "Viernes":34, 
            "Sabado":45, 
            "Domingo":30
        }
    }, 
    { 
       "hora": "14:00", 
       "dias":{ 
        "Lunes":11, 
        "Martes":56, 
        "Miercoles":23,
        "Jueves":30,
        "Viernes":34, 
        "Sabado":45, 
        "Domingo":30
    }
    },
    { 
        "hora":"15:00", 
        "dias":{ 
            "Lunes":10, 
            "Martes":23, 
            "Miercoles":23,
            "Jueves":30,
            "Viernes":34, 
            "Sabado":45, 
            "Domingo":30
        }
    }
]
export default function Bars() {
    
    
var beneficios = [72, 56, 20, 36, 80, 40,30];
var dias = ["Lunes","Martes","Miercoles","Jueves","Sabado", "Domingo"];



    const [desde, setDesde]=useState(horarios[0].hora); 
    const [hasta, setHasta]=useState(horarios[0].hora); 
    const horarioDesde=(e:React.ChangeEvent<HTMLSelectElement>) =>
    { 
       
        setDesde(e.target.value);     
    }

    const horarioHasta=(e:React.ChangeEvent<HTMLSelectElement>) => 
    { 
        setHasta(e.target.value); 
    }
    
    let filtered=horarios.filter(hora=>hora.hora>=desde && hora.hora<=hasta); 
    var dict={ 
        "Lunes":0, 
        "Martes":0, 
        "Miercoles":0, 
        "Jueves":0, 
        "Viernes":0, 
        "Sabado":0, 
        "Domingo":0, 
    }
    filtered.map(filter=> { 
        dict.Lunes=dict.Lunes+filter.dias.Lunes; 
        dict.Martes=dict.Martes+filter.dias.Martes; 
        dict.Miercoles=dict.Miercoles+filter.dias.Miercoles; 
        dict.Jueves=dict.Jueves+filter.dias.Jueves; 
        dict.Viernes=dict.Viernes+filter.dias.Viernes; 
        dict.Sabado=dict.Sabado+filter.dias.Sabado; 
        dict.Domingo=dict.Domingo+filter.dias.Domingo; 
    })
    console.log(dict)
    var misoptions = {
        responsive : true,
        animation : true,
        plugins : {
            legend : {
                display : false, 
            }, 
            title: { 
                display:true, 
                text:'Cantidad de ocupaciones por rango horarios', 
                align: 'center'
            }
        },
        
        scales : {
            y : {
                min : 0,
                max : 130
            },
            x: {
                ticks: { color: 'black'}
            }
        }
    };
    
    var midata = {
        labels: dias,
        datasets: [
            {
                label: 'Beneficios',
                data: dict,
                backgroundColor: 'rgba(0, 220, 195, 0.5)'
            }
        ]
    };
    
    return ( 
    <div>
        <div>
        <EstablecimientoMenu></EstablecimientoMenu>
        </div>

        <Container maxW="md">
            <Center>
            <Heading as='h5' size='md' style={{margin:"0.2rem"}}>Filtros de Horarios</Heading>
            </Center>
            <HStack>
            <span>DESDE:</span>
            <Select maxW="100" onChange={horarioDesde}>
                { 
                 horarios.map((hora, index)=> ( 
                 <option key={index} value={hora.hora}>{hora.hora}</option>
                 ))
                }
            
            </Select>
            <br/>
            <br/>
            <span>HASTA</span>
            <Select  maxW="100" onChange={horarioHasta}>
                { 
                 horarios.map((hora, index)=> ( 
                 <option key={index} value={hora.hora}>{hora.hora}</option>
                 ))
                }
            
            </Select>

        </HStack>
    </Container>
                <div className="bg-light mx-auto px-2 border border-2 border-primary" style={{width:"700px", height:"400px"}}>
                <Bar data={midata}  options={misoptions}/>
                </div>
   
    </div>)
}