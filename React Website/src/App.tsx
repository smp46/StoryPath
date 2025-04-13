import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import "./App.css";

import Layout from "./components/Layout";
import Home from "./components/Home";
import Projects from "./components/Projects";
import Project from "./components/Project";
import Preview from "./components/Preview";
import Location from "./components/Location";
import Locations from "./components/Locations";
import NotFound from "./components/NotFound";
import {DarkModeProvider} from "./components/DarkModeContext";

/**
 * Main App Component
 *
 * Wraps the whole project in a BrowserRouter and DarkModeProvider.
 */
function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="locations" element={<Locations />} />
            <Route path="preview" element={<Preview />} />
            <Route path="locations/edit" element={<Location />} />
            <Route path="create/project" element={<Project />} />
            <Route path="create/location" element={<Location />} />
            <Route path="projects/edit" element={<Project />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
