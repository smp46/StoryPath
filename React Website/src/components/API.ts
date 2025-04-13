import axios from "axios";

// .ENV FILE MUST BE FILLED OUT
// Base URL for the Storypath RESTful API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// JWT token for authorization, replace with your actual token from My Grades in Blackboard
const JWT_TOKEN = import.meta.env.VITE_JWT_TOKEN;
// Your UQ student username, used for row-level security to retrieve your records
const USERNAME = import.meta.env.VITE_USERNAME;

/**
 * Helper function to handle API requests.
 * It sets the Authorization token and optionally includes the request body.
 *
 * @param endpoint - The API endpoint to call.
 * @param [method='GET'] - The HTTP method to use (GET, POST, PATCH).
 * @param [body=null] - The request body to send, typically for POST or PATCH.
 * @returns Promise  - The JSON response from the API.
 * @throws Will throw an error if the HTTP response is not OK.
 */
async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body: object | null = null,
): Promise<any> {
  if (API_BASE_URL == null || JWT_TOKEN == null || USERNAME == null) {
    throw new Error("ENVIRONMENT VARIABLES NOT PROVIDED");
    console.log("ENVIRONMENT VARIABLES NOT PROVIDED");
  }
  // Define headers separately
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${JWT_TOKEN}`,
  };

  // If the method is POST or PATCH, we want the response to include the full representation
  if (method === "POST" || method === "PATCH") {
    headers["Prefer"] = "return=representation";
  }

  // Configure Axios options
  const options = {
    method, // Set the HTTP method (GET, POST, PATCH)
    url: `${API_BASE_URL}${endpoint}`,
    headers,
    data: { ...body, username: USERNAME }, // Add body if provided
  };

  try {
    const response = await axios(options);

    return response.data;
  } catch (error: any) {
    // If the request fails, throw an error with the response status or the error message
    if (error.response) {
      throw new Error(`HTTP error! status: ${error.response.status}`);
    } else {
      throw new Error(error.message);
    }
  }
}

/**
 * Function to insert a new project into the database.
 *
 * @param project - The project data to insert.
 * @returns - The created project object returned by the API.
 */
export async function createProject(project: object): Promise<any> {
  return apiRequest("/project", "POST", project);
}

/**
 * Function to get a list of all projects associated with the current user.
 *
 * @returns {Promise<Array<any>>} - An array of project objects.
 */
export async function getProjects(): Promise<Array<any>> {
  return apiRequest("/project");
}

/**
 * Function to get a single project by its ID.
 *
 * @param id - The ID of the project to retrieve.
 * @returns - The project object matching the ID.
 */
export async function getProject(id: string): Promise<any> {
  return apiRequest(`/project?id=eq.${id}`);
}

/**
 * Function to update an existing project on the server.
 *
 * @param id - The ID of the project to update.
 * @param project - The updated project data.
 * @returns - The updated project object returned by the API.
 */
export async function updateProject(id: string, project: object): Promise<any> {
  return apiRequest(`/project?id=eq.${id}`, "PATCH", project);
}

/**
 * Function to delete an existing project on the server.
 *
 * @param id - The ID of the project to update.
 * @returns - The updated project object returned by the API.
 */
export async function deleteProject(id: string): Promise<boolean> {
  const result = await apiRequest(`/project?id=eq.${id}`, "DELETE");
  if (result) {
    return true;
  }
  return false;
}

/**
 * Function to list all locations associated with the current user.
 *
 * @returns - An array of location objects.
 */
export async function getLocations(project_id: string): Promise<Array<any>> {
  return apiRequest(`/location?project_id=eq.${project_id}`);
}

/**
 * Function to get a single location by its ID.
 *
 * @param id - The ID of the location to retrieve.
 * @returns - The location object matching the ID.
 */
export async function getLocation(id: string): Promise<any> {
  return apiRequest(`/location?id=eq.${id}`);
}

/**
 * Function to insert a new location into the database.
 *
 * @param location - The location data to insert.
 * @returns - The created location object returned by the API.
 */
export async function createLocation(location: object): Promise<any> {
  return apiRequest("/location", "POST", location);
}

/**
 * Function to delete an existing location on the server.
 *
 * @param id - The ID of the location to update.
 * @returns - A boolean value indicating success or failure.
 */
export async function deleteLocation(id: string): Promise<boolean> {
  const result = await apiRequest(`/location?id=eq.${id}`, "DELETE");
  if (result) {
    return true;
  }
  return false;
}

/**
 * Function to update an existing location on the server.
 *
 * @param id - The ID of the location to update.
 * @param location - The updated location data.
 * @returns - The updated location object returned by the API.
 * */
export async function updateLocation(
  id: string,
  location: object,
): Promise<any> {
  return apiRequest(`/location?id=eq.${id}`, "PATCH", location);
}
