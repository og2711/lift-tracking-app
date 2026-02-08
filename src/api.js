import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', 
});

// GET all lifts from the cloud
export const getLifts = () => API.get('/lifts');

// POST a new lift to the cloud
export const saveLift = (liftData) => API.post('/lifts', liftData);

// POST profile updates to the cloud
export const updateProfile = (profileData) => API.post('/profile', profileData);

// Check if server is alive
export const checkServerHealth = () => API.get('/health');

export default API;