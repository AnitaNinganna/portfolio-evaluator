import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          Developer Portfolio Evaluator
        </NavLink>

        <ul className="navbar-menu">
          <li className="navbar-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'navbar-link-active' : ''}`
              }
            >
              Home
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'navbar-link-active' : ''}`
              }
            >
              About
            </NavLink>
          </li>
          <li className="navbar-item">
            <a href="#" className="navbar-link navbar-link-secondary">
              Docs
            </a>
          </li>
          <li className="navbar-item">
            <a href="#" className="navbar-link navbar-link-secondary">
              API
            </a>
          </li>
          <li className="navbar-item">
            <button className="navbar-link navbar-button">Sign In</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;