import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/api';

const activeStyle = {
  fontWeight: 'bold',
  color: '#2563eb',
  borderBottom: '2px solid #2563eb',
};

function Navbar({ setIsLoggedIn }) {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', padding: '10px 20px',gap:"2em",textDecoration:"none", borderBottom: '1px solid #ddd', alignItems: 'center' }}>
      <NavLink to="/dashboard" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Dashboard
      </NavLink>
      <NavLink to="/transactions" style={({ isActive }) => (isActive ? activeStyle : undefined)} className="ml-4">
        Transactions
      </NavLink>
      <NavLink to="/budgets" style={({ isActive }) => (isActive ? activeStyle : undefined)} className="ml-4">
        Budgets
      </NavLink>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 10 }}>Hello, {user?.username}</span>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '6px 12px',
            cursor: 'pointer',
          }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
