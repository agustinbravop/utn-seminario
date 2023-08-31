import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { useParams } from "@/router";
import { Navigate, Outlet } from "react-router-dom";

// Si el usuario actual no está logueado o no es un administrador, se lo redirecciona a Not Found.
export default function AdminAutenticadoLayout() {
  const { isAdmin, admin } = useCurrentAdmin();
  const { idAdmin } = useParams("/admin/:idAdmin");

  if (!isAdmin || admin.id !== Number(idAdmin)) {
    return <Navigate to="/404" />;
  }

  return <Outlet />;
}
