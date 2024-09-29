// frontend/src/App.js
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import DiaryPage from './components/DiaryPage/DiaryPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import FoodList from './components/FoodList/FoodList';
import AddFood from './components/AddFood/AddFood';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar/>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<SignupPage />}/>
          <Route path="/diary" element={<DiaryPage />}/>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;