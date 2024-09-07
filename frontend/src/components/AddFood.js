// frontend/src/components/AddFood.js
import React, { useState } from 'react';

const AddFood = () => {
  const [food, setFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/api/foods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(food),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Food added:', data);
        setFood({
          name: '',
          calories: '',
          protein: '',
          carbs: '',
          fats: '',
        });
      })
      .catch((error) => console.error('Error adding food:', error));
  };

  return (
    <div>
      <h1>Add Food</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={food.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="number"
          name="calories"
          value={food.calories}
          onChange={handleChange}
          placeholder="Calories"
          required
        />
        <input
          type="number"
          name="protein"
          value={food.protein}
          onChange={handleChange}
          placeholder="Protein"
          required
        />
        <input
          type="number"
          name="carbs"
          value={food.carbs}
          onChange={handleChange}
          placeholder="Carbs"
          required
        />
        <input
          type="number"
          name="fats"
          value={food.fats}
          onChange={handleChange}
          placeholder="Fats"
          required
        />
        <button type="submit">Add Food</button>
      </form>
    </div>
  );
};

export default AddFood;