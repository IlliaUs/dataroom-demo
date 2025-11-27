# Data Room — Frontend Demo (React + TypeScript)

A lightweight client-side data room that mimics basic Google Drive / Dropbox behavior. Created as a take-home assignment demonstrating app structure, data modeling, state management, routing, UI consistency, and UX decisions.

## Features

* Simple email-based mock login

* Data room creation & management

* Nested folders and file hierarchy

* In-folder search / filtering

* PDF upload & preview (only PDF)

* Rename / delete / recursive deletion

* Safe filename conflict resolution

* Blob-based preview & download

* Clean UI built with shadcn/ui + lucide icons

* Non-blocking UX using sonner toasts

## Tech stack

React + TypeScript

Vite

react-router-dom

shadcn/ui

lucide-react

sonner

## Project structure
src/
  components/
  pages/
  state/
  layouts/
  lib/
  routes/
  ui/

## Architecture overview
State management (Context + useReducer)

The entire app state is stored using React Context + useReducer.
This provides several benefits:

### Why Context?

No prop drilling

Centralized global state

Works out-of-the-box with TypeScript

No external dependencies

### Why useReducer?

Predictable state transitions

No accidental mutations

Reducer is easy to audit when multiple operations modify nested state (e.g. deleting a folder and all its children)

### Why not Redux / Zustand?

For this scale:

Context + reducer already gives predictable state control

No async actions / thunks / effects are needed

No server-synced state

For an in-memory local demo, Context + reducer is the simplest and cleanest tool.

Data model

The data layer is normalized (IDs instead of nested objects):

* datarooms

* folders

* files (they are not stored in localStorge, because they are too big for it, but there is object for them with metadat, in case we extend with indexedDB)

This enables:

instant lookup

efficient renaming

future “move / copy / share” support

safe recursive folder deletion

fewer nested object mutations

File storage & local handling (no backend)
Why store files only in memory?

This is a frontend-only demo, designed to simulate product behavior without building a real backend.

The UI explicitly communicates:

“file content is only available until you refresh this page in this demo.”

This makes the limitation obvious and keeps the implementation focused on frontend logic rather than storage.

### Why mock auth in localStorage?

Auth is intentionally mocked using a single flag in localStorage:

localStorage.setItem("demo-auth", "true")


Instead of:

OAuth

JWT

cookies

server-side sessions

Because:

The goal is to demonstrate protected routing and “logged-in vs logged-out” flow

Real auth would add a lot of boilerplate not relevant for the demo

localStorage is deterministic, easy to inspect, and works across reloads

No backend is required

This makes the “auth” layer transparent and keeps the focus on app structure and UX.

### Routing

Routing is implemented with react-router-dom:

/login
/datarooms
/dataroom/:id


/login – mock login page accepting any email

/datarooms – list of data rooms

/dataroom/:id – main data room view with sidebar, breadcrumbs, toolbar and table

Protected routes use a small helper like:

isAuthenticated()


that reads the auth flag from localStorage and redirects to /login if needed.

## Running locally
npm install
npm run dev


By default the app is available at:

http://localhost:5173
