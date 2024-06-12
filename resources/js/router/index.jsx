import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layouts/Layout.jsx";
import Home from "../components/pages/Home.jsx";


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home />}
    ]
  }
])