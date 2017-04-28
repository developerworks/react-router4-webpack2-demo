import React from 'react';
import { Link } from 'react-router-dom';

/**
 * <Nav />
 * Wraps all our child components to provide navigation on all pages.
 * This makes it simple to have a component at the index '/' route
 * of our application.
 */
const Nav = ({ children }) => (
  <div>
    <nav>
      <ul>
        <li><Link to='/'>Nav</Link></li>
        <li><Link to='/home'>Home</Link></li>
        <li><Link to='/about'>About</Link></li>
        <li><Link to='/users'>Users</Link></li>
      </ul>
    </nav>
    <main>
      { children }
    </main>
  </div>
  );

export default Nav;
