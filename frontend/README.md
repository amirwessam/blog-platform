# Blog Platform

A modern blog platform with Progressive Web App capabilities, rich text editing, and offline support.

## Features

- **Create, Edit, Delete Blog Posts**: Full CRUD functionality with an intuitive interface
- **Draft Mode**: Save posts as drafts before publishing
- **Rich Text Editor**: Format text and embed images with an easy-to-use editor
- **Drag-and-Drop Reordering**: Rearrange blog post cards with a simple drag interface
- **Progressive Web App (PWA)**: Install on devices and use offline
- **Offline Support**: Create and edit content even without an internet connection
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technologies Used

- **MongoDB**: NoSQL database for storing blog posts
- **Express**: Backend API framework
- **React**: Frontend library for the user interface
- **Node.js**: JavaScript runtime for the server
- **Draft.js**: Rich text editing capabilities
- **Workbox**: PWA service worker functionality
- **Styled Components**: Component-based styling
- **Sharp**: Image optimization and processing

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blog-platform.git
   cd blog-platform
   ```
2. Install dependencies:

# Install backend dependencies

npm install

# Install frontend dependencies

cd frontend
npm install
cd .. 3. Configure environment:

# Copy example environment file

cp .env.example .env

# Edit the .env file with your MongoDB connection string

4. Create uploads directory:
   mkdir -p uploads
5. Start development servers:

# Start backend in one terminal

npm run dev

# Start frontend in another terminal

cd frontend
npm run dev
