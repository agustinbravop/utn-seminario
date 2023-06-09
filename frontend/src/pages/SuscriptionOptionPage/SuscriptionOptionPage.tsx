import React from "react";
import { Card } from "react-bootstrap";
import TopMenu from "../../components/TopMenu";
import {Rocket} from 'react-bootstrap-icons';
import {Shop} from 'react-bootstrap-icons';
import {Buildings} from 'react-bootstrap-icons';
import {getAllSuscription} from '../../data/suscriptions'
//revisar iconos

function SuscriptionOptionPage() {
  const suscriptions = getAllSuscription();

  //Agregar ternario para controlar empleados
  const cards = suscriptions.map((o) => {
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
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginLeft: "10px"}}
          >
            Continuar
          </button>
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
