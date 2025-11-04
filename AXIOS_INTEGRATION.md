# Axios Integration Documentation

## Overview
This document explains how Axios has been integrated into the frontend application to handle API requests to the Laravel backend.

## Implementation Details

### 1. Installation
Axios was installed using npm with the legacy peer dependencies flag to avoid conflicts:
```bash
npm install axios --legacy-peer-deps
```

### 2. API Service Update
The [api.ts](file:///d:/Kilang/v0-pertamina-frontend-build/lib/api.ts) file in `v0-pertamina-frontend-build/lib/` was updated to use Axios instead of the native fetch API.

#### Key Changes:
- Imported Axios: `import axios from 'axios';`
- Created an Axios instance with base URL configuration
- Added TypeScript interfaces for better type safety
- Implemented error handling with Axios interceptors
- Updated all API methods to use Axios

### 3. Usage Examples

#### Before (with fetch):
```typescript
const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${url}`, error);
    throw error;
  }
};
```

#### After (with Axios):
```typescript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example method
getStats: async (): Promise<Stats> => {
  try {
    const response = await apiClient.get<Stats>('/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    throw error;
  }
},
```

## Benefits of Using Axios

1. **Better Error Handling**: Axios provides more detailed error information
2. **Interceptors**: Request and response interceptors for global handling
3. **Automatic Transformations**: Automatic transformation of request and response data
4. **Cancelation**: Request cancelation capabilities
5. **Timeouts**: Built-in timeout support
6. **TypeScript Support**: Better TypeScript integration with typed responses

## Testing

Several test pages were created to verify the Axios integration:
1. `/api-test` - Tests the updated API service
2. `/api-test/axios-test` - Direct Axios implementation test
3. `/api-test/updated-api-test` - Updated API service test

## Backend Configuration

The Laravel backend is configured to accept requests from any origin through the CORS configuration in `config/cors.php`:
```php
'allowed_origins' => ['*'],
```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   php artisan serve
   ```

2. Start the frontend development server:
   ```bash
   cd v0-pertamina-frontend-build
   npm run dev
   ```

3. Access the application at http://localhost:3000

## API Endpoints

The frontend connects to the backend API at `http://127.0.0.1:8000/api/v1/` with the following endpoints:
- `/stats` - Dashboard statistics
- `/buildings` - Building information
- `/rooms` - Room information
- `/cctvs` - CCTV information
- `/contacts` - Contact information