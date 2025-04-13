import React from "react";

/**
 * NotFound Component
 *
 * A basic 404 page to display when a route is not found.
 */
function NotFound() {
  return (
    <div
      className="flex items-center justify-center bg-gray-100 dark:bg-lighterGrey dark:text-white"
      style={{ minHeight: "70vh" }}
    >
      <h1 className="text-3xl">Error 404: Page Not Found</h1>
    </div>
  );
}

export default NotFound;
