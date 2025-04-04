// Service for handling real-time order updates using SSE

class OrderUpdateService {
  constructor() {
    this.eventSource = null;
    this.listeners = new Map();
  }

  // Connect to the SSE endpoint
  connect() {
    if (this.eventSource) {
      this.disconnect();
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return false;
    }

    try {
      this.eventSource = new EventSource(`http://localhost:3000/order-updates`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners(data);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        this.disconnect();
        
        // Try to reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
      };

      return true;
    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
      return false;
    }
  }

  // Disconnect from the SSE endpoint
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  // Add a listener for order updates
  addListener(orderId, callback) {
    if (!this.listeners.has(orderId)) {
      this.listeners.set(orderId, []);
    }
    this.listeners.get(orderId).push(callback);
    
    // Connect if not already connected
    if (!this.eventSource) {
      this.connect();
    }
  }

  // Remove a listener
  removeListener(orderId, callback) {
    if (this.listeners.has(orderId)) {
      const callbacks = this.listeners.get(orderId);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      
      // If no more callbacks for this order, remove the entry
      if (callbacks.length === 0) {
        this.listeners.delete(orderId);
      }
      
      // If no more listeners at all, disconnect
      if (this.listeners.size === 0) {
        this.disconnect();
      }
    }
  }

  // Notify all relevant listeners about an update
  notifyListeners(data) {
    if (data.orderId && this.listeners.has(data.orderId)) {
      const callbacks = this.listeners.get(data.orderId);
      callbacks.forEach(callback => callback(data));
    }
    
    // Also notify global listeners (those listening to all orders)
    if (this.listeners.has('all')) {
      const callbacks = this.listeners.get('all');
      callbacks.forEach(callback => callback(data));
    }
  }
}

// Create and export a singleton instance
const orderUpdateService = new OrderUpdateService();
export default orderUpdateService;