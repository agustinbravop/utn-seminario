import { useCurrentJugador } from "@/hooks";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Navigate, Outlet } from "react-router-dom";

/** Si el usuario actual ya está logueado, se lo redirecciona a su página principal. */
export default function AlreadyAuthenticatedLayout() {
  const { isAdmin } = useCurrentAdmin();
  const { isJugador } = useCurrentJugador();

  if (isAdmin) {
    return <Navigate to="/ests" />;
  } else if (isJugador) {
    return <Navigate to="/search" />;
  }

  return <Outlet />;
}
