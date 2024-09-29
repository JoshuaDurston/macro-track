// frontend/src/components/FoodList.js
import React, { useEffect, useState } from 'react';

const FoodList = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetch('/api/foods')
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Food List</h1>
      <ul>
        {foods.map((food) => (
          <li key={food._id}>
            {food.name} - {food.calories} calories
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodList;