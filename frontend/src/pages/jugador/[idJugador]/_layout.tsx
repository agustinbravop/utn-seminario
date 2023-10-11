import { useCurrentJugador } from "@/hooks";
import { useParams } from "@/router";
import { Navigate, Outlet } from "react-router-dom";

/** Si el usuario actual no está logueado o no es un jugador, se lo redirecciona al login. */
export default function JugadorAutenticadoLayout() {
  const { isJugador, jugador } = useCurrentJugador();
  const { idJugador } = useParams("/jugador/:idJugador");

  if (!isJugador || jugador.id !== Number(idJugador)) {
    return <Navigate to="/404" />;
  }

  return <Outlet />;
}
