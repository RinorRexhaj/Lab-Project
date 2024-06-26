// src/context/ShippingContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ShippingContext = createContext();

export const useShipping = () => useContext(ShippingContext);

export const ShippingProvider = ({ children }) => {
  

  return (
    <ShippingContext.Provider value={{ shippingMethods, addShippingMethod, editShippingMethod, deleteShippingMethod }}>
      {children}
    </ShippingContext.Provider>
  );
};
