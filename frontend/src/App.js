import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import DiaryPage from './components/DiaryPage/DiaryPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute'; // Import PrivateRoute
import NoPageFound from './components/NoPageFound/NoPageFound'; // Import NoPageFound component

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}> {/* Wrapper for all protected routes */}
            <Route path="/diary" element={<DiaryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Add other protected routes here */}
          </Route>

          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
