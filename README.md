# EventGo-Client

EventGo-Client is a client-side application built with React, TypeScript, and Vite. This project aims to provide a robust and efficient user interface for event management.

## Features

- **React & TypeScript**: Utilizes React for building user interfaces and TypeScript for type safety.
- **Vite**: Fast build tool and development server.
- **Authentication**: Includes authentication flows such as login, registration, and password reset.
- **State Management**: Uses context and hooks for managing application state.
- **Form Handling**: Implements various forms with validation and user feedback using `react-toastify`.

## Project Structure

```plaintext
src/
├── components/      # Reusable UI components
├── contexts/        # Context providers for state management
├── hooks/           # Custom hooks
├── pages/           # Main application pages
├── AppRoutes.tsx    # Application routing
├── main.tsx         # Main entry point
└── index.css        # Global styles
```

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/MerttMetinn/EventGo-Client.git
cd EventGo-Client
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the Development Server

Start the development server with Vite:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
```

### Linting and Formatting

Lint and format the code:

```bash
npm run lint
# or
yarn lint
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.
```

Feel free to customize this README further based on specific details and additional features of your project.
