import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/LogInPage/LogIn";
import HomePage from "./pages/HomePage/HomePage";
import NewEstab from "./pages/NewEstab/NewEstab";
import SuscriptionOptionPage from "./pages/SuscriptionOptionPage/SuscriptionOptionPage";
import AdmPage from "./pages/AdmPage/AdmPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EstablecimientosPage from "./pages/EstablecimientosPage/EstablecimientosPage";
import { CurrentAdminProvider } from "./hooks/useCurrentAdmin";
import { ChakraProvider } from "@chakra-ui/react";
import EditEstab from "./pages/EditEstab/EditEstab";
import PerfilPage from "./pages/PerfilPage/PerfilPage";
import NewCourt from "./pages/NewCourt/NewCourt";
import NotFound from "./pages/NotFoundPage/NotFound";
import EditCourt from "./pages/EditCourt/EditCourt";
import { theme } from "./themes";
import Layout from "./pages/Layout/Layout";
import CourtPage from "./pages/CourtPage/CourtPage";
import InfoEstab from "./pages/InfoEstab/InfoEstab"

const routes = [
  {
    path: "/",
    element: <Navigate to={"/landing"} />,
  },
  {
    path: "/landing",
    element: <HomePage />,
  },
  {
    path: "/suscripciones",
    element: <SuscriptionOptionPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/administrador/:idAdmin",
    element: <EstablecimientosPage />,
  },
  {
    path: "/administrador/:idAdmin/nuevoEstablecimiento",
    element: <NewEstab />,
  },
  {
    path: "/register",
    element: <AdmPage />,
  },
  {
    path: "/establecimiento/:idEst/info/editar",
    element: <EditEstab />,
  },
  {
    path: "/establecimiento/:idEst/info",
    element: <InfoEstab/>,
  },
  {
    path: "/perfil", //provisorio
    element: <PerfilPage />,
  },
  {
    path: "/establecimiento/:idEst/canchas", //provisorio
    element: <CourtPage />,
  },
  {
    path: "/establecimiento/:idEst/canchas/nuevaCancha", //provisorio
    element: <NewCourt />,
  },
  {
    path: "/establecimiento/:idEst/canchas/:idCancha", //provisorio
    element: <EditCourt />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: routes,
  },
]);
const queryClient = new QueryClient();

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CurrentAdminProvider>
          <RouterProvider router={router} />
        </CurrentAdminProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
