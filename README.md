# Blog Platform

A full-stack blogging application built with Node.js, Express, MongoDB, React, and Vite. Features include a rich text editor, image gallery, offline support via PWA capabilities, and real-time blog synchronization.

## Features

- 📝 **Rich Blog Editor** - Create and edit blog posts with a powerful editor
- 🖼️ **Image Gallery** - Upload and manage images for your blog posts
- 📱 **Progressive Web App** - Works offline with service worker support
- 🔄 **Sync Service** - Automatic synchronization of blog data
- 🌐 **Responsive Design** - Mobile-friendly interface
- ⚠️ **Error Handling** - Comprehensive error boundaries and error handling
- 📡 **Network Status** - Real-time network connectivity monitoring

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Port**: 5001 (default)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3
- **PWA**: Service Worker & Web Manifest

## Project Structure

```
blog-platform/
├── server.js                 # Express server entry point
├── package.json             # Backend dependencies
├── .env                     # Environment variables
│
├── config/
│   └── db.js               # Database configuration
│
├── controllers/
│   └── blogController.js   # Blog business logic
│
├── models/
│   └── blogModel.js        # MongoDB blog schema
│
├── routes/
│   └── blogRoutes.js       # API routes
│
├── uploads/                # User uploaded files
│
└── frontend/               # React Vite application
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── public/
    │   ├── manifest.json   # PWA manifest
    │   ├── service-worker.js
    │   └── icons/
    └── src/
        ├── main.jsx        # React entry point
        ├── App.jsx         # Root component
        ├── polyfills.js
        ├── components/
        │   ├── BlogEditor.jsx
        │   ├── BlogView.jsx
        │   ├── ErrorBoundary.jsx
        │   ├── ImageGallery.jsx
        │   ├── InstallPrompt.jsx
        │   └── NetworkStatus.jsx
        ├── pages/
        │   ├── BlogEditorPage.jsx
        │   └── HomePage.jsx
        ├── services/
        │   └── BlogSyncService.js
        └── styles/
            ├── editor.css
            ├── imageGallery.css
            └── index.css
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string available)

### Backend Setup

1. Install backend dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
MONGO_URI=mongodb://localhost:27017/blogPlatform
PORT=5001
```

3. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173`

## Running the Project

### Development Mode

Terminal 1 - Backend:
```bash
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Production Build

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Deploying to Vercel

### Prerequisites
- Vercel account and CLI installed
- MongoDB Atlas cluster (for production database)
- Git repository

### Step 1: Prepare MongoDB
1. Create a MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string from MongoDB Atlas (format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/blogPlatform`)
   - Replace `<username>` and `<password>` with your Atlas credentials

### Step 2: Connect to Vercel
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your Git repository
4. Select "Other" as the framework

### Step 3: Set Environment Variables
In Vercel Project Settings → Environment Variables, add:
- `MONGO_URI`: Your MongoDB Atlas connection string
- `NODE_ENV`: `production`
- `FRONTEND_URL`: Your Vercel domain (e.g., `https://blog-platform-lac-six.vercel.app`)

### Step 4: Configure Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install && cd frontend && npm install`

### Step 5: Deploy
- Push to your main branch and Vercel will automatically deploy
- Or use Vercel CLI:
```bash
vercel --prod
```

### Troubleshooting Vercel Deployment

**500 Error - FUNCTION_INVOCATION_FAILED**
- Check that `MONGO_URI` environment variable is set correctly
- Ensure MongoDB Atlas IP whitelist includes Vercel's IPs or use `0.0.0.0/0`
- Check Vercel function logs for detailed error messages

**Database Connection Issues**
- Verify MongoDB Atlas connection string is correct
- Add Vercel IP addresses to MongoDB Atlas IP Whitelist (or allow all)
- Test connection string locally first

**Static Files Not Loading**
- Ensure frontend is built: `cd frontend && npm run build`
- Check that `vercel.json` is in the root directory
- Verify `frontend/dist` contains the built files

## API Endpoints

The backend provides RESTful API endpoints for blog operations. All endpoints are defined in `routes/blogRoutes.js` and handled by `controllers/blogController.js`.

## Configuration

### Environment Variables (.env)

- `MONGO_URI` - MongoDB connection string (default: `mongodb://localhost:27017/blogPlatform`)
- `PORT` - Backend server port (default: `5001`)

### Vite Configuration

Frontend build and dev server configuration is managed in `frontend/vite.config.js`

## PWA Features

The application includes Progressive Web App capabilities:
- **Service Worker** (`public/service-worker.js`) - Enables offline functionality
- **Web Manifest** (`public/manifest.json`) - Allows installation as a native app
- **Install Prompt** (`components/InstallPrompt.jsx`) - User-friendly install experience

## Development Notes

### Error Handling

The application includes an `ErrorBoundary` component that catches React errors and prevents the entire app from crashing.

### Network Monitoring

The `NetworkStatus` component monitors real-time network connectivity and provides visual feedback to users.

### Blog Synchronization

The `BlogSyncService` handles offline/online synchronization of blog data, ensuring data consistency across sessions.

## Contributing

When contributing to this project:
1. Follow the existing code structure
2. Test both backend and frontend changes
3. Ensure MongoDB is running for backend testing
4. Check that the PWA features work correctly

## License

This project is open source and available under the MIT License.
