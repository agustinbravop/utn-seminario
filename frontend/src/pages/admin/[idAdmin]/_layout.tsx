import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Navigate, Outlet } from "react-router-dom";

// Si el usuario actual no está logueado, se lo redirecciona al login.
export default function MustBeAuthenticated() {
  const { currentAdmin } = useCurrentAdmin();

  if (!currentAdmin) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
