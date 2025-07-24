# ArtLoop Backend

Backend service for ArtLoop - that transforms hand-drawn sketches into stunning artwork using advanced image analysis and generation.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Services](#services)
- [Contributing](#contributing)
- [License](#license)

## Overview

ArtLoop Backend is the server-side component of the ArtLoop application. It provides RESTful APIs for user authentication, sketch analysis, and AI-powered image generation. The service integrates with Google Cloud Vision for image analysis and Together AI for image generation.

## Features

- User authentication (registration and login)
- Sketch analysis using Google Cloud Vision API
- AI-powered image generation using Together AI
- Credit-based usage system
- Multiple artistic style presets
- Secure JWT-based authentication

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: Appwrite
- **Image Analysis**: Google Cloud Vision API
- **Image Generation**: Together AI
- **CORS**: Enabled for specific origins

## Architecture

The backend follows a modular architecture with clear separation of concerns:

```
├── config/          # Configuration files for services
├── middlewares/     # Authentication and other middleware functions
├── routes/          # API route definitions
├── services/        # Business logic and service integrations
├── server.js        # Entry point
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login for existing users

### Image Generation

- `POST /api/generate` - Generate artwork from sketch (requires authentication)

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd artloop-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For production:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
JWT_SECRET=your_jwt_secret_key

# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_API_KEY=your_appwrite_api_key
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
VITE_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id

# Together AI Configuration
TOGETHER_AI_API_KEY=your_together_ai_api_key

# Google Cloud Vision (key file should be in root)
# artloop-466212-6e252fad9d85.json
```

## Project Structure

```
artloop-backend/
├── config/
│   ├── ai.js          # AI service configurations
│   └── database.js    # Database configurations
├── middlewares/
│   └── auth.js        # Authentication middleware
├── routes/
│   ├── auth.js        # Authentication routes
│   ├── generate.js    # Image generation routes
├── services/
│   ├── imageService.js # Image generation service
│   └── visionService.js # Image analysis service
├── .env               # Environment variables
├── server.js          # Entry point
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Services

### Google Cloud Vision Integration

The application uses Google Cloud Vision API for analyzing user sketches. The service extracts:
- Object detection
- Text detection
- Image properties (dominant colors)
- Web detection
- Label detection

### Together AI Integration

ArtLoop uses Together AI's FLUX.1-schnell-Free model for generating final artwork from analyzed sketches. Users can select from multiple artistic styles:
- Realistic
- Anime
- Cartoon
- Oil Paint
- Sketch
- Cyberpunk

### Appwrite Integration

Appwrite is used as the backend database for:
- User management
- Credit tracking
- Session management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request
