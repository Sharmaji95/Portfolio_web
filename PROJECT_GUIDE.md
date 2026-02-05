# 📘 Data Analyst Portfolio - The Complete Guide

Welcome to your portfolio documentation! This guide covers everything from setting up the project to deploying it live, managing the database, and making future changes.

---

## 🏗️ Part 1: Project Setup (Local)
**Prerequisites:** Node.js installed.

1.  **Open the Project**: Open the folder in VS Code.
2.  **Install Dependencies**:
    Open the terminal (`Ctrl + ~`) and run:
    ```bash
    npm install
    ```
3.  **Run Locally**:
    Start the development server:
    ```bash
    npm run dev
    ```
    The site will open at `http://localhost:5174/`.

---

## 🔥 Part 2: Firebase Setup (Backend)
This project uses Firebase for Authentication (Login), Database (Data), and Storage (Images).

### 1. Create a Project
1.  Go to [console.firebase.google.com](https://console.firebase.google.com/).
2.  **Add project** -> Name it (e.g., `sharmaji-portfolio`).

### 2. Enable Authentication (Login)
1.  Go to **Build** > **Authentication**.
2.  Click **Get Started**.
3.  Select **Email/Password** -> Toggle **Enable** -> **Save**.
4.  **Create Admin User**: Tab "Users" -> "Add user" -> Enter your email/password.

### 3. Setup Database (Firestore)
1.  Go to **Build** > **Firestore Database**.
2.  **Create database** -> Select location (e.g., `us-central`) -> **Test mode** -> **Create**.
3.  **Rules**: Go to "Rules" tab. Copy the content from your local `firestore.rules` file and paste it there. Click **Publish**.

### 4. Setup Storage (Images)
1.  Go to **Build** > **Storage**.
2.  **Get Started** -> **Test mode** -> **Done**.
3.  **Rules**: Go to "Rules" tab. Copy content from `storage.rules`. Click **Publish**.

### 5. Connect App to Code
1.  Project Overview (Gear Icon) -> Project Settings.
2.  Scroll to "Your apps" -> Click `</>` (Web).
3.  Register app (Name: `Portfolio`).
4.  **Copy the SDK Config** (`apiKey`, `authDomain`, etc.).
5.  **Local Config**: Open `.env` file in your project and paste them matching the keys (e.g., `VITE_FIREBASE_API_KEY=...`).

---

## 🐙 Part 3: GitHub (Version Control)
To save your changes to the cloud.

1.  **Save Changes**:
    ```bash
    git add .
    git commit -m "Describe your changes"
    ```
2.  **Push to GitHub**:
    ```bash
    git push
    ```
    *(If it asks for password, use your GitHub Personal Access Token).*

---

## 🚀 Part 4: Deployment (Netlify)
To make your website live for the world.

1.  Go to [app.netlify.com](https://app.netlify.com).
2.  **Add new site** -> **Import from GitHub**.
3.  Select your repository (`Portfolio_web`).
4.  **Environment Variables** (Crucial!):
    *   Click "Environment variables".
    *   Add the same keys from your local `.env` file (`VITE_FIREBASE_API_KEY`, etc.).
5.  Click **Deploy**.

**Troubleshooting Routing**: If clicking "Refresh" on the admin page gives a 404 error, ensure the `public/_redirects` file exists in your code (I have already added it).

---

## 🛠️ Part 5: Future Development Guide
How to change things later?

### 📂 Folder Structure
*   `src/pages/Home.jsx`: The main website page (Public view).
*   `src/pages/Admin.jsx`: The Admin Panel container.
*   `src/components/Sections/`: Individual sections like `Hero.jsx`, `Projects.jsx`, `Skills.jsx`.
*   `src/context/PortfolioContext.jsx`: **The Brain**. Handles all data (Profile, Projects, etc.) and Firebase logic.

### ✏️ Common Scenarios

**1. I want to change the Theme Color:**
*   Go to `src/index.css`.
*   The colors are defined in Tailwind classes. Look for `emerald-500` or `emerald-400` in the components and find/replace them globally if you want a different accent color (e.g., `blue-500`).

**2. I want to add a new Social Link:**
*   Go to `src/context/PortfolioContext.jsx`: Add the key to `initialState` -> `socialLinks`.
*   Go to `src/components/Admin/Settings.jsx`: Add an input field for it.
*   Go to `src/components/Layout/Footer.jsx`: Add the icon/link to the list.

**3. I want to change the "About Me" text:**
*   **Easiest way**: Login to `/admin`, go to **Settings**, and edit the Bio. No code needed!

**4. I want to add a completely new section:**
*   Create `NewSection.jsx` in `src/components/Sections/`.
*   Import and add it to `src/pages/Home.jsx`.
*   Add a visibility toggle in `PortfolioContext.jsx` (`sectionVisibility` state).

---

### 🆘 Quick Commands
*   `npm run dev`: Start Local Server.
*   `npm run build`: Check for errors before deploying.
*   `git push`: Send updates to GitHub (which auto-updates Netlify).

---

*Documentation created for SharmaJi by Your AI Assistant.*
