import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { useParams } from "@/router";
import { Navigate, Outlet } from "react-router-dom";

/** Si el usuario actual no está logueado o no es un administrador, se lo redirecciona al login. */
export default function AdminAutenticadoLayout() {
  const { isAdmin, admin } = useCurrentAdmin();
  const { idAdmin } = useParams("/admin/:idAdmin/perfil");

  if (!isAdmin || admin.id !== Number(idAdmin)) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}
