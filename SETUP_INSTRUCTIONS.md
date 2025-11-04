# Setup Instructions - CCTV Monitoring System

## Backend Setup (Laravel + Filament v4)

### 1. Install Dependencies
```bash
cd backend
composer install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Setup
```bash
php artisan migrate
php artisan db:seed
```

### 4. Run Required Migrations for Filament
```bash
php artisan make:queue-batches-table
php artisan make:notifications-table
php artisan vendor:publish --tag=filament-actions-migrations
php artisan migrate
```

### 5. Create Roles
The seeder will create:
- Super Admin role (full access)
- User Interface role (view only: Home, Maps, Playlist, Contact)

### 6. Start Backend Server
```bash
php artisan serve
# Backend runs on http://localhost:8000
# Admin panel at http://localhost:8000/admin
```

## Frontend Setup (React + TypeScript)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create `.env` file in frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 3. Start Frontend Development Server
```bash
npm run dev
# Frontend runs on http://localhost:5173 (or similar)
```

## API Endpoints

All API endpoints are prefixed with `/api/v1`:

- `GET /api/v1/stats` - Dashboard statistics
- `GET /api/v1/buildings` - List all buildings
- `GET /api/v1/buildings/{id}` - Get building details
- `GET /api/v1/rooms` - List all rooms
- `GET /api/v1/rooms/building/{buildingId}` - Get rooms by building
- `GET /api/v1/cctvs` - List all CCTV cameras
- `GET /api/v1/cctvs/room/{roomId}` - Get CCTVs by room
- `GET /api/v1/cctvs/{id}/stream-url` - Get CCTV stream URL
- `GET /api/v1/contacts` - Get contact information

## Features Implemented

### Backend
✅ Filament v4 Admin Panel with role-based permissions
✅ CRUD for Buildings, Rooms, CCTV, Contacts
✅ Dashboard widgets (Stats, Line Chart, Bar Chart)
✅ API endpoints for frontend
✅ CORS configuration
✅ Database notifications

### Frontend
✅ Home page with stats and charts (Recharts)
✅ Maps page with OpenStreetMap and Satellite view
✅ Building/Room markers with zoom functionality
✅ Search functionality for buildings
✅ Playlist navigation (Building → Room → CCTV → Live Stream)
✅ Contact page with 3D cards and clickable actions
✅ Responsive design (Mobile/Tablet/Desktop)
✅ Real-time data fetching from API

## Admin Panel Features

### Super Admin Role
- Full access to all CRUD operations
- Manage Buildings, Rooms, CCTV cameras, Contacts
- View dashboard with statistics and charts

### User Interface Role
- View only access to:
  - Home (stats and charts)
  - Maps (interactive map)
  - Playlist (building/room/cctv navigation)
  - Contact (contact information)

## CCTV Streaming

The system supports RTSP streaming URLs. For production use:
1. Set up a streaming server (e.g., Node Media Server)
2. Configure FFmpeg to convert RTSP to HLS or HTTP-FLV
3. Update the stream URL generation in `CctvController::getStreamUrl()`

## Notes

- All data is fetched from the backend API
- No hardcoded data in frontend
- Responsive design works on all screen sizes
- 3D card effects on Contact page
- Modal dialogs for detailed views
- Search functionality on all list pages

