import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { useParams } from "@/router";
import { useEstablecimientoByID } from "@/utils/api";
import { Navigate, Outlet } from "react-router-dom";

/** Si el usuario no es el administrador del establecimiento, se lo redirecciona al login. */
export default function AdminDelEstablecimientoLayout() {
  const { isAdmin, admin } = useCurrentAdmin();
  const { idEst } = useParams("/ests/:idEst");
  const { data } = useEstablecimientoByID(Number(idEst));

  if (!isAdmin) {
    return <Navigate to="/auth/login" />;
  }
  // Es necesario esperar al establecimiento del back end para validar si es del admin.
  if (data && data.idAdministrador !== admin.id) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}
