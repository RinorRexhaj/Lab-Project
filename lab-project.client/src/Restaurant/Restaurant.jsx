import React, { useState, useEffect } from 'react';
import RestaurantList from '../components/RestaurantList';
import axios from 'axios';

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('https://localhost:7262/api/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Reserve a Table</h1>
      <RestaurantList restaurants={restaurants} />
    </div>
  );
};

export default Restaurant;
