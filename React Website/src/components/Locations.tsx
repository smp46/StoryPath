import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";
import ReactToPrint from "react-to-print";
import {
  MdEditLocation,
  MdDeleteForever,
  MdOutlineQrCodeScanner,
  MdPrint,
} from "react-icons/md";
import * as api from "./API";
import logoImg from "../assets/logo.png";
import PrintLocations from "./PrintLocations";

/**
 * Locations Component
 *
 * Dispalys a list of locations for a given project and provide a set of
 * buttons to interact with each location object.
 * The user can create, edit, delete, and print locations.
 */
function Locations() {
  // Init states to store the locations, loading status, and error message.
  const [locations, setLocations] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the project ID from the URL search params.
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project_id") ?? "";

  // Init the navigation component to direct to other pages.
  const navigate = useNavigate();
  // Init the reference to the print component, needed for the ReactToPrint component.
  const printRef = useRef(null);

  // Init a state to toggle the QR code display.
  const [showQR, setShowQR] = useState(false);

  // Simple function to toggle the QR code display.
  const toggleQR = () => {
    setShowQR(!showQR);
  };
  // Function to delete a location by its ID.
  const deletelocation = async (locationId: string) => {
    try {
      await api.deleteLocation(locationId);
      setLoading(true);
    } catch {
      console.log("Delete failed");
    }
  };

  // Fetch the locations associated with the current project.
  useEffect(() => {
    const fetchlocations = async () => {
      try {
        const data = await api.getLocations(projectId);
        // Sort locations based on the location_order variable.
        data.sort((a, b) => a.location_order - b.location_order);
        setLocations(data);
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchlocations();
  }, [loading]);

  return (
    <>
      <Helmet>
        <title>My Locations</title>
      </Helmet>
      <div
        className="container mx-auto bg-gray-100 p-6 dark:bg-lighterGrey dark:text-white"
        style={{ minHeight: "70vh" }}
      >
        <div className="relative flex items-center justify-between p-3">
          <h1 className="mb-6 flex-1 text-center text-3xl font-bold">
            My Locations
          </h1>

          <ReactToPrint
            trigger={() => (
              <button className="rounded-lg pb-5 transition duration-300 hover:scale-110">
                <MdPrint className="text-black dark:text-white" size={30} />
              </button>
            )}
            content={() => printRef.current}
          />
        </div>

        {loading && <p>Loading locations...</p>}

        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <ul className="space-y-4">
            {locations.length > 0 ? (
              locations
                .filter((location) => location.project_id == projectId)
                .map((location) => (
                  <li
                    key={location.id}
                    className="flex cursor-pointer flex-col rounded border bg-white p-6 shadow hover:border-uqPurple dark:bg-darkGrey"
                  >
                    <div className="max-h-1 min-h-1 min-w-1 max-w-1">
                      {showQR && (
                        <button onClick={toggleQR}>
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                            <div className="rounded-lg bg-uqPurple p-2">
                              <QRCode
                                value={"Project ID: "
                                  .concat(location.project_id)
                                  .concat(" Location ID: ")
                                  .concat(location.id)}
                                size={300}
                                logoImage={logoImg}
                                logoWidth={300}
                                logoOpacity={0.15}
                                qrStyle="dots"
                              />
                            </div>
                          </div>
                        </button>
                      )}
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-left text-xl font-semibold">
                          {location.location_name}
                        </h2>
                        <p className="text-left text-gray-700 dark:text-gray-400">
                          Clue: {location.clue}
                          <br />
                          Position: {location.location_position}
                          <br />
                          Points: {location.score_points}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div
                        className="flex flex-col justify-between sm:flex-row sm:space-x-2"
                        role="group"
                      >
                        <button
                          onClick={() =>
                            navigate(
                              "/locations/edit?location_id="
                                .concat(location.id)
                                .concat("&project_id=")
                                .concat(projectId),
                            )
                          }
                          className="text-l w-full border border-white bg-uqPurple px-3 py-2 font-medium text-white hover:bg-purple-700 focus:ring-purple-500"
                        >
                          <MdEditLocation
                            className="mr-2 inline-block"
                            size={15}
                          />{" "}
                          Edit location
                        </button>

                        <button
                          onClick={toggleQR}
                          className="text-l w-full border border-white bg-uqPurple px-3 py-2 font-medium text-white hover:bg-purple-700 focus:ring-purple-500"
                        >
                          <MdOutlineQrCodeScanner
                            className="mr-2 inline-block"
                            size={15}
                          />{" "}
                          View QR Code
                        </button>

                        <button
                          onClick={() => deletelocation(location.id)}
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
              <p>No locations found.</p>
            )}
          </ul>
        )}

        <div className="relative flex flex-col justify-center p-3 text-center text-white sm:flex-row sm:space-x-2">
          <button
            onClick={() =>
              navigate("/create/location?project_id=".concat(projectId))
            }
            className="rounded-lg bg-uqPurple px-4 py-2 transition duration-300 hover:scale-110"
          >
            New Location
          </button>
          <div className="hidden">
            <PrintLocations
              ref={printRef}
              locations={locations}
              projectId={projectId}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Locations;
