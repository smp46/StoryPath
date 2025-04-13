import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as api from "./API";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Define the structure of the inputs for the Location form.
interface Inputs {
  project_id: number;
  location_name: string;
  location_trigger: string;
  location_position: string;
  location_order: any;
  score_points: any;
  clue: string;
  location_content: string;
}

// Define CSS classes for the form elements as global consts.
const labelClassName: string =
  "block text-left text-lg font-medium text-gray-700 dark:text-gray-400";
const descriptionClassName: string =
  "text-sm text-left text-gray-500 dark:text-gray-400";
const inputClassName: string =
  "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-uqPurple focus:border-uqPurple sm:text-sm dark:text-black sm:text-base text-sm";

/**
 * Location Component
 *
 * This component provides a form for creating or editing a location.
 * Depending on whether there is a location_id in the URL, the form will
 * either create a new location or edit an existing one.
 */
function Location() {
  // Get the project_id and location_id from the URL search params.
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project_id") ?? "";
  const locationId: string | null = searchParams.get("location_id") ?? null;

  // Init the state for the form inputs and content.
  const [inputs, setInputs] = useState<Inputs>({
    project_id: parseInt(projectId),
    location_name: "",
    location_trigger: "",
    location_position: "",
    location_order: 0,
    score_points: 0,
    clue: "",
    location_content: "",
  });

  // Init the state for loading, editing and the title of the form.
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("Create a New Location");

  // On componount mount fetch and fill the location if editing.
  useEffect(() => {
    const fetchLocation = async () => {
      if (locationId) {
        try {
          const locations = await api.getLocation(locationId);
          const location = locations[0];

          if (location) {
            setInputs({
              project_id: parseInt(projectId) || -1,
              location_name: location.location_name || "",
              location_trigger: location.location_trigger || "",
              location_position: location.location_position || "",
              location_order: location.location_order || "",
              score_points: location.score_points || "",
              clue: location.clue || "",
              location_content: location.location_content || "",
            });

            setContent(location.location_content ?? "");
            setEditing(true);
            setTitle("Edit Location");
          }
        } catch (error) {
          console.log(
            `Error: ${error} Couldn't retrieve location with id: ${locationId}`,
          );
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [loading]);

  // Handle the form input changes.
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

  // Handle the form submission.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Parse variables to complete the location object.
      inputs.location_order = parseInt(inputs.location_order);
      inputs.score_points = parseInt(inputs.score_points);
      inputs.location_content = content;

      // Make a update or create request to the API.
      if (editing) {
        await api.updateLocation(locationId as string, inputs);
      } else {
        await api.createLocation(inputs);
      }
      // Redirect to the locations page on completion.
      navigate("/locations?project_id=".concat(projectId));
    } catch (error) {
      console.error("Error submitting the form", error);
      alert("Failed to create the location");
    }
  };

  // Don't render the form until the location is loaded.
  if (loading) {
    return <p>Loading...</p>;
  }

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
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-4xl space-y-6 rounded-md bg-white p-8 shadow-md dark:bg-darkGrey"
          >
            <div>
              <label htmlFor="location_name" className={labelClassName}>
                Name
              </label>
              <p className={descriptionClassName}>The name of your location.</p>
              <input
                type="text"
                name="location_name"
                id="location_name"
                value={inputs.location_name}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Enter the name of this location"
                required
              />
            </div>

            <div>
              <label htmlFor="location_trigger" className={labelClassName}>
                Trigger
              </label>
              <p className={descriptionClassName}>
                Select what will trigger this location (by location, QR code or
                both).
              </p>
              <select
                name="location_trigger"
                id="location_trigger"
                value={inputs.location_trigger}
                onChange={handleChange}
                className={inputClassName}
                required
              >
                <option value="Location">Location</option>
                <option value="Scanning QR Codes">Scanning QR Codes</option>
                <option value="Scanning QR Codes and Location">
                  Scanning QR Codes and Location
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="location_position" className={labelClassName}>
                Coordinates
              </label>
              <p className={descriptionClassName}>
                Enter the latitude, longitude coordinates of this location in
                the format: (x,y)
              </p>
              <textarea
                name="location_position"
                id="location_position"
                value={inputs.location_position}
                onChange={handleChange}
                className={inputClassName}
                rows={1}
                placeholder="Enter location coordinates"
                required
              />
            </div>

            <div>
              <label htmlFor="score_points" className={labelClassName}>
                Points Awarded for Reaching Location
              </label>
              <p className={descriptionClassName}>
                Enter the number of points the user will get once they reach
                this location.
              </p>
              <textarea
                name="score_points"
                id="score_points"
                value={inputs.score_points}
                onChange={handleChange}
                className={inputClassName}
                rows={1}
                placeholder="Enter number of points"
                required
              />
            </div>

            <div>
              <label htmlFor="location_order" className={labelClassName}>
                Order
              </label>
              <p className={descriptionClassName}>
                In what order should this location show up. (Optional).
              </p>
              <textarea
                name="location_order"
                id="location_order"
                value={inputs.location_order}
                onChange={handleChange}
                className={inputClassName}
                rows={1}
                placeholder="Enter the place that this location will appear in"
              />
            </div>

            <div>
              <label htmlFor="clue" className={labelClassName}>
                Clue
              </label>
              <p className={descriptionClassName}>
                Enter the clue that leads to the next location.
              </p>
              <textarea
                name="clue"
                id="clue"
                value={inputs.clue}
                onChange={handleChange}
                className={inputClassName}
                rows={1}
                placeholder="Enter the clue"
              />
            </div>

            <div>
              <label htmlFor="location_content" className={labelClassName}>
                Content
              </label>
              <p className={descriptionClassName}>
                Provide additional content that will be displayed when users
                reach this location
              </p>
              <ReactQuill theme="snow" value={content} onChange={setContent} />
            </div>

            <div>
              <button
                type="submit"
                className="w-full transform rounded-md bg-uqPurple px-4 py-2 text-white shadow-sm transition-transform duration-200 hover:scale-105"
              >
                {editing ? "Edit Location" : "Create Location"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Location;
