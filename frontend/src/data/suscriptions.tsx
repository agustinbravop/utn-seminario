import {Rocket} from 'react-bootstrap-icons';
import {Shop} from 'react-bootstrap-icons';
import {Buildings} from 'react-bootstrap-icons';

type subs = {
    icon: React.ReactNode;
    tipo: string;
    price: number;
    countEst: number;
    countEmp: number;
  };
  
  const opc: subs[] = [
    {
      icon: <Shop fill="#47A992" size={90} />,
      tipo: "Startup",
      price: 1999.0,
      countEst: 1,
      countEmp: 0,
    },
    {
      icon: <Buildings fill="#47A992" size={90} />,
      tipo: "Premium",
      price: 3999.0,
      countEst: 5,
      countEmp: 10,
    },
    {
      icon: <Rocket fill="#47A992" size={90} />,
      tipo: "Enterprise",
      price: 8999,
      countEst: 15,
      countEmp: 50,
    },
  ];

  export function getAllSuscription(){
    return opc;
  }
      

