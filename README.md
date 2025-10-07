# Rentflow360

A modern, responsive real estate application built with **React**, **Vite**, **Firebase**, and **Material-UI (MUI)**. Users can browse properties, view detailed information, save favorites, and book property viewings. The platform supports multiple user roles (guest, buyer/renter, agent, admin) with dashboards tailored to each role.

---

## Table of Contents

* [Demo](#demo)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Setup Instructions](#setup-instructions)
* [Project Structure](#project-structure)
* [Design Notes](#design-notes)
---

## Demo

>https://rentflow360internproject.onrender.com/

---

## Features

### Property Listings

* **Page 1:** Display property photo, price, location, and size.
* **Page 2:** Full property details including description, amenities, contact info, and safety tips.
* **Page 3:** Full-page zoomed photo view with watermark.

### Search & Filters

* Search by location, property type, price, bedrooms, and amenities.
* Smart matching to return relevant results even with partial or messy input (e.g., “1-bedroom Kasarani” vs “one-bedroom Kasarani”).

### User Roles

* **Guest:** Browse, search, and view listings.
* **Registered User (Buyer/Renter):** Save favorites, set alerts, contact sellers, leave reviews, report ads.
* **Agent/Seller:** Create, manage, and track listings. Upload photos and details.
* **Admin:** Approve/reject listings, manage users, handle reports, view analytics.

### Dashboards

* **User Dashboard:** Saved listings, notifications, and account settings.
* **Agent Dashboard:** Manage inquiries and listings with status indicators.
* **Admin Dashboard:** User management, listing moderation, and analytics.

### Other Features

* Real-time updates with Firebase Firestore.
* Favorite properties with real-time saving.
* Book property viewings.
* Responsive design across mobile, tablet, and desktop.
* Safety tips included for every property.
* Accessible UI with clear typography and intuitive navigation.

---

## Tech Stack

* **Frontend:** React 18, Vite, React Router DOM, Material-UI
* **Backend / Database:** Firebase Firestore
* **Authentication:** Firebase Authentication
* **Hosting:** GitHub Pages, Vercel, or Netlify
* **Icons:** Material-UI Icons, Lucide React

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/rentflow360.git
cd rentflow360
```

### 2. Install dependencies

```bash
npm install
```

### 3. Firebase Setup

* Create a Firebase project at [Firebase Console](https://firebase.google.com/).
* Enable **Firestore** and **Authentication**.
* Copy your Firebase config into `src/services/firebase.js`:

```javascript
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
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production

```bash
npm run build
```

### 6. Serve production build (Optional)

```bash
npm run start
```

> Ensure `serve` is installed (`npm install serve --save-dev`) and the `start` script is set in `package.json`.

---

## Project Structure

```
src/
├─ assets/                  # Images, icons, and static assets
├─ components/              # Reusable UI components
│  ├─ admin/                # Admin dashboard components
│  ├─ agent/                # Agent dashboard components
│  ├─ auth/                 # Login, Signup, and Auth components
│  ├─ dashboard/            # User dashboards
│  ├─ home/                 # Home page sections
│  ├─ layout/               # Header, Footer, Layout
│  ├─ properties/           # Property card and property listing components
│  └─ user/                 # User-specific components
├─ contexts/                # React Context (Auth)
├─ pages/                   # Pages for routing (PropertyDetailsPage, HomePage, etc.)
├─ services/                # Firebase config and helper functions
├─ utils/                   # Utility functions
├─ App.jsx                  # Main component with routes
├─ index.css                # Global styles
└─ main.jsx                 # React entry point
```

---

## Design Notes

* **Responsive Layout:** MUI Grid and Box adjust content for all screen sizes.
* **Property Cards:** Hover zoom effect for images, rounded corners, overlay favorite button.
* **Typography:** Clear hierarchy with `h4`, `h5`, `h6` for headings and subtitles.
* **Favorites:** Real-time saving in Firestore.
* **Buttons:** Accessible, large, with hover effects for primary actions.
* **Safety Tips:** Included for each property listing.
* **Dashboard:** Role-based features with clean navigation.

---



