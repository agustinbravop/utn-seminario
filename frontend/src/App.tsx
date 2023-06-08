import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogIn from "./pages/LogInPage/LogIn";
import NotFound from "./pages/NotFoundPage/NotFound";
import HomePage from "./pages/HomePage/HomePage";
import NewEstab from "./pages/NewEstab/NewEstab";
import SuscriptionOptionPage from "./pages/SuscriptionOptionPage/SuscriptionOptionPage";
import AdmPage from "./pages/AdmPage/AdmPage";

const routes = [
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/suscription",
    element: <SuscriptionOptionPage />,
  },
  {
    path: "/login",
    element: <LogIn />,
  },
  {
    path: "/new-estab",
    element: <NewEstab />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/admin",
    element: <AdmPage />,
  },
];

//AGREGAR PARA QUE VAYA DIRECTO A HOME
const router = createBrowserRouter(routes);

function App() {
  return (













































































    
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
