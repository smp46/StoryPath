import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { MdEditNote, MdLocationOn, MdDeleteForever } from "react-icons/md";
import { FaMobileAlt } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import * as api from "./API";
import Assistant from "./Assistant";

/**
 * Projects Component
 *
 * Provides a list of projects created by the user.
 * Each list item has options to edit, view locations, preview, get feedback on and delete the project.
 */
function Projects() {
  // Init states to store the projects, loading status, and error message and assistant status.
  const [projects, setProjects] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssistant, setAssistant] = useState<boolean>(false);

  // Track the project ID for the assistant
  const [activeAssistantProject, setAssistantProject] = useState<string | null>(
    null,
  );

  // Init the navigation component to direct to other pages.
  const navigate = useNavigate();

  // Function to delete a project by its ID.
  const deleteProject = async (projectId: string) => {
    try {
      await api.deleteProject(projectId);
      setLoading(true);
    } catch {
      console.log("Delete failed");
    }
  };

  // Fetch the projects associated with the current user.
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [loading]);

  return (
    <>
      <Helmet>
        <title>My Projects</title>
      </Helmet>
      <div
        className="container mx-auto bg-gray-100 p-6 dark:bg-lighterGrey dark:text-white"
        style={{ minHeight: "70vh" }}
      >
        <h1 className="mb-6 text-center text-3xl font-bold">My Projects</h1>

        {loading && <p>Loading projects...</p>}

        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <ul className="space-y-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <li
                  key={project.id}
                  className="hover:scale-10 flex cursor-pointer flex-col rounded border bg-white p-6 shadow hover:border-uqPurple dark:bg-darkGrey"
                >
                  {showAssistant && activeAssistantProject === project.id && (
                    <button onClick={() => setAssistant(false)}>
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                        <Assistant
                          project={project}
                          directive="feedback"
                          onResult={() => {
                            setAssistantProject(null);
                          }}
                        />
                      </div>
                    </button>
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-left text-xl font-semibold">
                        {project.title}
                      </h2>
                      <p className="text-left text-gray-700 dark:text-gray-300">
                        {project.description}
                      </p>
                    </div>
                    <p
                      className={`font-semibold ${project.is_published ? "text-green-900" : "text-red-900"}`}
                    >
                      {project.is_published ? "Published" : "Not Published"}
                    </p>
                  </div>

                  <div className="mt-6">
                    <div
                      className="flex flex-col justify-between sm:flex-row sm:space-x-2"
                      role="group"
                    >
                      <button
                        onClick={() =>
                          navigate("/projects/edit?id=".concat(project.id))
                        }
                        className="text-l w-full border border-white bg-uqPurple px-3 py-2 font-medium text-white hover:bg-purple-700 focus:ring-purple-500"
                      >
                        <MdEditNote className="mr-2 inline-block" size={15} />{" "}
                        Edit Project
                      </button>
                      <button
                        onClick={() =>
                          navigate("/locations?project_id=".concat(project.id))
                        }
                        className="text-l w-full border border-white bg-uqPurple px-3 py-2 font-medium text-white hover:bg-purple-700 focus:ring-purple-500"
                      >
                        <MdLocationOn className="mr-2 inline-block" size={15} />{" "}
                        View Locations
                      </button>
                      <button
                        onClick={() =>
                          navigate("/preview?project_id=".concat(project.id))
                        }
                        className="text-l w-full border border-white bg-uqPurple px-3 py-2 font-medium text-white hover:bg-purple-700 focus:ring-purple-500"
                      >
                        <FaMobileAlt className="mr-2 inline-block" size={15} />{" "}
                        Preview
                      </button>
                      <button
                        onClick={() => {
                          setAssistantProject(project.id);
                          setAssistant(true);
                        }}
                        className="text-l w-full border border-white bg-uqPurple px-3 py-2 font-medium text-white hover:scale-105 hover:animate-pulse hover:bg-purple-700 focus:ring-purple-500"
                      >
                        <GiBrain className="mr-2 inline-block" size={15} />{" "}
                        StoryReview&trade;
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="text-l w-full border border-white bg-uqPurple px-3 py-2 font-medium text-white hover:bg-red-700 focus:ring-red-500"
                      >
                        <MdDeleteForever
                          className="mr-2 inline-block"
                          size={15}
                        />{" "}
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p>No projects found.</p>
            )}
          </ul>
        )}

        <div className="relative p-3 text-center text-white">
          <Link to="/create/project">
            <button className="rounded-lg bg-uqPurple px-4 py-2 transition duration-300 hover:scale-110">
              New Project
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Projects;
