import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/utils/Layout.jsx';
import Home from '../components/Home.jsx';
import HomeRec from '../components/recruiters/HomeRec.jsx';
import Login from '../components/recruiters/Login.jsx';
import Dashboard from '../components/recruiters/Dashboard.jsx';
import Posts from '../components/recruiters/posts/Posts.jsx';
import NewPost from '../components/recruiters/posts/NewPost.jsx';
import Candidates from '../components/recruiters/candidates/Candidates.jsx';
import Profil from '../components/candidates/Profil.jsx';
import Enregistrement from '../components/candidates/Enregistrement.jsx';

export const LOGIN_ROUTE = '/login';
const ADMIN_BASE_ROUTE = '/admin';
const RECRUTEUR_BASE_ROUTE = '/recruiter';
export const ADMIN_DASHBOARD_ROUTE = ADMIN_BASE_ROUTE + '/dashboard';
export const RECRUTEUR_HOME_ROUTE = RECRUTEUR_BASE_ROUTE + '/home';
export const redirectToDashboard = (roleType) => {
  switch (roleType) {
    case 'admin':
      return (ADMIN_DASHBOARD_ROUTE);
    case 'recruiter':
      return (RECRUTEUR_HOME_ROUTE);
  }
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: LOGIN_ROUTE, element: <Login /> },
      { path: RECRUTEUR_HOME_ROUTE, element: <HomeRec /> },
      { path: RECRUTEUR_BASE_ROUTE + '/dashboard', element: <Dashboard /> },
      { path: RECRUTEUR_BASE_ROUTE + '/posts', element: <Posts /> },
      { path: RECRUTEUR_BASE_ROUTE + '/new-post', element: <NewPost /> },
      { path: RECRUTEUR_BASE_ROUTE + '/candidates', element: <Candidates /> },
      { path: '/profil/:postRef', element: <Profil /> },
      { path: '/enregistrement', element: <Enregistrement /> },
    ]
  }
]);
