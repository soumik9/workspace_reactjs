# Workspace Frontend

A React and TypeScript application for organizing nested folders and text files. The frontend connects to the backend API for authentication and workspace persistence.

## Features

- Registration, login, and logout.
- Create and rename folders and text files.
- Delete items and their nested contents.
- Edit and save text files.
- Ssearch across loaded items.
- Loading states, retry controls, and success/error notifications.

## Technology

React, TypeScript, Tailwind CSS, Redux Toolkit, RTK Query, React Router, React Hook Form, React Toastify, and React Icons.

## Local Setup

Run these commands from the `website` directory. Use a current Node.js LTS release supported by the installed Vite version, such as Node.js 24, and npm.

1. Install the locked dependencies:

   ```bash
   npm i
   ```

2. Create `.env` in the `website` directory:

   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1/
   ```

3. Start the frontend:

   ```bash
   npm run dev
   ```

   Open the URL printed by Vite, usually `http://localhost:5173`.

4. Register an account, then sign in to open the workspace. No demo account is bundled.

## Routes

| Route       | Page                    |
| ----------- | ----------------------- |
| `/login`    | Login                   |
| `/register` | Registration            |
| `/`         | Authenticated workspace |

## AI Summary

Open a text file, save any edits, and click **Summarize**. The modal displays a summary of the saved text with a copy button, loading state, and retry on failure. Empty files and files with unsaved edits cannot be summarized from the editor. Summaries do not replace file content.

The frontend calls `POST workspace/summarize?workspace_id=<id>` with the existing Bearer token. Configure `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in the backend environment only; see `../backend/README.md`. Text is sent to OpenAI when requested. Summaries may miss details or contain inaccuracies and should be checked against the original. The backend caps input at 30,000 characters and limits requests to five per user per minute.
