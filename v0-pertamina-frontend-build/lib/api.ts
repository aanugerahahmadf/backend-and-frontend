import axios, { AxiosError } from 'axios';

// Define TypeScript interfaces for our data models
interface Building {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  rooms?: Room[];
}

interface Room {
  id: string;
  name: string;
  building_id: string;
  created_at: string;
  updated_at: string;
  cctvs?: Cctv[];
}

interface Cctv {
  id: string;
  name: string;
  rtsp_url: string;
  room_id: string;
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  address: string;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total_buildings: number;
  total_rooms: number;
  total_cctvs: number;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  // Stats
  getStats: async (): Promise<Stats> => {
    try {
      const response = await apiClient.get<Stats>('/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      throw error;
    }
  },

  // Buildings
  getBuildings: async (): Promise<Building[]> => {
    try {
      const response = await apiClient.get<Building[]>('/buildings');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
      throw error;
    }
  },

  getBuilding: async (id: string): Promise<Building> => {
    try {
      const response = await apiClient.get<Building>(`/buildings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch building ${id}:`, error);
      throw error;
    }
  },

  // Rooms
  getRooms: async (): Promise<Room[]> => {
    try {
      const response = await apiClient.get<Room[]>('/rooms');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      throw error;
    }
  },

  getRoomsByBuilding: async (buildingId: string): Promise<Room[]> => {
    try {
      const response = await apiClient.get<Room[]>(`/rooms/building/${buildingId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch rooms for building ${buildingId}:`, error);
      throw error;
    }
  },

  getRoom: async (id: string): Promise<Room> => {
    try {
      const response = await apiClient.get<Room>(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch room ${id}:`, error);
      throw error;
    }
  },

  // CCTVs
  getCctvs: async (): Promise<Cctv[]> => {
    try {
      const response = await apiClient.get<Cctv[]>('/cctvs');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch CCTVs:', error);
      throw error;
    }
  },

  getCctvsByRoom: async (roomId: string): Promise<Cctv[]> => {
    try {
      const response = await apiClient.get<Cctv[]>(`/cctvs/room/${roomId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch CCTVs for room ${roomId}:`, error);
      throw error;
    }
  },

  getCctv: async (id: string): Promise<Cctv> => {
    try {
      const response = await apiClient.get<Cctv>(`/cctvs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch CCTV ${id}:`, error);
      throw error;
    }
  },

  getCctvStreamUrl: async (id: string): Promise<{ stream_url: string }> => {
    try {
      const response = await apiClient.get<{ stream_url: string }>(`/cctvs/${id}/stream-url`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch stream URL for CCTV ${id}:`, error);
      throw error;
    }
  },

  // Contacts
  getContacts: async (): Promise<Contact[]> => {
    try {
      const response = await apiClient.get<Contact[]>('/contacts');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      throw error;
    }
  },
};