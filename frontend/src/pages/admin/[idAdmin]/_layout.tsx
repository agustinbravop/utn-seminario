import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Navigate, Outlet } from "react-router-dom";

/** Si el usuario actual no está logueado o no es un administrador, se lo redirecciona a Not Found. */
export default function AdminAutenticadoLayout() {
  const { isAdmin } = useCurrentAdmin();

  if (!isAdmin) {
    return <Navigate to="/404" />;
  }

  return <Outlet />;
}
