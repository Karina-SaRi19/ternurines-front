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
    // Try the order-updates endpoint instead of events
    const url = `${process.env.REACT_APP_API_URL || ''}/order-updates?userId=${userId}&token=${token}`;
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
      
      // If we get a 404, try the alternative endpoint
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('Connection closed, trying alternative endpoint');
        // Try the alternative endpoint
        tryAlternativeEndpoint(userId, token, onMessage, onOpen, onError);
      } else {
        if (onError) onError(error);
      }
    };
    
    return eventSource;
  } catch (error) {
    console.error('Error establishing SSE connection:', error);
    if (onError) onError(error);
    return null;
  }
};

// Function to try alternative SSE endpoint
const tryAlternativeEndpoint = (userId, token, onMessage, onOpen, onError) => {
  try {
    // Close any existing connection
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    
    // Try with a different endpoint name
    const url = `${process.env.REACT_APP_API_URL || ''}/sse?userId=${userId}&token=${token}`;
    console.log(`Trying alternative SSE endpoint: ${url}`);
    
    eventSource = new EventSource(url);
    
    eventSource.onopen = () => {
      console.log('SSE connection opened (alternative endpoint)');
      if (onOpen) onOpen();
    };
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('SSE message received (alternative endpoint):', data);
        if (onMessage) onMessage(data);
      } catch (error) {
        console.error('Error parsing SSE message (alternative endpoint):', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE connection error (alternative endpoint):', error);
      if (onError) onError(error);
    };
    
    return eventSource;
  } catch (error) {
    console.error('Error establishing alternative SSE connection:', error);
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