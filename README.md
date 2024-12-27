# Gemini Chat App

A modern chat application built with Next.js and Google's Gemini AI API.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Google API Key for Gemini

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gemini-chat-app.git
cd gemini-chat-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Gemini API key:
```
GOOGLE_API_KEY=your_api_key_here
```

## Development

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

The project uses Jest for testing. To run tests:

```bash
npm test
# or
yarn test
```

## Build and Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm start
# or
yarn start
```

## Project Structure

```
gemini-chat-app/
├── src/
│   ├── app/
│   │   ├── page.tsx         # Main chat interface
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React components
│   └── lib/                 # Utility functions
├── public/                  # Static files
└── tests/                   # Test files
```

## Features

- Real-time chat interface
- Integration with Google's Gemini AI
- Modern UI with Tailwind CSS
- Responsive design
- TypeScript support


## push to github

```bash
GIT_SSH_COMMAND="ssh -i ~/.ssh/gitlab"  git push gh main
```