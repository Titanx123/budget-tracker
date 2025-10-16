import React ,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import { isAuthenticated } from './services/api';
import Dashboard from './components/Dashboard';
import TransactionsList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Budgets from './components/Budgets';
import Navbar from './components/Navbar';

import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  return (
    <Router>
      <div className="App">
      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
      <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
      <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/transactions"
    element={
      <ProtectedRoute>
        <TransactionsList />
      </ProtectedRoute>
    }
  />
  <Route
    path="/budgets"
    element={
      <ProtectedRoute>
        <Budgets />
      </ProtectedRoute>
    }
  />
  <Route
  path="/transactions/add"
  element={
    <ProtectedRoute>
      <TransactionForm />
    </ProtectedRoute>
  }
/>
<Route
  path="/transactions/edit/:id"
  element={
    <ProtectedRoute>
      <TransactionForm />
    </ProtectedRoute>
  }
  />
  <Route path="/" element={<Navigate to="/dashboard" />} />
</Routes>

      </div>
    </Router>
  );
}

export default App;