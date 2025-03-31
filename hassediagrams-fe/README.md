# Hasse Diagrams Frontend

This is the frontend service for the Hasse Diagrams application. It is built using Next.js, React, and D3 for data visualization, and styled with Tailwind CSS. This project is configured for development, building, and production deployment using the Next.js framework.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building and Running in Production](#building-and-running-in-production)
- [Scripts](#scripts)
- [Dependencies](#dependencies)

## Overview

This project is the frontend component for the Hasse Diagrams application. It uses:
- **Next.js** for server-side rendering and routing.
- **React** for building user interfaces.
- **D3.js** for data visualizations.
- **Tailwind CSS** for utility-first styling.

## Prerequisites

Before getting started, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/) (or [Yarn](https://yarnpkg.com/) if preferred)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/hassediagrams-fe.git
   cd hassediagrams-fe

2. **Install dependencies:**
   ```bash
   npm install
## Development
To start the development server with hot reloading, run:

```bash
npm run dev
```

This will launch the application at http://localhost:3000.

## Building and Running in Production
To build the application for production, run:

```bash
npm run dev
```


After the build is complete, you can start the production server with:

```bash
npm run start
```

The production server will run at http://localhost:3000.

## Scripts
The following scripts are defined in the package.json:
- **dev**: Runs the Next.js development server.
- **build**: Builds the application for production.
- **start**: Starts the production server.
- **lint**: Runs ESLint to check for code issues.

## Dependencies
### Runtime Dependencies
- next: Framework for server-side rendering.
- react: UI library.
- react-dom: DOM-specific methods for React.
- d3: Library for data visualizations.

### Development Dependencies
- @eslint/eslintrc: ESLint configuration.
- @types/d3: TypeScript definitions for D3.
- @types/node: TypeScript definitions for Node.js.
- @types/react: TypeScript definitions for React.
- @types/react-dom: TypeScript definitions for ReactDOM.
- eslint: Pluggable linting utility.
- eslint-config-next: ESLint configuration for Next.js.
- postcss: Tool for transforming CSS.
- tailwindcss: Utility-first CSS framework.
- typescript: Superset of JavaScript for static typing.