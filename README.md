# StoryPath
StoryPath is a location-based experience platform built for virtual museum exhibits, interactive tours, and clue-driven treasure hunts. It includes both a React Web App for creating experiences and a React Native App for exploring them in the real world.

### Tech Stack
| Platform        | Tech Used                                                                 |
|----------------|---------------------------------------------------------------------------|
| **Frontend Web**     | React, TypeScript, Vite, Tailwind CSS, Axios                            |
| **Mobile App**       | React Native, TypeScript, Tailwind CSS, Axios, Expo                     |
| **Backend**| Provided REST API or local json-server, ChatGPT API                               |
## Website

The StoryPath web app provides a project creation interface with a REST API backend that gets shared with the app.

### Features

- Create and manage location-based projects

- Add Locations to each project, with support for custom content including images for each location.

- Print unique QR codes for each location for discovery via the mobile app

- Use a basic Preview Mode to simulate the app experience

- ChatGPT integration to enhance or get feedback on project content

### Demo

![StoryPathWebDemo](https://github.com/user-attachments/assets/d7c71fcb-fd59-46c4-b584-7867e1965597)

## Companion App

The StoryPath mobile app (React Native) enables users to play experiences created on the web platform. Once a user creates a profile (locally stored), they can browse available projects and start exploring. Locations are unlocked by physically visiting them or scanning the associated QR code. Each discovery updates the user’s score and reveals the next clue.

### Features

- Create a player profile with name and photo

- Browse and select from a list of published projects

- Follow clues to find locations

- Unlock locations by entering a geofenced area or scanning a QR code

- View your current location and unlocked spots on a map

- Track your score and progress through the experience

- See participant stats for each project/location

### Demo

![StoryPathAppDemo](https://github.com/user-attachments/assets/94144a5b-f2a2-4321-a30c-022be1a87f14)


## Setup Instructions

The app and website *can* be run locally with the caveat that the API has just been reimplemented with json-server. And the ChatGPT functionaility won't work without providing API keys in the .env file.

### Prerequisites

- Node.js (>= 18.x recommended)

- Yarn or npm

- Android Developer Studio (for emulation) or a mobile device with the Expo App installed.

#### Website Setup
```
# Clone the repo
git clone https://github.com/smp46/StoryPath.git
cd React\ Website/ 

# Install dependencies
npm install

# Start development server
npm run dev
```
This starts the web app at http://localhost:5173.

##### Mobile App Setup
```
# Clone the repo
git clone https://github.com/smp46/StoryPath.git
cd React\ Native/               

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```
You can scan the QR code from your terminal or browser to open the app on your phone using the Expo Go app.
