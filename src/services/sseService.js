// Update the SSE service to connect to the correct endpoint
let eventSource = null;

const connectToSSE = (onMessage, onOpen, onError) => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No authentication token found');
      if (onError) onError(new Error('No authentication token found'));
      return null;
    }
    
    // Close any existing connection
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No user ID found');
      if (onError) onError(new Error('No user ID found'));
      return null;
    }
    
    // Create a new connection with the token as a query parameter
    // Use the /events endpoint that exists in your backend
    const url = `${process.env.REACT_APP_API_URL || ''}/events?userId=${userId}&token=${token}`;
    console.log(`Connecting to SSE at: ${url}`);
    
    eventSource = new EventSource(url);
    
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
    };
    
    return eventSource;
  } catch (error) {
    console.error('Error establishing SSE connection:', error);
    if (onError) onError(error);
    return null;
  }
};

const disconnectFromSSE = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log('SSE connection closed');
  }
};

// Add the logActivity function to log user activities
const logActivity = async (type, message, details = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found for logging activity');
      return null;
    }

    // Call the backend API to log the activity
    const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/log-activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        type,
        message,
        details
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to log activity: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Activity logged successfully:', data);
    return data.activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    return null;
  }
};

export { connectToSSE, disconnectFromSSE, logActivity };