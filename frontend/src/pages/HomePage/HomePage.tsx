import React from "react";
import Title from "../../components/Title/Title";
import "./HomePage.css";
import TopMenu from "../../components/TopMenu";

function HomePage() {
  return (
    <div>
      <TopMenu />
      <div className="container col">
        <div className="header">
          <button
            type="button"
            className="btn btn-outline-dark"
            style={{ marginLeft: "4px" }}
          >
            Suscripcion
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginLeft: "10px" }}
          >
            Iniciar Sesion
          </button>
        </div>
        <div className="content">
          <div>
            <Title
              style={{
                width: "500px",
                marginTop: "20px",
                display: "flex",
                alignContent: "center",
              }}
            >
              Reserva una cancha desde donde quieras
            </Title>
          </div>
          <div className="subcontent" style={{ width: "400px" }}>
            <p>
              Encontrá tu cancha preferida para jugar con tus amigos de entre
              más de mil establecimientos
            </p>
          </div>
          <button
            type="button"
            className="btn btn-danger"
            style={{ backgroundColor: "#FF604F" }}
          >
            Buscar
          </button>
          <div className="footer">
            <div className="row" id="figuras">
              <div className="col1" id="fig1"></div>
              <div className="col2" id="fig2"></div>
            </div>
            <div
              className="footerContent row"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <Title style={{ fontSize: "25px" }}>
                ¿Queres publicitar tu Establecimiento?
              </Title>
              <p>
                Campo de Juego te permite administrar las reservas de <br /> tus
                canchas, aceptar pagos a través de Mercado Pago,
                <br /> ver reportes de ingresos y mucho más.{" "}
              </p>
              <button
                type="button"
                className="btn btn-danger"
                style={{ backgroundColor: "#FF604F", width: "15%" }}
              >
                Ver Opciones
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
