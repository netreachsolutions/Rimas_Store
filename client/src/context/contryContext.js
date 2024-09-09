// src/context/CountryContext.js

import React, { createContext, useContext, useState } from 'react';

const CountryContext = createContext();

export const useCountry = () => {
  return useContext(CountryContext);
};

export const CountryProvider = ({ children }) => {
  const [country, setCountry] = useState('US'); // Default country

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
};
