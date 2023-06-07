import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogIn from "./pages/LogInPage/LogIn";
import NotFound from "./pages/NotFoundPage/NotFound";
import HomePage from "./pages/HomePage/HomePage";
import NewEstab from "./pages/NewEstab/NewEstab";

const routes = [
  {
    path: "/home",
    element: <HomePage />,
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
