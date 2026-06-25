import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const evaluateFarmer = async (phoneNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/evaluate/${phoneNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error evaluating farmer:", error);
    throw error;
  }
};
