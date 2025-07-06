# PodBrief - AI-Powered Podcast Interview Brief Generator

PodBrief is a SaaS application that generates professional podcast interview briefs using OpenAI's GPT-3.5-turbo. It creates personalized bios, interview questions, intro scripts, and outro scripts for podcast guests.

## Features

- **AI-Powered Generation**: Uses OpenAI GPT-3.5-turbo to generate professional content
- **Guest Management**: Store and manage guest information
- **Brief Generation**: Create comprehensive interview briefs with:
  - Professional bio (2-3 sentences)
  - 5 interview questions
  - ~30-second intro script
  - ~15-second outro script
- **Copy to Clipboard**: Easy copying of generated content
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **SQLite** database (easily switchable to PostgreSQL)
- **OpenAI API** for content generation
- **CORS** enabled for frontend communication

### Frontend
- **React** with functional components and hooks
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Hot Toast** for notifications

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PodBrief
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp server/.env.example server/.env
   
   # Edit server/.env and add your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Production Build

```bash
# Build the frontend
npm run build

# Start production server
npm start
```

## API Endpoints

### POST /api/generate
Generates a podcast interview brief for a guest.

**Request Body:**
```json
{
  "name": "John Doe",
  "link": "https://example.com/john-doe",
  "topic": "AI and Machine Learning"
}
```

**Response:**
```json
{
  "success": true,
  "brief": {
    "id": 1,
    "guestId": 1,
    "bio": "John Doe is a leading expert in AI...",
    "questions": [
      "What inspired you to work in AI?",
      "How do you see AI evolving in the next 5 years?",
      "..."
    ],
    "intro": "Today we're joined by John Doe...",
    "outro": "Thank you John for sharing your insights...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Database Schema

### Guests Table
- `id` (Primary Key)
- `name` (String, Required)
- `link` (String, Optional)
- `topic` (String, Optional)
- `createdAt` (Timestamp)

### Briefs Table
- `id` (Primary Key)
- `guestId` (Foreign Key to Guests)
- `bio` (Text)
- `questions` (JSON Array)
- `intro` (Text)
- `outro` (Text)
- `createdAt` (Timestamp)

## Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 