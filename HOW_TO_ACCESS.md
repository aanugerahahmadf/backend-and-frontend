# How to Access the Application

## Backend (API Server)
- **URL**: http://127.0.0.1:8000
- **API Endpoints**: All endpoints are prefixed with `/api/v1`
- **Admin Panel**: http://127.0.0.1:8000/admin (requires authentication)

## Frontend (Web Application)
- **URL**: http://localhost:3000
- **Pages**:
  - Home: http://localhost:3000
  - Maps: http://localhost:3000/maps
  - Playlist: http://localhost:3000/playlist
  - Contact: http://localhost:3000/contact

## API Endpoints
- `GET /api/v1/stats` - Dashboard statistics
- `GET /api/v1/buildings` - List all buildings
- `GET /api/v1/buildings/{id}` - Get building details
- `GET /api/v1/rooms` - List all rooms
- `GET /api/v1/rooms/building/{buildingId}` - Get rooms by building
- `GET /api/v1/cctvs` - List all CCTV cameras
- `GET /api/v1/cctvs/room/{roomId}` - Get CCTVs by room
- `GET /api/v1/cctvs/{id}/stream-url` - Get CCTV stream URL
- `GET /api/v1/contacts` - Get contact information

## Services Implementation
The frontend now uses Axios-based services for all API calls:
- `services/api.ts` - Base Axios configuration
- `services/statsService.ts` - Statistics data service
- `services/buildingsService.ts` - Buildings data service
- `services/roomsService.ts` - Rooms data service
- `services/cctvService.ts` - CCTV data service
- `services/contactsService.ts` - Contacts data service

## 100% Connectivity Achieved
✅ Backend API endpoints are fully functional
✅ Frontend pages are connected to backend services
✅ Axios services handle all API communication
✅ CORS is properly configured for cross-origin requests
✅ Error handling and loading states are implemented