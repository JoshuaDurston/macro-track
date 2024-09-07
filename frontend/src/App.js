// frontend/src/App.js
import React from 'react';
import FoodList from './components/FoodList';
import AddFood from './components/AddFood';

function App() {
  return (
    <div className="App">
      <AddFood />
      <FoodList />
    </div>
  );
}

export default App;