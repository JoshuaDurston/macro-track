// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import DiaryPage from './components/DiaryPage';
import FoodList from './components/FoodList';
import AddFood from './components/AddFood';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<SignupPage />}/>
        <Route path="/diary" element={<DiaryPage />}/>
      </Routes>
    </Router>
  );
}

export default App;