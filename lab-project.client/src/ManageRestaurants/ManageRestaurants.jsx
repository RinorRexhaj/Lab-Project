import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    category: '',
    stars: 1,
    priceRange: 'Cheap',
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('https://localhost:7262/api/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant({
      ...newRestaurant,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7262/api/restaurants', newRestaurant);
      fetchRestaurants(); 
      setNewRestaurant({
        name: '',
        category: '',
        stars: 1,
        priceRange: 'Cheap',
      });
    } catch (error) {
      console.error('Error adding restaurant:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7262/api/restaurants/${id}`);
      fetchRestaurants(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Manage Restaurants</h2>

      {/* Form to add new restaurant */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={newRestaurant.name}
              onChange={handleInputChange}
              required
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={newRestaurant.category}
              onChange={handleInputChange}
              required
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Stars</label>
            <select
              name="stars"
              value={newRestaurant.stars}
              onChange={handleInputChange}
              className="p-2 w-full border border-gray-300 rounded"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} stars
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Price Range</label>
            <select
              name="priceRange"
              value={newRestaurant.priceRange}
              onChange={handleInputChange}
              className="p-2 w-full border border-gray-300 rounded"
            >
              {['Cheap', 'Moderate', 'Expensive', 'Very Expensive'].map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 ease-in-out"
        >
          Add Restaurant
        </button>
      </form>

      {/* List of restaurants */}
      <ul className="divide-y divide-gray-300">
        {restaurants.map((restaurant) => (
          <li key={restaurant.id} className="py-2 flex items-center justify-between">
            <div>
              <span className="font-semibold">{restaurant.name}</span> - {restaurant.category} - {restaurant.stars} stars - {restaurant.priceRange}
            </div>
            <button
              onClick={() => handleDelete(restaurant.id)}
              className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300 ease-in-out"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageRestaurants;
