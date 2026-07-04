import axios from 'axios';
import { io } from 'socket.io-client';

// The base URLs for Darshni's backend
const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000'; // Sockets run on the main domain

// 1. Initialize the Real-Time Pager (WebSocket Connection)
export const socket = io(SOCKET_URL, {
  autoConnect: false, // We will turn this on manually when the app loads
});

// 2. Your existing Axios API Service
export const queueService = {
  joinQueue: async (customerData) => {
    try {
      const response = await axios.post(`${API_URL}/queue/join`, customerData);
      return response.data; 
    } catch (error) {
      console.error("Error joining queue:", error.response?.data || error.message);
      throw error;
    }
  },

  getQueue: async () => {
    try {
      const response = await axios.get(`${API_URL}/queue`);
      return response.data;
    } catch (error) {
      console.error("Error fetching queue:", error.response?.data || error.message);
      throw error;
    }
  },

  completeService: async (customerId) => {
    try {
      const response = await axios.put(`${API_URL}/queue/complete/${customerId}`);
      return response.data;
    } catch (error) {
      console.error("Error completing service:", error.response?.data || error.message);
      throw error;
    }
  }
};