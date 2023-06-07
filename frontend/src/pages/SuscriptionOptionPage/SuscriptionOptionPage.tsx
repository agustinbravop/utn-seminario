import React from "react";
import { Card } from "react-bootstrap";
import TopMenu from "../../components/TopMenu";
import {Rocket} from 'react-bootstrap-icons';
import {Shop} from 'react-bootstrap-icons';
import {Buildings} from 'react-bootstrap-icons';
//revisar iconos

function SuscriptionOptionPage() {
  type local = {
    icon: React.ReactNode;
    tipo: string;
    price: number;
    countEst: number;
    countEmp: number;
  };

  const opc: local[] = [
    {
      icon: <Shop fill="#47A992" size={90} />,
      tipo: "Startup",
      price: 1999.00,
      countEst: 1,
      countEmp: 0,
    },
    {
      icon: <Buildings fill="#47A992" size={90}/>,
      tipo: "Premium",
      price: 3999.00,
      countEst: 5,
      countEmp: 10,
    },
    {
      icon: <Rocket fill="#47A992" size={90}/>,
      tipo: "Enterprise",
      price: 8999,
      countEst: 15,
      countEmp: 50,
    },
  ];

  //Agregar ternario para controlar empleados
  const cards = opc.map((o) => {
    return (
      <Card
        bg="light"
        key="light"
        text="dark"
        style={{ width: "14rem" }}
        className="mb-2 mt-4 pt-2"
      >
        <Card.Header style={{textAlign:"center"}}>
          {o.icon}
        </Card.Header>
        <Card.Body style={{textAlign:"center"}}>
          <Card.Title>{o.tipo}</Card.Title>
          <Card.Text>
            <b style={{fontSize:"30px"}}>${o.price}</b>
            <br />
            por mes <br />
            {o.countEst} establecimientos
          </Card.Text>
        </Card.Body>
      </Card>
    );
  });

  return (
    <div>
      <TopMenu />
      <div
        className="row"
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "5px",
        }}
      >
        {cards}
      </div>
    </div>
  );
}

export default SuscriptionOptionPage;
