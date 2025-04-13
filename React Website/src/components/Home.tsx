import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import background from "../assets/map.png";

/**
 * Home Component
 *
 * The homepage for the StoryPath project.
 * Contains a background image and a getting started button.
 */
function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>StoryPath</title>
      </Helmet>
      <div
        className="relative flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${background})`, minHeight: "70vh" }}
      >
        <div className="absolute inset-0 bg-black opacity-50 dark:opacity-90"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="mb-4 text-5xl font-bold">
            Create your Story with StoryPath
          </h1>
          <p className="mx-auto mb-6 max-w-xl text-xl">
            Exciting interactive tours, hunts and adventures at the tip of your
            fingers.
          </p>
          <button
            onClick={() => navigate("/create/project")}
            className="rounded-lg bg-uqPurple px-4 py-2 transition duration-300 hover:scale-110"
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
