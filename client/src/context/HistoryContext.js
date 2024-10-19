// src/context/HistoryContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const HistoryContext = createContext();

export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState('/'); // Default to '/'

  useEffect(() => {
    // We need to keep track of the current location before it changes
    const currentLocation = location.pathname;

    return () => {
      // When location changes (on unmount), set the previous location to the current one
      setPrevLocation(currentLocation);
    };
  }, [location]);

  return (
    <HistoryContext.Provider value={{ prevLocation }}>
      {children}
    </HistoryContext.Provider>
  );
};
