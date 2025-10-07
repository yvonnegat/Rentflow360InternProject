# Rentflow360


A modern, responsive real estate application built with React, Firebase, and Material-UI. Users can browse properties, view detailed information, save favorites, and book property viewings.

---

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Design Notes](#design-notes)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Demo
> Add a link to your live deployed app here (e.g., Vercel, Netlify, or GitHub Pages)

---

## Features
- Browse a list of properties with images, titles, and locations
- View property details including price, description, amenities, and safety tips
- Save favorite properties (requires authentication)
- Book property viewings
- Fully responsive design for mobile, tablet, and desktop
- User authentication and management with Firebase
- Real-time updates using Firestore

---

## Tech Stack
- **Frontend:** React 18, React Router DOM, Material-UI (MUI)
- **Backend / Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Hosting:** GitHub Pages / Vercel / Netlify
- **Icons:** Material-UI Icons

---

## Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/property-listing-app.git
cd property-listing-app
Install dependencies

bash
Copy code
npm install
Firebase Setup

Create a Firebase project at https://firebase.google.com/

Enable Firestore and Authentication

Copy your Firebase config into src/services/firebase.js:

javascript
Copy code
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
Run the app locally

bash
Copy code
npm start
Open http://localhost:3000 in your browser.

Project Structure
bash
Copy code
src/
├─ components/         # Reusable UI components
│  └─ layout/          # Header, Footer, Layout
├─ contexts/           # React Context for Auth management
├─ pages/              # Pages for React Router
│  └─ PropertyDetailsPage.jsx
├─ services/           # Firebase config and API functions
├─ App.js              # Main component with routes
└─ index.js            # React entry point
Design Notes
Responsive Layout: Uses MUI Grid and Box to adjust content for mobile, tablet, and desktop.

Property Cards: Paper components with hover zoom for images, rounded corners, and overlay favorite button.

Typography: Clear hierarchy (h4, h5, h6) for headings, subtitles, and descriptions.

Favorites: Users can toggle favorites; data is saved in Firestore in real-time.

Buttons: Large, accessible buttons with hover effects for primary actions like booking and saving favorites.

Safety Tips: Included for user awareness when visiting properties.
