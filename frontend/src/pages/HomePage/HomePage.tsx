import React from "react";
import Title from "../../components/Title/Title";
import "./HomePage.css";
import TopMenu from "../../components/TopMenu";
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <TopMenu />

      <div className="container col">
        <div className="header" style={{ alignContent: "end" }}>
          <button
            type="button"
            className="btn btn-outline-dark"
            style={{ marginLeft: "4px" }}
            onClick={() => navigate("/suscripciones")}
          >
            Suscripcion
          </button>

          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginLeft: "10px" }}
            onClick={() => navigate("/login")}
          >
            Iniciar Sesion
          </button>
        </div>
        <div className="content">
          <div className="title">
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
                marginTop: "20px",
              }}
            >
              <br />
              <Title style={{ fontSize: "20px" }}>
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
                onClick={() => navigate("/suscripciones")}
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
