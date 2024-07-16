import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../recruiters/NavBar';

const Layout = ({ theme, toggleTheme }) => {
    return (
        <div>
            <NavBar theme={theme} toggleTheme={toggleTheme} />
            <Outlet />
        </div>
    );
};

export default Layout;
