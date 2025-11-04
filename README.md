# Kilang CCTV Monitoring System

This is a full-stack CCTV monitoring system built with Laravel (backend) and Next.js (frontend).

## Features

- Real-time CCTV streaming
- Building and room management
- Contact information management
- Admin dashboard with Filament
- RESTful API for frontend integration

## Tech Stack

### Backend
- Laravel 12.x
- PHP 8.3+
- MySQL/SQLite database
- Filament for admin panel
- FFmpeg for video streaming

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios for API requests

## Setup Instructions

1. Clone the repository
2. Set up the Laravel backend:
   - Configure `.env` file
   - Run `composer install`
   - Run `php artisan migrate`
   - Run `php artisan db:seed`
3. Set up the Next.js frontend:
   - Run `npm install`
   - Run `npm run dev`
4. Start streaming services:
   - Run `setup-ffmpeg.bat` to install FFmpeg
   - Run `start-streaming.bat` to start streaming

## API Endpoints

All API endpoints are available at `/api/v1/`:
- `/api/v1/stats` - System statistics
- `/api/v1/buildings` - Building information
- `/api/v1/rooms` - Room information
- `/api/v1/cctvs` - CCTV information
- `/api/v1/contacts` - Contact information

## Deployment

The system can be deployed in two ways:
1. Separate servers for frontend and backend
2. Unified deployment with Laravel serving the Next.js frontend

## License

This project is proprietary and confidential.