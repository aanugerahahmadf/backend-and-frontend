# Application Access Guide

## Servers

1. **Backend API Server**: http://127.0.0.1:8000
2. **Frontend Application**: http://localhost:3000

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

## Frontend Pages

- Home: http://localhost:3000
- Maps: http://localhost:3000/maps
- Playlist: http://localhost:3000/playlist
- Contact: http://localhost:3000/contact
- API Test: http://localhost:3000/api-test

## Testing API Connectivity

You can test the API connectivity in several ways:

1. **Using the API Test Page**: Visit http://localhost:3000/api-test
2. **Using curl commands**:
   ```bash
   curl -X GET http://127.0.0.1:8000/api/v1/stats
   curl -X GET http://127.0.0.1:8000/api/v1/buildings
   ```
3. **Direct browser access**: Open any of the API endpoints directly in your browser

## Services Implementation

The frontend uses Axios-based services for all backend communication:

- `services/api.ts` - Base Axios configuration
- `services/statsService.ts` - Statistics data service
- `services/buildingsService.ts` - Buildings data service
- `services/roomsService.ts` - Rooms data service
- `services/cctvService.ts` - CCTV data service
- `services/contactsService.ts` - Contacts data service

All services are properly connected to the backend API at `http://127.0.0.1:8000/api/v1`.