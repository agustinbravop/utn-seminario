import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LogIn from "./pages/LogInPage/LogIn";
import NotFound from "./pages/NotFoundPage/NotFound";
import HomePage from "./pages/HomePage/HomePage";
import NewEstab from "./pages/NewEstab/NewEstab";
import SuscriptionOptionPage from "./pages/SuscriptionOptionPage/SuscriptionOptionPage";
import AdmPage from "./pages/AdmPage/AdmPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EstablecimientosPage from "./pages/EstablecimientosPage/EstablecimientosPage";

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
    element: <LogIn />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/administrador/:id",
    element: <EstablecimientosPage />
  },
  {
    path: "/administrador/:id/nuevoEstablecimiento",
    element: <NewEstab />
  },
  {
    path: "/register",
    element: <AdmPage />,
  },
];

//AGREGAR PARA QUE VAYA DIRECTO A HOME
const router = createBrowserRouter(routes);
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
