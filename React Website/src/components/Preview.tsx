import React, { useState, useEffect } from "react";
import * as api from "./API";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

/**
 * Preview Component
 *
 * This component provides a preview of the React-Native companion app.
 * Displays the project title, locations, and allows users to test scoring.
 */
function Preview() {
  // Get the project ID from the URL search params.
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project_id") ?? "";

  // Init states needed to provide the preview functionality.
  const [project, setProject] = useState<any>(null);
  const [locations, setLocations] = useState<Array<any>>([]);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [score, setScore] = useState<number>(0);
  const [visitedCount, setVisitedCount] = useState<number>(0);
  const [visitedIds, setVisitedIds] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On component mount, fetch the project and locations data.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProjects = await api.getProject(projectId);
        const fetchedProject = fetchedProjects.find(
          (proj: any) => proj.id == projectId,
        );
        const fetchedLocations = await api.getLocations(projectId);
        fetchedLocations.sort((a, b) => a.location_order - b.location_order);

        setProject(fetchedProject);
        setLocations(fetchedLocations);
      } catch (error) {
        setError(`Error: ${error}. Failed to load data.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function that helps simulate the scoring functionality when finding new locations.
  const handleLocationChange = (locationId: string) => {
    const selectedLocation = locations.find(
      (loc) => loc.id === parseInt(locationId),
    );
    if (selectedLocation) {
      setCurrentLocation(selectedLocation);

      if (!visitedIds.includes(locationId)) {
        if (project.participant_scoring !== "Not Scored") {
          setScore((prevScore) => prevScore + selectedLocation.score_points);
        }

        setVisitedIds((prevIds) => [...prevIds, locationId]);
        setVisitedCount((prevVisitedCount) => prevVisitedCount + 1);
      }
    }
  };

  // Render the loading state if the data is still being fetched.
  if (loading) return <div>Loading...</div>;
  // Render an error message if the data failed to load.
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <Helmet>
        <title>Preview</title>
      </Helmet>
      <div
        className="container mx-auto bg-gray-100 p-6 dark:bg-lighterGrey dark:text-white"
        style={{ minHeight: "70vh" }}
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          {project.title} - Preview
        </h1>
        <h2 className="mb-2 text-center text-xl font-bold text-black dark:text-gray-400">
          Change Location to Test Scoring:
        </h2>

        <select
          className="mb-4 w-3/6 rounded border border-gray-300 p-2 text-center dark:bg-lighterGrey"
          onChange={(e) => handleLocationChange(e.target.value)}
          value={currentLocation?.id || ""}
        >
          <option value="" disabled>
            Select a Location
          </option>
          {locations.map((location) => (
            <option
              key={location.id}
              value={location.id}
              className="items-center justify-center text-center"
            >
              {location.location_name}
            </option>
          ))}
        </select>
        <div
          className="mx-auto h-[700px] max-w-xs rounded-lg border border-gray-300 bg-white p-4 shadow-lg dark:bg-darkGrey"
          style={{ minWidth: "35vh" }}
        >
          <div className="flex h-full flex-col">
            <div className="w-full border border-uqPurple bg-uqPurple">
              <h1 className="mb-1 text-3xl font-bold text-white">
                {project.title}
              </h1>
            </div>
            {!currentLocation ? (
              <div className="flex flex-col justify-center">
                <h2 className="mt-1 items-start text-left text-2xl font-semibold">
                  Instructions
                </h2>
                <p className="mt-1 text-left text-lg">{project.instructions}</p>

                {project.homescreen_display === "Display Initial Clue" ? (
                  <>
                    <h2 className="mt-4 items-start text-left text-2xl font-semibold">
                      Initial Clue
                    </h2>
                    <p className="mt-2 text-left text-xl">
                      {project.initial_clue}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="mt-4 items-start text-left text-2xl font-semibold">
                      Locations
                    </h2>
                    <ol className="mt-2 text-left text-xl">
                      {locations.map((location) => (
                        <li key={location.id}>{location.location_name}</li>
                      ))}
                    </ol>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold">
                  {currentLocation.location_name}
                </h2>
                <p className="mt-2">{currentLocation.clue}</p>
                <div>
                  <ReactQuill
                    theme="bubble"
                    readOnly
                    value={currentLocation.location_content}
                  />
                </div>
                <p className="mt-4">Points: {currentLocation.score_points}</p>
              </div>
            )}

            <div className="mt-auto flex flex-row rounded-s bg-gray-100">
              <p className="text-l w-full border border-white bg-uqPurple px-3 py-4 font-medium text-white">
                Score: {score}
              </p>
              <p className="text-l w-full border border-white bg-uqPurple px-3 py-4 font-medium text-white">
                Locations Visited: {visitedCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Preview;
