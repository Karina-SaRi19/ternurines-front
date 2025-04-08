import api from './api';

let eventSource = null;

export const connectToSSE = (onMessage, onOpen, onError) => {
  if (eventSource) {
    disconnectFromSSE();
  }

  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }

  // Create EventSource connection to the server
  eventSource = new EventSource(`${api.defaults.baseURL}/events?userId=${userId}`);

  // Set up event handlers
  eventSource.onopen = () => {
    console.log('SSE connection opened');
    if (onOpen) onOpen();
  };

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('SSE message received:', data);
      if (onMessage) onMessage(data);
    } catch (error) {
      console.error('Error parsing SSE message:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('SSE connection error:', error);
    if (onError) onError(error);
    disconnectFromSSE();
  };

  return true;
};

export const disconnectFromSSE = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log('SSE connection closed');
    return true;
  }
  return false;
};

// Function to log activity manually
export const logActivity = async (type, details) => {
  try {
    await api.post('/log-activity', { type, details });
    return true;
  } catch (error) {
    console.error('Error logging activity:', error);
    return false;
  }
};

// For testing purposes
export const simulateOrderUpdate = async () => {
  try {
    const response = await api.post('/simulate-order-update');
    return response.data;
  } catch (error) {
    console.error('Error simulating order update:', error);
    throw error;
  }
};

export default {
  connectToSSE,
  disconnectFromSSE,
  logActivity,
  simulateOrderUpdate
};