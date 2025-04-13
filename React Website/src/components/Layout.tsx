import React from "react";
import { Outlet, Link } from "react-router-dom";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import favicon from "../assets/logo.ico";
import { Helmet } from "react-helmet";
import logo from "../assets/logo.png";
import { useDarkMode } from "./DarkModeContext";

/**
 * Layout Component
 *
 * Provides the header, footer layout for the project.
 * Includes the website favicon and dark mode toggle.
 */
function Layout() {
  // Init the darkMode context and state.
  const { darkMode, setDarkMode } = useDarkMode();
  return (
    <>
      <Helmet>
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <div className="rounded-none border shadow-md">
        <header className="bg-white shadow-md dark:bg-darkGrey">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
              <Link to="/">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  StoryPath
                </h1>
              </Link>
            </div>
            <nav className="flex space-x-6">
              <Link
                to="/projects"
                className="transform transition-transform duration-200 hover:scale-110 hover:text-uqPurple dark:text-white"
              >
                Projects
              </Link>
            </nav>
          </div>
        </header>
        <Outlet />
        <footer className="bg-uqPurple text-white shadow-md dark:bg-darkGrey">
          <div className="container mx-auto flex items-center justify-between px-4 py-6">
            <p className="text-sm">
              &copy; 2024 StoryPath. Developed for COMP2140 by Samuel Paynter.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="transition hover:scale-150"
              >
                {darkMode ? (
                  <MdDarkMode size={20} />
                ) : (
                  <MdLightMode size={20} />
                )}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Layout;
