import React, { useState, useEffect } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import ReactMarkdown from "react-markdown";
import { GiBrain } from "react-icons/gi";

// An interface to define the structure of a StoryPath project object.
interface Project {
  id: string,
  title: string;
  description: string;
  instructions: string;
  initial_clue: string;
  homescreen_display: string;
  participant_scoring: string;
  is_published: boolean;
}

// An interface to define the props required by the Assistant component.
interface AssistantProps {
  project: Project;
  directive: string;
  onResult: (updatedProject: Project) => void;
}

/**
 * Assistant Component
 *
 * Uses the OpenAI API to provide feedback or enhancements on a StoryPath project.
 *
 * Props:
 * - `project` (Project): A StoryPath project object containing details like title, description, instructions, etc.
 * - `directive` (string): Defines whether the assistant should provide "feedback" or "enhance" the project.
 * - `onResult` (function): Callback function to handle the result when an enhanced project is returned.
 *
 * State:
 * - `assistantResponse` (string | null): Stores the assistant's feedback when the directive is "feedback".
 * - `isLoading` (boolean): Tracks whether the assistant is processing the request.
 *
 * This component handles two modes:
 * - Feedback mode: Provides AI-generated feedback on the project.
 * - Enhance mode: Suggests improvements to the project and returns an updated project object.
 */
function Assistant({ project, directive, onResult }: AssistantProps) {
  // State variables to store the assistant's response and loading status.
  const [assistantResponse, setAssistantResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to initialize the AI provider based on given environment variables.
  const getAIProvider = (): ChatOpenAI => {
    const providerEnv = import.meta.env.VITE_AI_PROVIDER;

    if (providerEnv === "openai") {
      return new ChatOpenAI({
        openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
        model: import.meta.env.VITE_OPENAI_MODEL || "gpt-4",
        temperature: 0.7,
      });
    } else {
      throw new Error(`Unsupported AI provider: ${providerEnv}`);
    }
  };

  const feedbackTemplate = `
    You are StoryReview AI an AI Feedback assistant for StoryPath, do not provide a heading for your response just the body.
    StoryPath is a location experience platform designed to allow users to create and explore virtual museum exhibits, location-based tours, and
    treasure hunts with clues. The platform features a web app that enables users to author these experiences.
    You are given a Project object (a StoryPath experience) with the following details:
    - Title: {title}
    - Description: {description}
    - Instructions: {instructions}
    - Initial Clue: {initial_clue}
    - Homescreen Display: {homescreen_display}
    - Participant Scoring: {participant_scoring}
    - Is Published: {is_published}
    
    Provide constructive but concise feedback on this project object Your response should be no more than 100 words and should be delivered in a friendly manner. 
    Consider things like clarity, organization, and whether the instructions and clues are effective. Provide suggestions for improvements where needed.
    Deliver the response in markdown and some emojis, using text formatting (bolding, italicising, line breaks) where needed.
  `;

  const enhanceTemplate = `
    StoryPath is a location experience platform designed to allow users to create and explore virtual museum exhibits, location-based tours, and
    treasure hunts with clues. The platform features a web app that enables users to author these experiences.
    You are given a Project object (a StoryPath experience) with the following details:
    - Title: {title}
    - Description: {description}
    - Instructions: {instructions}
    - Initial Clue: {initial_clue}
    - Homescreen Display: {homescreen_display}
    - Participant Scoring: {participant_scoring}
    - Is Published: {is_published}
    
    You should enhance the Title (in less than 7 words), Description (in less than 30 words), Instructions (in less than 30 words) and Initial Clue (in less than 20 words) 
    by adding details, correcting spelling and grammar and stylising in an enthusiatic manner. All other fields must be left the same as you are given.
    Respond with a JSON object following this exact structure:
    {{
      "id": 1079,
      "title": "UQ Explore",
      "description": "Explore the University of Queensland with this fun interactive tour.",
      "is_published": true,
      "participant_scoring": "Number of Locations Entered",
      "username": "s4742372",
      "instructions": "To get started touch your toes then spin around.",
      "initial_clue": "The eye in the sky is looking pretty fly.",
      "homescreen_display": "Display Initial Clue"
    }}
    Only return json and no other text.
  `;

  const feedbackPrompt = new PromptTemplate({
    template: feedbackTemplate,
    inputVariables: [
      "title",
      "description",
      "instructions",
      "initial_clue",
      "homescreen_display",
      "participant_scoring",
      "is_published",
    ],
  });

  const enhancePrompt = new PromptTemplate({
    template: enhanceTemplate,
    inputVariables: [
      "title",
      "description",
      "instructions",
      "initial_clue",
      "homescreen_display",
      "participant_scoring",
      "is_published",
    ],
  });

  // Function to send a request to the OpenAI API with the selected prompt.
  const request = async (llm: ChatOpenAI) => {
    try {
      let formattedPrompt: any;
      // Generate the formatted prompt based on the directive prop.
      if (directive === "feedback") {
        formattedPrompt = await feedbackPrompt.format({
          title: project.title,
          description: project.description,
          instructions: project.instructions,
          initial_clue: project.initial_clue,
          homescreen_display: project.homescreen_display,
          participant_scoring: project.participant_scoring,
          is_published: project.is_published.toString(),
        });
      } else {
        formattedPrompt = await enhancePrompt.format({
          id: project.id,
          title: project.title,
          description: project.description,
          instructions: project.instructions,
          initial_clue: project.initial_clue,
          homescreen_display: project.homescreen_display,
          participant_scoring: project.participant_scoring,
          is_published: project.is_published.toString(),
        });
      }

      const chatMessages: BaseMessage[] = [new HumanMessage(formattedPrompt)];
      const response = await llm.invoke(chatMessages);

      // Handle the response based on the directive.
      if (response && response.content) {
        if (directive !== "enhance") {
          setAssistantResponse(response.content as string);
        } else {
          const responseString = response.content as string;
          const jsonString = responseString.match(/{[\s\S]*}/)?.[0];
          if (!jsonString) {
            throw new Error("No valid JSON found in the response content.");
          }
          const enhancedProject = JSON.parse(jsonString) as Project;
          // Replace ID in case LLM hallucinated a new illegal project.id
          enhancedProject.id = project.id 
          onResult(enhancedProject);
        }
      } else {
        throw new Error("Invalid response from the assistant");
      }
    } catch (error) {
      console.error("Error generating feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Call the request function when the component mounts.
  useEffect(() => {
    setIsLoading(true);
    const llmProvider = getAIProvider();
    request(llmProvider);
  }, []);

  // Render the assistant html with the feedback or enhancements.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg dark:bg-darkGrey">
        <div className="flex flex-row items-center justify-center">
          <GiBrain className="mr-2 inline-block" size={40} />
          <h1 className="mb-4 text-2xl font-bold">
            {directive === "feedback"
              ? "StoryReview™ AI Feedback"
              : "StoryEnhance™ AI Enhancements"}
          </h1>
        </div>

        {directive === "feedback" ? (
          isLoading ? (
            <p>Loading feedback...</p>
          ) : assistantResponse ? (
            <div className="response-box rounded-lg bg-gray-100 p-4 dark:text-black">
              <ReactMarkdown>{assistantResponse}</ReactMarkdown>
            </div>
          ) : (
            <p>No feedback available.</p>
          )
        ) : (
          isLoading && <p>Loading enhancements...</p>
        )}
      </div>
    </div>
  );
}

export default Assistant;
