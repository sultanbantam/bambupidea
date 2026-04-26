import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Leaf, Bot, Hammer, User } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <main className="page-container">
        {children}
      </main>
      <nav className="bottom-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/lifecycle" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Leaf size={24} />
          <span>Lifecycle</span>
        </NavLink>
        <NavLink to="/ai" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Bot size={24} />
          <span>AI</span>
        </NavLink>
        <NavLink to="/build" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Hammer size={24} />
          <span>Build</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
