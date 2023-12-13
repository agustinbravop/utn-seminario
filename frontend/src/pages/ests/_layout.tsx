import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Navigate, Outlet } from "react-router-dom";

/** Si el usuario actual no es un administrador, se lo redirecciona al login. */
export default function AdminAutenticadoLayout() {
  const { isAdmin } = useCurrentAdmin();

  if (!isAdmin) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}
