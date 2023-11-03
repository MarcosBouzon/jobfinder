import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import "./App.css";
import Applied from "./pages/Applied";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "applied", element: <Applied /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
