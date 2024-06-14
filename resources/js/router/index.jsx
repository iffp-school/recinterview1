import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/utils/Layout.jsx";
import Home from "../components/Home.jsx";
import Login from "../components/recruiters/Login.jsx";
import Dashboard from "../components/recruiters/Dashboard.jsx";
import Posts from "../components/recruiters/Posts.jsx";
import Candidates from "../components/recruiters/Candidates.jsx";


export const LOGIN_ROUTE = '/login'
const ADMIN_BASE_ROUTE = '/admin'
const RECRUTEUR_BASE_ROUTE = '/recruiter'
export const ADMIN_DASHBOARD_ROUTE = ADMIN_BASE_ROUTE + '/dashboard'
export const RECRUTEUR_DASHBOARD_ROUTE = RECRUTEUR_BASE_ROUTE + '/dashboard'
export const redirectToDashboard = (roleType) => {
  switch (roleType) {
    case 'admin':
      return (ADMIN_DASHBOARD_ROUTE)
    case 'recruiter':
      return (RECRUTEUR_DASHBOARD_ROUTE)
  }
}
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home />},
      { path: '/login', element: <Login />},
      { path: RECRUTEUR_DASHBOARD_ROUTE, element: <Dashboard />},
      { path: RECRUTEUR_BASE_ROUTE+ '/posts', element: <Posts />},
      { path: RECRUTEUR_BASE_ROUTE+ '/candidates', element: <Candidates />}
    ]
  }
])