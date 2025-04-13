import React, { forwardRef } from "react";
import { Helmet } from "react-helmet";
import { QRCode } from "react-qrcode-logo";
import logoImg from "../assets/logo.png";

// An interface to define the props needed for the PrintLocations component.
interface PrintLocationsProps {
  locations: Array<any>;
  projectId: string;
}

/**
 * PrintLocations Component
 *
 * Takes a list of location objects and displays them in a printable format.
 */
const PrintLocations = forwardRef<HTMLDivElement, PrintLocationsProps>(
  (props, ref) => {
    const { locations, projectId } = props;

    return (
      <>
        <Helmet>
          <title>My Locations</title>
        </Helmet>
        <div
          ref={ref}
          className="container mx-auto bg-white p-6 dark:bg-lighterGrey dark:text-white"
          style={{ minHeight: "70vh" }}
        >
          <ul className="space-y-4">
            {locations.length > 0 ? (
              locations
                .filter((location) => location.project_id == projectId)
                .map((location) => (
                  <li
                    key={location.id}
                    className="hover:scale-10 flex cursor-pointer flex-col items-center rounded border bg-white p-6 shadow hover:border-uqPurple dark:bg-darkGrey"
                  >
                    <div className="rounded-lg bg-uqPurple p-2">
                      <QRCode
                        value={`Project ID: ${location.project_id} Location ID: ${location.id}`}
                        size={200}
                        logoImage={logoImg}
                        logoWidth={200}
                        logoOpacity={0.15}
                        qrStyle="dots"
                      />
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-left text-xl font-semibold">
                          {location.location_name}
                        </h2>
                      </div>
                    </div>
                  </li>
                ))
            ) : (
              <p>No locations found.</p>
            )}
          </ul>
        </div>
      </>
    );
  },
);

PrintLocations.displayName = "PrintLocations";

export default PrintLocations;
