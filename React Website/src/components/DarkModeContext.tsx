import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for dark mode
const DarkModeContext = createContext<any>(null);

// Init a useContext for the DarkModeContext
export const useDarkMode = () => {
  return useContext(DarkModeContext);
};

/**
 * DarkModeProvider Component
 *
 * This component provides a context for managing dark mode state site wide.
 */
export const DarkModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Load initial dark mode state if stored in local storage
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true"); // Save dark mode preference
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
