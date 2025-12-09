# Nest Finance – Manual-Entry Financial Dashboard

**A secure, privacy‑first finance app built with React, Firebase and modern UX patterns.**  
Nest Finance helps individuals and families take control of their finances without connecting their bank accounts.  Users manually enter income and expenses, set savings goals and visualize progress through clear charts and projections.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Running locally](#running-locally)
- [Testing & linting](#testing--linting)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

## Features

- **Secure authentication** – Email/password sign‑up and sign‑in with Firebase Auth.
- **Guided onboarding** – New users enter baseline income and recurring expenses once; the app remembers these values.
- **Manual transaction entry** – Quick‑add forms for income and expenses update the dashboard in real time.
- **Analytics dashboard** – Visualize income vs. expenses vs. savings with a donut chart, plus a line graph projecting savings over time.
- **Goal tracking** – Create named savings goals (e.g. *Vacation Fund*) and monitor progress toward them.
- **Transaction history** – Scrollable list of manually entered transactions for the current month.
- **Configurable projections** – Select risk profiles (conservative, balanced, growth) to project savings at different rates.

## Tech stack

| Layer             | Technology         |
|-------------------|--------------------|
| **Frontend**      | [React](https://react.dev/) with Hooks and functional components |
| **State/data**    | [Firebase Firestore](https://firebase.google.com/products/firestore) for persistent storage, [React Query](https://tanstack.com/query/) for client caching |
| **Authentication**| [Firebase Auth](https://firebase.google.com/docs/auth) (email/password) |
| **Styling**       | [Tailwind CSS](https://tailwindcss.com/) for utility‑first styling |
| **Charts**        | [Recharts](https://recharts.org/) for donut and line charts |
| **Animations**    | [Framer Motion](https://www.framer.com/motion/) for transitions |
| **Icons**         | [Lucide React](https://github.com/lucide-icons/lucide/tree/main/packages/lucide-react) |
| **3D Graph**      | [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) & [r3f‑forcegraph](https://github.com/vasturiano/react-force-graph/tree/master/packages/react-force-graph-three) |

## Project structure

```
Nest/
├── api/                    # serverless functions (Firebase functions or Vercel API)
├── nest-finance/           # React application source code
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components (home, dashboard, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # Zustand/React context providers
│   │   ├── utils/          # Helpers and utilities
│   │   └── App.tsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies and scripts
├── scripts/                # Helper scripts (e.g. generate themes)
├── .github/                # GitHub templates (issues, pull requests, workflows)
└── README.md               # Project overview (this file)
```

> **Note**: The folder layout above is simplified. See the repository tree for the full structure.

## Getting started

### Prerequisites

- Node.js **20.x** and npm/yarn installed. Check your version:

  ```sh
  node --version
  npm --version
  # or
  yarn --version
  ```

### Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/jacobp112/Nest.git
   cd Nest/nest-finance
   ```

2. **Install dependencies**:

   ```sh
   npm install
   # or
   yarn
   ```

3. **Initialize Firebase** (see [Configuration](#configuration)).

### Configuration

Nest Finance relies on Firebase for authentication and data storage. You need to create your own Firebase project to run the app:

1. Go to the [Firebase Console](https://console.firebase.google.com/) and add a new project.
2. Enable **Email/Password** authentication under **Authentication → Sign‑in method**.
3. Create a **Firestore Database** and start in *Test Mode* during development.
4. Set up **security rules** so that each user can only access their own documents. The recommended rules are:

   ```js
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, update: if request.auth != null && request.auth.uid == userId;
         allow create: if request.auth != null;
       }
       match /users/{userId}/transactions/{txId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /users/{userId}/goals/{goalId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

5. In the Firebase project settings (**Project settings → General → Your apps**), register a new **Web** app and copy the `firebaseConfig` object.
6. Create a `.env.local` file at the root of `nest-finance` and populate it with your Firebase keys:

   ```ini
   REACT_APP_FIREBASE_API_KEY="YOUR_API_KEY"
   REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
   REACT_APP_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
   REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
   REACT_APP_FIREBASE_APP_ID="YOUR_APP_ID"
   ```

   React apps automatically load environment variables prefixed with `REACT_APP_`.

## Running locally

To run a development server with hot reload:

```sh
npm start
# or
yarn start
```

The app will be available at <http://localhost:3000>. Any changes you make in the `src` directory will reload the page automatically.

### Building for production

To build a production‑ready bundle in the `build` directory:

```sh
npm run build
# or
yarn build
```

You can then deploy the `build` directory to any static hosting provider (Firebase Hosting, Vercel, Netlify, etc.).

## Testing & linting

- **Unit tests** are written with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and can be run via:

  ```sh
  npm test
  # or
  yarn test
  ```

- **Linting** uses ESLint with the `react-app` and `jest` presets. Run `npm run lint` or integrate linting into your editor.

## Contributing

This project is a private, closed-source initiative and does not accept external contributions at this time. For any questions or to discuss potential collaboration in the future, please contact the maintainers directly..


## Roadmap

This project follows an agile workflow. Planned enhancements include:

- 🔒 **Enhanced security** – optional multi‑factor authentication and automated vulnerability scanning.
- 📱 **Mobile support** – responsive design improvements and a React Native companion app.
- 📊 **Advanced analytics** – custom date ranges and category grouping for transactions.
- 🔗 **Bank connection** (optional) – secure bank integration via Plaid for users who prefer automated imports.
- 🌍 **Internationalization (i18n)** – support for multiple languages and currencies.

The internal team tracks progress using the Issues and Projects boards.

## License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for full details.

## Contact

For support or questions, please open an issue on GitHub. You can also reach the maintainer via email at **jacobp112@example.com**.

---

*This README was generated to provide a clean and professional overview of the Nest Finance project. Feel free to modify it to suit your needs.*
