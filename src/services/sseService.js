import api from "./api";

let eventSource = null;

export const connectToSSE = (onMessage, onOpen, onError) => {
    // Close existing connection if any
    if (eventSource) {
        eventSource.close();
    }

    // Get the base URL from the API configuration
    const baseURL = api.defaults.baseURL;
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('No authentication token found. Please log in first.');
    }

    // Create a new EventSource with the token in the URL
    eventSource = new EventSource(`${baseURL}/order-updates?token=${token}`);
    
    // Connection opened
    eventSource.onopen = () => {
        console.log('SSE connection opened');
        if (onOpen) onOpen();
    };
    
    // Message received
    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('SSE message received:', data);
            if (onMessage) onMessage(data);
        } catch (err) {
            console.error('Error parsing SSE message:', err);
            if (onMessage) {
                onMessage({
                    type: 'error',
                    message: `Error parsing message: ${event.data}`
                });
            }
        }
    };
    
    // Error handling
    eventSource.onerror = (err) => {
        console.error('SSE connection error:', err);
        if (onError) onError(err);
        // Close the connection on error
        eventSource.close();
    };

    return eventSource;
};

export const disconnectFromSSE = () => {
    if (eventSource) {
        eventSource.close();
        eventSource = null;
        return true;
    }
    return false;
};

export const simulateOrderUpdate = async () => {
    // This is just a test - in a real app, you'd have a real order ID
    const testOrderId = 'test-order-' + Math.floor(Math.random() * 1000);
    
    // Simulate an order status update using the API service
    const response = await api.post('/update-order-status', {
        orderId: testOrderId,
        newStatus: ['pendiente', 'procesando', 'enviado', 'entregado'][Math.floor(Math.random() * 4)]
    });
    
    return response.data;
};