import React from "react";
import useFetch from "../../hooks/useFetch";
import TopMenu from "../../components/TopMenu";
import AgregarEstablecimiento from "../../components/AgregarEstablecimiento";
import Establecimientos from "../../components/Establecimientos";
import { urlApiEstablecimientos } from "../../utils/constants";
import { getSuscripciones } from "../../utils/api";
import { useLocation, useNavigate, useParams } from "react-router";
import "./EstablecimientosPage.scss";
import { Button } from "react-bootstrap";

export default function EstablecimientosPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const establecimientos = useFetch(urlApiEstablecimientos, null);

  return (
    <div>
      <TopMenu />
      <Button
        className="btn-agregarestablecimiento"
        onClick={() => navigate("nuevoEstablecimiento")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-plus-circle-fill"
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
        </svg>{" "}
        Establecimiento
      </Button>
      <Establecimientos establecimientos={establecimientos} />
    </div>
  );
}