# 📝 Blog Platform - Modern Full-Stack Blogging Solution

A powerful, modern full-stack blogging platform built with cutting-edge technologies. Create, edit, and manage your blog posts with an intuitive interface, rich text editing, image management, and offline-first capabilities.

## ✨ Key Features

### 📱 Modern User Interface

- **Clean, intuitive design** inspired by modern web standards
- **Responsive layout** that works seamlessly on desktop, tablet, and mobile
- **Smooth animations and transitions** for a polished user experience
- **Professional color scheme** with gradient accents and modern typography

### ✍️ Rich Blog Editing

- **WYSIWYG Editor** - Write and format content without coding
- **Text Formatting** - Bold, italic, underline, and more
- **Heading Styles** - Multiple heading levels for content structure
- **Code Blocks** - Display code snippets with syntax highlighting
- **Lists** - Ordered and unordered lists for organized content

### 🖼️ Image Management

- **Image Gallery** - Upload and manage images for your posts
- **Image Preview** - View images before publishing
- **Drag & Drop** - Intuitive image uploading
- **Responsive Images** - Optimized for all screen sizes

### 🔄 Progressive Web App (PWA)

- **Offline Support** - Write and edit posts without internet connection
- **Installable** - Add the app to your home screen
- **Service Worker** - Background sync and offline functionality
- **Push Notifications** - Get updates when new features are available
- **App-like Experience** - Full-screen, native app feel

### 📊 Smart Blog Management

- **Drag & Drop Reordering** - Organize your blog posts by dragging
- **Real-time Sync** - Automatic synchronization between local and cloud
- **Draft Management** - Save drafts and publish when ready
- **Edit History** - Update existing posts anytime

### 🌐 Cloud Deployment

- **Vercel Hosting** - One-click deployment to production
- **MongoDB Atlas** - Secure cloud database with free tier
- **Serverless Functions** - Scalable backend infrastructure
- **Auto Scaling** - Handle traffic spikes automatically

### 🔧 Developer Experience

- **Modern Stack** - React, Express, MongoDB, Vite
- **Hot Module Reloading** - Instant feedback during development
- **Built-in Validation** - Error boundaries and error handling
- **Network Status** - Real-time connection monitoring
- **Console Logging** - Detailed debugging information

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library with hooks and functional components
- **Vite** - Lightning-fast build tool and development server
- **React Router** - Client-side routing for seamless navigation
- **Draft.js** - Advanced text editor framework
- **React Draft WYSIWYG** - Rich text editing interface
- **React Beautiful DND** - Smooth drag-and-drop implementation
- **Styled Components** - CSS-in-JS for component styling
- **Axios** - Promise-based HTTP client for API calls

### Backend

- **Node.js** - JavaScript runtime for server-side code
- **Express.js** - Lightweight web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Object modeling for MongoDB
- **Multer** - File upload handling
- **Sharp** - Image optimization and processing
- **CORS** - Cross-origin resource sharing
- **Compression** - GZip compression for performance

### DevOps & Deployment

- **Vercel** - Serverless function deployment platform
- **MongoDB Atlas** - Cloud database hosting
- **Git** - Version control and collaboration
- **GitHub** - Repository hosting and CI/CD

## 📦 Project Structure

```
blog-platform/
├── 📄 package.json              Backend dependencies
├── 📄 server.js                 Express server entry point
├── 📄 vercel.json               Vercel deployment config
├── 📄 .env                      Environment variables
├── 📄 .gitignore                Git exclusions
│
├── 📁 api/
│   └── index.js                 Serverless API handler
│
├── 📁 config/
│   └── db.js                    MongoDB connection
│
├── 📁 controllers/
│   └── blogController.js        Business logic
│
├── 📁 models/
│   └── blogModel.js             MongoDB schema
│
├── 📁 routes/
│   └── blogRoutes.js            API endpoint definitions
│
├── 📁 uploads/                  User-uploaded images
│
└── 📁 frontend/                 React Vite application
    ├── package.json
    ├── vite.config.js
    ├── index.html
    │
    ├── 📁 public/
    │   ├── manifest.json        PWA manifest
    │   ├── service-worker.js    Service worker
    │   └── icons/               App icons
    │
    └── 📁 src/
        ├── main.jsx             React entry point
        ├── App.jsx              Root component
        ├── App.css              Global styles
        ├── index.css            Base styles with design tokens
        │
        ├── 📁 components/       Reusable components
        │   ├── BlogEditor.jsx
        │   ├── BlogView.jsx
        │   ├── ImageGallery.jsx
        │   ├── ErrorBoundary.jsx
        │   ├── InstallPrompt.jsx
        │   └── NetworkStatus.jsx
        │
        ├── 📁 pages/           Page components
        │   ├── HomePage.jsx
        │   └── BlogEditorPage.jsx
        │
        ├── 📁 services/        Business logic
        │   └── BlogSyncService.js
        │
        └── 📁 styles/          Component-specific styles
            ├── editor.css
            ├── imageGallery.css
            └── index.css
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - Download from [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)
- **MongoDB** - Either local installation or MongoDB Atlas account
- **Git** - For version control

### Local Development Setup

**1. Clone and Setup**

```bash
# Navigate to project directory
cd blog-platform

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

