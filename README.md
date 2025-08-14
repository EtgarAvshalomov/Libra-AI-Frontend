# Libra AI - Frontend

A modern, responsive chat interface for interacting with multiple Large Language Models (LLMs) via OpenRouter, featuring dynamic model switching and real-time streaming capabilities.

## 🚀 Features

- **Multi-Model Support**: Switch between different LLM models mid-conversation while maintaining context
- **Temperature Control**: Adjust response creativity and randomness with customizable temperature settings
- **Real-Time Streaming**: Server-Sent Events (SSE) for live message streaming
- **Conversation Management**: Create, edit, and organize chat sessions
- **Stop Generation**: Interrupt model responses mid-generation with a stop button
- **User Authentication**: Secure account creation and login system
- **Responsive Design**: Fully mobile-friendly interface that works across all devices
- **Context Persistence**: Conversation history maintained when switching models

## 🛠️ Tech Stack

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS + CSS Modules
- **Authentication**: Integration with backend auth system
- **Deployment**: Vercel
- **API Communication**: RESTful APIs with SSE for streaming

## 📱 User Experience

The application provides an intuitive chat interface where users can:

1. **Sign Up/Login**: Create secure accounts with encrypted password storage
2. **Start New Chats**: Begin conversations with their preferred LLM model
3. **Customize Settings**: Adjust temperature for response creativity
4. **Switch Models**: Change AI models without losing conversation context
5. **Manage Conversations**: Create chats and edit chat names
6. **Mobile-Friendly**: Seamless experience across desktop and mobile devices

## 🏗️ Architecture

The frontend communicates with a Node.js backend API and handles:

- User authentication and session management
- Real-time message streaming via Server-Sent Events
- Dynamic UI updates for model switching and temperature control
- Responsive chat interface with conversation history
- Stop functionality for interrupting AI responses

## 🌐 Live Demo

[Live Application](https://libra-ai-frontend.vercel.app)

## 🔗 Related Repositories

- [Backend Repository](https://github.com/EtgarAvshalomov/Libra-AI-Backend) - Node.js server with database integration

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/EtgarAvshalomov/Libra-AI-Frontend.git
cd Libra-AI-Frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local

# Add your environment variables
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_NODE_ENV=development

# Run development server
npx next dev -p 3001
```

Open [http://localhost:3001](http://localhost:3001) to view the application.

## 📋 Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_NODE_ENV=development # Only for development
```

## 🚢 Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

---

Built with ❤️ using Next.js and modern web technologies
