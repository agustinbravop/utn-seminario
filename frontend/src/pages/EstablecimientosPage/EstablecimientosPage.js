import useFetch from "../../hooks/useFetch";
import TopMenu from "../../components/TopMenu";
import Establecimientos from "../../components/Establecimientos";
import { urlApiEstablecimientos } from "../../utils/constants";
import { useNavigate, useParams } from "react-router";
import "./EstablecimientosPage.scss";
import { Button } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";

export default function EstablecimientosPage() {
  const navigate = useNavigate();
  const establecimientos = useFetch(urlApiEstablecimientos, null);

  return (
    <div>
      <TopMenu />
      <Button
        className="btn-agregarestablecimiento"
        onClick={() => navigate("nuevoEstablecimiento")}
        variant='outline'
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
        Establecimiento
      </Button>
      <Button
        className="btn-agregarestablecimiento"
        onClick={() => navigate("perfil")}
        leftIcon={<SettingsIcon/>}
        variant='outline'
      >
        Perfil
      </Button>
      <Establecimientos {...establecimientos} />
    </div>
  );
}
