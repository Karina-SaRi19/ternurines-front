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
    }
    
    // Create a new connection with the token as a query parameter
    const url = `${process.env.REACT_APP_API_URL || ''}/events?userId=${localStorage.getItem('userId')}&token=${token}`;
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

export { connectToSSE, disconnectFromSSE };