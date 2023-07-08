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
import { ChakraProvider, extendTheme, Theme } from "@chakra-ui/react";
import EditEstab from "./pages/EditEstab/EditEstab";
import PerfilPage from "./pages/PerfilPage/PerfilPage";
import NewCourt from "./pages/NewCourt/NewCourt";
import CourtPage from "./pages/CourtPage/CourtPage";
import CanchasPage from "./pages/CanchasPage/CanchasPage";
import NotFound from "./pages/NotFoundPage/NotFound";
import EditCourt from "./pages/EditCourt/EditCourt";

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
    path: "*",
    element: <NotFound />,
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
    path: "/administrador/:idAdmin/establecimiento/:idCancha/editar",
    element: <EditEstab />,
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
    path: "/canchas",
    element: <CanchasPage />,
  },
];

export const theme: Partial<Theme> = extendTheme({
  components: {
    Input: {
      variants: {
        floating: {
          field: {
            "&::placeholder": {
              color: "gray",
            },
          },
        },
      },
    },
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                transform: "scale(0.85) translateY(-24px)",
                fontWeight: "normal",
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                transform: "scale(0.85) translateY(-24px)",
                fontWeight: "normal",
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
              fontWeight: "normal",
            },
          },
        },
      },
    },
  },
});

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();
function App() {
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

export default App;
