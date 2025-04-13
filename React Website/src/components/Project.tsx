import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaWandMagicSparkles } from "react-icons/fa6";
import * as api from "./API";
import Assistant from "./Assistant";

// Interface for the project form inputs.
interface Inputs {
  title: string;
  description: string;
  instructions: string;
  initial_clue: string;
  homescreen_display: string;
  participant_scoring: string;
  is_published: boolean;
}

// Define CSS classes for the form elements as global consts.
const labelClassName: string =
  "block text-left text-lg font-medium text-gray-700 dark:text-white";
const descriptionClassName: string =
  "text-sm text-left text-gray-500 dark:text-gray-400";
const inputClassName: string =
  "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-uqPurple focus:border-uqPurple sm:text-base dark:text-black text-sm";

/**
 * Project Component
 *
 * Displays a form to create or edit a project, depending on if a project id is provided in the url.
 */
function Project() {
  // Define states for the form inputs, title, and assistant visibility.
  const [showPopover, setShowPopover] = useState(false);
  const [assistant, setAssistant] = useState(false);
  const [title, setTitle] = useState("Create a New Project");
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    description: "",
    instructions: "",
    initial_clue: "",
    homescreen_display: "",
    is_published: false,
    participant_scoring: "",
  });
  // Init navigation to redirect after form submission.
  const navigate = useNavigate();

  // Fetch project data based on if there is a project id in the url.
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) {
        try {
          // Update the inputs state with the existing project data.
          const projectList = await api.getProject(projectId);
          const project = projectList[0];
          setInputs({
            title: project.title || "",
            description: project.description || "",
            instructions: project.instructions || "",
            initial_clue: project.initial_clue || "",
            homescreen_display: project.homescreen_display || "",
            is_published: project.is_published || false,
            participant_scoring: project.participant_scoring || "",
          });
          // Change the title of the form to "Edit Project".
          setTitle("Edit Project");
        } catch {
          console.log("Failed to fetch existing data");
        }
      }
    };

    fetchProject();
  }, [projectId]);

  // Function to handle the form input changes.
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;
      setInputs((prevValues) => ({
        ...prevValues,
        [name]: checked,
      }));
    } else {
      setInputs((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  // Function to handle the form submission.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Call the appropriate API function based on the title.
      if (title === "Edit Project") {
        await api.updateProject(projectId as string, inputs);
      } else {
        await api.createProject(inputs);
      }

      // Reidrect to the projects page after submission.
      navigate("/projects");
    } catch (error) {
      console.error("Error submitting the form", error);
      alert("Failed to create the project");
    }
  };

  // Function to handle the enhanced project data from the assistant.
  const handleResult = (enhanced: Inputs) => {
    setInputs(enhanced);
    setAssistant(false);
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div
        className="bg-gray-100 py-8 dark:bg-lighterGrey dark:text-white"
        style={{ minHeight: "70vh" }}
      >
        <div className="container mx-auto">
          <h1 className="mb-6 text-center text-3xl font-bold">{title}</h1>
          <div className="relative mx-auto max-w-4xl">
            {assistant && (
              <button onClick={() => setAssistant(false)}>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                  <Assistant
                    project={inputs}
                    directive="enhance"
                    onResult={handleResult}
                  />
                </div>
              </button>
            )}

            {title === "Edit Project" && (
              <button
                className="absolute right-4 top-4 z-10 text-uqPurple"
                onMouseEnter={() => setShowPopover(true)}
                onMouseLeave={() => setShowPopover(false)}
                onClick={() => setAssistant(true)}
              >
                <FaWandMagicSparkles
                  className="text-uqPurple transition hover:scale-125"
                  size={30}
                />
              </button>
            )}

            {showPopover && (
              <div className="absolute right-12 top-3 z-10 w-auto -translate-x-3 rounded-md bg-uqPurple p-2 text-sm text-white shadow-lg">
                Enhance with StoryEnhance&trade; AI
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="relative space-y-6 rounded-md bg-white p-8 shadow-md dark:bg-darkGrey"
            >
              <div>
                <label htmlFor="title" className={labelClassName}>
                  Title
                </label>
                <p className={descriptionClassName}>
                  The name of your project.
                </p>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={inputs.title}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="Enter your project title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className={labelClassName}>
                  Description
                </label>
                <p className={descriptionClassName}>
                  A short description of your project, can be optionally
                  displayed on the project page.
                </p>
                <textarea
                  name="description"
                  id="description"
                  value={inputs.description}
                  onChange={handleChange}
                  className={inputClassName}
                  rows={3}
                  placeholder="Enter project description"
                  required
                />
              </div>

              <div>
                <label htmlFor="instructions" className={labelClassName}>
                  Instructions
                </label>
                <p className={descriptionClassName}>
                  Details on how to get started on the tour.
                </p>
                <textarea
                  name="instructions"
                  id="instructions"
                  value={inputs.instructions}
                  onChange={handleChange}
                  className={inputClassName}
                  rows={3}
                  placeholder="Enter project instructions"
                />
              </div>

              <div>
                <label htmlFor="initial_clue" className={labelClassName}>
                  Initial Clue
                </label>
                <p className={descriptionClassName}>
                  The first clue on your tour or story.
                </p>
                <textarea
                  name="initial_clue"
                  id="initial_clue"
                  value={inputs.initial_clue}
                  onChange={handleChange}
                  className={inputClassName}
                  rows={3}
                  placeholder="Enter the initial clue"
                />
              </div>

              <div>
                <label htmlFor="homescreen_display" className={labelClassName}>
                  Homescreen Display
                </label>
                <p className={descriptionClassName}>
                  Choose what to display on the homescreen of the project.
                </p>
                <select
                  name="homescreen_display"
                  id="homescreen_display"
                  value={inputs.homescreen_display}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                >
                  <option value="Display Initial Clue">
                    Display Initial Clue
                  </option>
                  <option value="Display All Locations">
                    Display All Locations
                  </option>
                </select>
              </div>

              <div>
                <label htmlFor="participant_scoring" className={labelClassName}>
                  Participant Scoring
                </label>
                <p className={descriptionClassName}>
                  Choose how users will score/progress along your StoryPath.
                </p>
                <select
                  name="participant_scoring"
                  id="participant_scoring"
                  value={inputs.participant_scoring}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                >
                  <option value="Not Scored">Not Scored</option>
                  <option value="Number of Scanned QR Codes">
                    Number of Scanned QR Codes
                  </option>
                  <option value="Number of Locations Entered">
                    Number of Locations Entered
                  </option>
                </select>
              </div>

              <div className="flex items-start">
                <div className="flex h-10 items-center">
                  <input
                    type="checkbox"
                    name="is_published"
                    id="is_published"
                    checked={inputs.is_published}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-uqPurple focus:ring-uqPurple"
                  />
                </div>
                <div className="ml-3 text-left text-sm">
                  <label
                    htmlFor="is_published"
                    className="font-medium text-gray-600 dark:text-white"
                  >
                    Public
                  </label>
                  <p className="darK:text-gray-400 text-gray-500">
                    Make this project public on creation.
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full transform rounded-md bg-uqPurple px-4 py-2 text-white shadow-sm transition-transform duration-200 hover:scale-105"
                >
                  {title}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Project;
