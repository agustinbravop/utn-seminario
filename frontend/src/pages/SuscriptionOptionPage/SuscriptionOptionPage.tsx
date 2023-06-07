import React from "react";
import { Card } from "react-bootstrap";
import TopMenu from "../../components/TopMenu";
import "react-icons/bi";
//revisar iconos

function SuscriptionOptionPage() {
  type local = {
    icon: string;
    tipo: string;
    price: number;
    countEst: number;
    countEmp: number;
  };

  const opc: local[] = [
    {
      icon: "bi bi-shop-window",
      tipo: "Startup",
      price: 1999,
      countEst: 1,
      countEmp: 0,
    },
    {
      icon: "bi bi-buildings",
      tipo: "Premium",
      price: 3999,
      countEst: 5,
      countEmp: 10,
    },
    {
      icon: "bi bi-rocket",
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
        style={{ width: "18rem" }}
        className="mb-2"
      >
        <Card.Header>
          <i className={o.icon}></i>
        </Card.Header>
        <Card.Body>
          <Card.Title>{o.tipo}</Card.Title>
          <Card.Text>
            <b>{o.price}</b>
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
