import axios from "axios";
import { API_BASE_URL, JWT_TOKEN, API_USERNAME } from "@env";

/**
 * Helper function to handle API requests.
 * It sets the Authorization token and optionally includes the request body.
 *
 * @param endpoint - The API endpoint to call.
 * @param [method='GET'] - The HTTP method to use (GET, POST, PATCH, DELETE).
 * @param [body=null] - The request body to send, optional.
 * @returns Promise - The JSON response from the API.
 * @throws Will throw an error if the HTTP response is not OK or environemnt variables are missing.
 */
async function apiRequest(endpoint, method = "GET", body = null) {
  if (!API_BASE_URL || !JWT_TOKEN || !API_USERNAME) {
    throw new Error("ENVIRONMENT VARIABLES NOT PROVIDED");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${JWT_TOKEN}`,
  };

  if (method === "POST" || method === "PATCH") {
    headers["Prefer"] = "return=representation";
  }

  const options = {
    method,
    url: `${API_BASE_URL}${endpoint}`,
    headers,
    data: body ? { ...body, username: API_USERNAME } : undefined,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`HTTP error! status: ${error.response.status}`);
    } else {
      throw new Error(error.message);
    }
  }
}

// --------- PROJECTS API -----------
/**
 * Get a list of all projects associated with the current (api) user.
 *
 * @returns {Promise<Array<any>>} - An array of project objects.
 */
export async function getProjects() {
  return apiRequest("/project");
}

/**
 * Get a single project by its ID.
 *
 * @param id - The ID of the project to retrieve.
 * @returns {Promise<Object>} - The project object matching the ID.
 */
export async function getProject(id) {
  return apiRequest(`/project?id=eq.${id}`);
}

// --------- LOCATIONS API -----------
/**
 * Function to list all locations associated with a project.
 *
 * @param project_id - The ID of the project whose locations you want to retrieve.
 * @returns {Promise<Array<any>>} - An array of location objects.
 */
export async function getLocations(project_id) {
  return apiRequest(`/location?project_id=eq.${project_id}`);
}

/**
 * Get a single location by its ID.
 *
 * @param {string|number} id - The ID of the location to retrieve.
 * @returns {Promise<Object>} - The location object matching the ID.
 */
export async function getLocation(id) {
  return apiRequest(`/location?id=eq.${id}`);
}

// --------- TRACKING API -----------

/**
 * Gets a list all tracking records associated with the current (api) user.
 *
 * @returns {Promise<Array<Object>>} - The array of tracking objects.
 */
export async function getTracking() {
  return apiRequest("/tracking");
}

/**
 * Get all tracking records by their project ID.
 *
 * @param {string|number} id - The project ID of the tracking record to retrieve.
 * @returns {Promise<Array<Object>>} - The array of tracking objects matching the project ID.
 */
export async function getTrackingByProjectId(id) {
  return apiRequest(`/tracking?project_id=eq.${id}`);
}

/**
 * Get tracking records by participant username.
 *
 * @param {string} username - The username of the participant whose tracking records to retrieve.
 * @returns {Promise<Array<Object>>} - The array of tracking objects for the given username.
 */
export async function getTrackingByParticipantUsername(username) {
  return apiRequest(`/tracking?participant_username=eq.${username}`);
}

/**
 * Get all tracking records associated with a specific participant and project.
 *
 * @param {string} participant_username - The username of the participant.
 * @param {string|number} project_id - The ID of the project.
 * @returns {Promise<Array<Object>>} - The array of tracking objects that match the participant and project.
 */
export async function getTrackingByUserProj(participant_username, project_id) {
  return apiRequest(
    `/tracking?participant_username=eq.${participant_username}&project_id=eq.${project_id}`,
  );
}

/**
 * Insert a new tracking record into the database.
 *
 * @param {Object} trackingData - The tracking data to insert.
 * @returns {Promise<Object>} - The created tracking object returned by the API.
 */
export async function createTracking(trackingData) {
  return apiRequest("/tracking", "POST", trackingData);
}

/**
 * Update an existing tracking record on the server.
 *
 * @param {string|number} id - The ID of the tracking record to update.
 * @param {Object} trackingData - The updated tracking data.
 * @returns {Promise<Object>} - The updated tracking object returned by the API.
 */
export async function updateTracking(id, trackingData) {
  return apiRequest(`/tracking?id=eq.${id}`, "PATCH", trackingData);
}

/**
 * Delete an existing tracking record on the server.
 *
 * @param {string|number} id - The ID of the tracking record to delete.
 */
export async function deleteTracking(id) {
  await apiRequest(`/tracking?project_id=eq.${id}`, "DELETE");
  console.log("DELETED TRACKING FOR PROJECT", id);
}
