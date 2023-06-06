import TopMenu from "./components/TopMenu";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LogIn from "./pages/LogInPage/LogIn";
import NotFound from "./pages/NotFoundPage/NotFound";
import HomePage from "./pages/HomePage/HomePage";
import AdmPage from "./pages/AdmPage/AdmPage";

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
      <TopMenu />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
