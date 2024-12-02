# Setup Guide

## Prerequisites

- Node.js 16 or later
- npm or yarn
- A Todoist account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ashepp/mindseye2.git
cd mindseye2
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```bash
touch .env
```

4. Add your Todoist API key to .env:
```
REACT_APP_TODOIST_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm start
```

## Development

### Available Scripts

- `npm start`: Run development server
- `npm test`: Run tests
- `npm run build`: Build for production
- `npm run eject`: Eject from Create React App

### Project Structure

```
/src
  /components      # React components
  /hooks           # Custom hooks
  /services        # API services
  /utils           # Utility functions
/public            # Static files
/docs              # Documentation
```