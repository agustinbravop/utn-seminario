import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import TopMenu from "../../components/TopMenu";
import { Rocket } from "react-bootstrap-icons";
import { Shop } from "react-bootstrap-icons";
import { Buildings } from "react-bootstrap-icons";
import { getSuscripciones } from "../../utils/api";
import { Suscripcion } from "../../types";
import { useNavigate } from "react-router";
//revisar iconos

const iconos = [
  <Shop fill="#47A992" size={90} />,
  <Buildings fill="#47A992" size={90} />,
  <Rocket fill="#47A992" size={90} />,
];

function SuscriptionOptionPage() {
  let [suscripciones, setSuscripciones] = useState<Suscripcion[]>();
  useEffect(() => {
    getSuscripciones()
      .then((suscripciones) => setSuscripciones(suscripciones))
      .catch((err) => console.log(err));
  }, [setSuscripciones]);

  const sus = suscripciones?.map((s, idx) => ({ icono: iconos[idx], ...s }));

  const navigate = useNavigate();

  //Agregar ternario para controlar empleados
  const cards = sus?.map((s) => {
    return (
      <Card
        bg="light"
        key="light"
        text="dark"
        style={{ width: "14rem" }}
        className="mb-2 mt-4 pt-2"
      >
        <Card.Header style={{ textAlign: "center" }}>{s.icono}</Card.Header>
        <Card.Body style={{ textAlign: "center" }}>
          <Card.Title>{s.nombre}</Card.Title>
          <Card.Text>
            <b style={{ fontSize: "30px" }}>${s.costoMensual}</b>
            <br />
            por mes <br />
            {s.limiteEstablecimientos} establecimientos
          </Card.Text>
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginLeft: "10px" }}
            onClick={() => navigate(`/register?idSuscripcion=${s.id}`)}
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
