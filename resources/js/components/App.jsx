import React, { useState } from 'react';
import '../../css/app.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './Home';
import HomeRec from './recruiters/HomeRec';
import Login from './recruiters/Login';
import Dashboard from './recruiters/Dashboard';
import Users from './admin/Users';
import Posts from './recruiters/posts/Posts';
import NewPost from './recruiters/posts/NewPost';
import Candidates from './recruiters/candidates/Candidates';
import Profil from './candidates/Profil';
import Enregistrement from './candidates/Enregistrement';
import Interviews from './admin/Interviews';

function App() {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    const router = createBrowserRouter([
        { path: '/', element: <Home theme={theme} toggleTheme={toggleTheme} /> },
        { path: '/login', element: <Login theme={theme} toggleTheme={toggleTheme} /> },
        { path: '/recruiter/home', element: <HomeRec theme={theme} toggleTheme={toggleTheme} /> },
        { path: '/recruiter/dashboard', element: <Dashboard theme={theme} toggleTheme={toggleTheme} /> },
        { path: '/admin/dashboard', element: <Dashboard theme={theme} toggleTheme={toggleTheme} /> },
        { path: '/admin/users', element: <Users theme={theme} toggleTheme={toggleTheme} /> },
        { path: '/recruiter/posts', element: <Posts theme={theme} toggleTheme={toggleTheme} /> },
        { path: '/recruiter/new-post', element: <NewPost theme={theme} toggleTheme={toggleTheme} /> },
        { path: '/recruiter/candidates', element: <Candidates theme={theme} toggleTheme={toggleTheme} /> },
        { path: '/profil/:postRef', element: <Profil theme={theme} toggleTheme={toggleTheme} /> },
        { path: '/enregistrement', element: <Enregistrement theme={theme} toggleTheme={toggleTheme} /> },
        { path: '/admin/interviews', element: <Interviews theme={theme} toggleTheme={toggleTheme} /> } // Ajout de la route pour les entretiens
    ]);

    return <RouterProvider router={router} />;
}

export default App;
