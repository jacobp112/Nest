# Nest Finance - Core Application

**A secure, manual-entry financial dashboard for individuals, couples, and families. Built with React and Firebase.**

This repository contains the core application for Nest Finance. It is a secure, single-page application (SPA) designed to help users manually track their finances, set goals, and project their financial future. This version is built around a manual-entry system in place of automated bank linking, focusing on user control and a seamless data-entry experience.

---

## Core Features

* **Secure User Authentication:** Full login, registration, and logout functionality powered by Firebase Authentication.
* **One-Time User Onboarding:** A simple, guided setup for new users to enter their baseline monthly income and recurring expenses.
* **Financial Dashboard:** A visually stunning and information-rich dashboard serving as the user's homepage.
* **Analytics Module:** A primary donut chart (via Recharts) visualizing the user's core financial breakdown: Income vs. Expenses vs. Potential Savings.
* **Quick-Add Forms:** Intuitive, quick-access forms for manually adding one-off expenses and income, which update the dashboard in real-time.
* **Savings Goal Tracking:** A module for users to create and track progress against their financial goals (e.g., "Vacation Fund," "New Car").
* **Investment Projections:** A line chart that projects the user's savings growth over time, with adjustable risk profiles ("Conservative," "Balanced," "Growth").
* **Monthly Transaction List:** A clean, scrollable list of all manually entered income and expenses for the current period.

---

## Tech Stack

This project uses a modern, robust, and scalable tech stack:

* **Frontend:** **React** (Functional Components, Hooks)
* **Backend & Authentication:** **Firebase** (Firestore & Authentication)
* **Styling:** **Tailwind CSS** (Utility-first CSS)
* **Data Visualization:** **Recharts** (Declarative charting library)
* **Animation:** **Framer Motion** (Production-ready animations)
* **Icons:** **Lucide React** (Beautiful and consistent icon set)

---

## Getting Started

To get a local copy up and running, please follow these steps.

### Prerequisites

You must have [Node.js](https://nodejs.org/) (which includes `npm`) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/nest-finance.git](https://github.com/your-username/nest-finance.git)
    cd nest-finance
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

### Firebase Setup (Crucial)

This project is built on Firebase. You **must** create your own Firebase project to run it.

1.  **Create a Firebase Project:**
    * Go to the [Firebase Console](https://console.firebase.google.com/).
    * Click "Add project" and follow the on-screen instructions.

2.  **Enable Authentication:**
    * In your new project's console, go to **Authentication**.
    * Click "Get started."
    * Under **Sign-in method**, enable the **Email/Password** provider.

3.  **Enable Firestore:**
    * Go to **Firestore Database**.
    * Click "Create database."
    * Start in **Test mode** (we will secure it in the next step). Choose a location closest to you.

4.  **Set Up Security Rules:**
    * This is the most important step for security. Go to the **Rules** tab within Firestore.
    * Replace the default rules with the following secure rules:
    ```rules
    rules_version = '2';

    service cloud.firestore {
      match /databases/{database}/documents {

        // Users can only read and update their own user document
        match /users/{userId} {
          allow read, update: if request.auth != null && request.auth.uid == userId;
          allow create: if request.auth != null;
        }

        // Users can create, read, update, and delete transactions
        // only if they are the authenticated owner.
        match /users/{userId}/transactions/{txId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }

        // Users can create, read, update, and delete goals
        // only if they are the authenticated owner.
        match /users/{userId}/goals/{goalId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
    ```
    * Click **Publish** to save your rules.

5.  **Get Firebase Config:**
    * In your Firebase project, go to **Project Settings** (the gear icon).
    * Under the **General** tab, scroll down to "Your apps."
    * Click the **Web** icon (`</>`).
    * Give your app a nickname (e.g., "Nest Finance Web") and click "Register app."
    * Firebase will give you a `firebaseConfig` object. Copy this object.

6.  **Create Environment File:**
    * In the root of your cloned project, create a new file named `.env.local`
    * Paste your `firebaseConfig` object into this file, formatting it as follows:

    ```.env
    REACT_APP_FIREBASE_API_KEY="YOUR_API_KEY"
    REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    REACT_APP_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    REACT_APP_FIREBASE_APP_ID="YOUR_APP_ID"
    ```
    *(Note: React projects (using Create React App) automatically load environment variables prefixed with `REACT_APP_`)*

### Run the Application

With your `.env.local` file saved, you can now start the application:

```sh
npm start


This will run the app in development mode. Open http://localhost:3000 to view it in your browser.

```eof
