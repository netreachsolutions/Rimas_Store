import React, { createContext, useContext, useState, useEffect } from 'react';
import Alert from '../components/Alert';

// Create the context
const AlertContext = createContext();

// Custom hook to use the Alert context
export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    message: '',
    type: 'info',
    visible: false,
  });

  const [fadeOut, setFadeOut] = useState(false);

  // Function to show alert
  const showAlert = (message, type = 'info') => {
    setAlertState({ message, type, visible: true });
    setFadeOut(false);

    // Auto hide after 10 seconds
    setTimeout(() => {
      setFadeOut(true);  // Start fade-out animation
      setTimeout(() => {
        setAlertState({ ...alertState, visible: false });
      }, 1000); // Allow 500ms for the fade-out animation before hiding the alert
    }, 5000); // Auto-hide after 10 seconds
  };

  // Function to manually hide alert
  const hideAlert = () => {
    setFadeOut(true);  // Trigger fade-out animation
    setTimeout(() => {
      setAlertState({ ...alertState, visible: false });
    }, 500);  // Give some time for the fade-out effect before hiding
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Render the alert if it's visible */}
      {alertState.visible && (
        <Alert
          message={alertState.message}
          type={alertState.type}
          onClose={hideAlert}
          fadeOut={fadeOut}  // Pass fadeOut state to Alert component
        />
      )}
    </AlertContext.Provider>
  );
};
