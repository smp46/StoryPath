# A vite .env file is required in the following format:
VITE_JWT_TOKEN=""
VITE_API_BASE_URL=""
VITE_USERNAME=""
VITE_AI_PROVIDER=openai 
VITE_OPENAI_API_KEY=
VITE_OPENAI_MODEL=gpt-4o-mini


# Overview of Generative AI Usage in this Project

## Generative AI (ChatGPT 4o) has been used to do the following:
* Generate the StoryPath Logo featured in the header and favicon.
* To iterate and draft styles and layouts for the UI.
* Draft some TSDoc function docstrings, which were then manually verified and edited for accuracy.
* Write some inline comments, although most were written by myself.
* To give examples and help understand Typescript and React functions and how they would be used generally.
* To debug and modify code that I had tried to get working already myself.
* To discover React components like React-To-Print and React-QRCode-Logo.

# Advanced Features:

## "StoryReview" AI Feedback for each project
* Using the ChatGPT 4o-mini the project object is passed with a specific prompt to the LLM and feedback is 
provided in a user-friendly window. Can be accessed by the "StoryReview" button on each project on the project page.

## "StoryEnhance" AI rewrite feature for each project
* When editing an existing project a magic wand appears at the top right of the form, clicking will show an overlay while processing
and once finished the form will then be rewritten with enhanced detail courtesy of GPT 4o-mini.

