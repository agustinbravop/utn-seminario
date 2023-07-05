import { useQuery } from "@tanstack/react-query";
import { Cancha } from "../../types";
import { useNavigate, useParams } from "react-router";
import TopMenu from "../../components/TopMenu/TopMenu";
import { Button } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import Courts from "../../components/Courts/Courts";
import Loading from "../../components/Loading";
import { getCanchasByEstablecimientoID } from "../../utils/api/canchas";
import Alerta from "../../components/Alerta/Alerta";

export default function CourtPage() {
  const navigate = useNavigate();
  const { idE: idEst } = useParams();
  const { data, isLoading, isError } = useQuery<Cancha[]>(
    ["canchas", idEst],
    () => getCanchasByEstablecimientoID(Number(idEst))
  );

  return (
    <div>
      <TopMenu />
      <Button
        className="btn-agregarestablecimiento"
        onClick={() => navigate("nuevaCancha")}
        variant="outline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-plus-circle-fill"
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
        </svg>{" "}
        Cancha
      </Button>
      <Button
        className="btn-agregarestablecimiento"
        onClick={() => navigate("perfil")}
        leftIcon={<SettingsIcon />}
        variant="outline"
      >
        Perfil
      </Button>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Alerta mensaje="Ha ocurrido un error inesperado" status='error' />
      ) : (
        <Courts canchas={data} />
      )}
    </div>
  );
}