**2. Start MongoDB**

```bash
# Create data directory (if using local MongoDB)
mkdir -p ~/mongodb/data

# Start MongoDB server
mongod --dbpath ~/mongodb/data

# Or use MongoDB Atlas (update MONGO_URI in .env)
```

**3. Configure Environment**
Create `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/blogPlatform
PORT=5001
NODE_ENV=development
```

**4. Run Development Servers**

Terminal 1 - Backend:

```bash
npm run dev
```

Terminal 2 - Frontend (in another terminal):

```bash
cd frontend
npm run dev
```

Your app is now running:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001

## 📚 API Endpoints

### Blogs

- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

### Health Check

- `GET /api/health` - Server status

## 🌐 Deploying to Vercel

### Step 1: Prepare MongoDB Atlas

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user (username & password)
4. Get connection string (format: `mongodb+srv://user:pass@cluster.mongodb.net/database`)
5. Whitelist IPs: Allow `0.0.0.0/0` in Network Access

### Step 2: Deploy to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your GitHub repository
4. Select "Other" as framework

### Step 3: Set Environment Variables

In Vercel Project Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/blogPlatform
NODE_ENV=production
```

### Step 4: Configure Build

- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install && cd frontend && npm install`

### Step 5: Deploy

Push to main branch, Vercel will auto-deploy. Or use:

```bash
vercel --prod
```

## 🐛 Troubleshooting

### 500 Internal Server Error on Vercel

- ✅ Verify `MONGO_URI` environment variable is set
- ✅ Ensure MongoDB Atlas whitelist includes `0.0.0.0/0`
- ✅ Check Vercel function logs for detailed errors
- ✅ Test MongoDB connection locally first

### MongoDB Connection Failed

- ✅ Verify `mongod` is running (local development)
- ✅ Check connection string format
- ✅ Ensure MongoDB service is accessible
- ✅ Check firewall rules

### PWA Not Working

- ✅ Service worker must be registered in production
- ✅ HTTPS required for PWA (automatic on Vercel)
- ✅ Clear browser cache and reinstall

## 🎨 Customization

### Change Colors

Edit `frontend/src/index.css` to modify CSS variables:

```css
:root {
	--primary: #3b82f6;
	--secondary: #10b981;
	--danger: #ef4444;
	/* ... more colors */
}
```

### Modify Fonts

Update font-family in `index.css`:

```css
:root {
	font-family: "Your Font", sans-serif;
}
```

### Add Features

1. Create new component in `src/components/`
2. Add route in `src/App.jsx`
3. Create API endpoint in `routes/blogRoutes.js`
4. Add database model in `models/blogModel.js`

## 📱 PWA Installation

### Desktop (Chrome/Edge)

1. Visit the app URL
2. Click "Install" icon in address bar
3. Confirm installation

### Mobile (iOS)

1. Open app in Safari
2. Tap Share button
3. Select "Add to Home Screen"

### Mobile (Android)

1. Open app in Chrome
2. Tap menu (⋮)
3. Select "Add to Home Screen" or "Install app"

## 📊 Performance Features

- **Code Splitting** - Automatic with Vite
- **Image Optimization** - Sharp for auto-resizing
- **Compression** - GZip compression enabled
- **Caching** - Service worker caches assets
- **CDN** - Vercel global CDN for fast delivery
- **Database Indexing** - Optimized MongoDB queries

## 🔐 Security Features

- **CORS Protection** - Restrict cross-origin requests
- **Input Validation** - Server-side validation
- **Environment Variables** - Sensitive data protection
- **MongoDB Atlas** - Encrypted connections
- **Service Worker** - Secure offline functionality

## 📈 Future Enhancements

- [ ] User authentication and authorization
- [ ] Blog comments and discussions
- [ ] Search functionality
- [ ] Tags and categories
- [ ] Social media sharing
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] AI-powered blog suggestions

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

For issues, questions, or suggestions:

1. Check existing GitHub issues
2. Create a new issue with details
3. Include steps to reproduce
4. Attach error logs if applicable

## 🙏 Acknowledgments

Built with modern web technologies and best practices. Special thanks to:

- React ecosystem
- Express.js community
- MongoDB for great database
- Vercel for serverless hosting

---

**Happy Blogging! 🎉**

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
