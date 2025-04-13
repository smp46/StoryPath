import React, { createContext, useState } from "react";

// Create a context to store the location ID.
export const LocationContext = createContext();

/**
 * Provider component for the LocationContext.
 *
 * @param {React.Component} props.children - The child components to render.
 * @returns {React.Component} - The LocationProvider component.
 */
export const LocationProvider = ({ children }) => {
  const [locationId, setLocationId] = useState(null);

  const saveLocationId = (id) => {
    setLocationId(id);
  };

  return (
    <LocationContext.Provider value={{ locationId, saveLocationId }}>
      {children}
    </LocationContext.Provider>
  );
};
