import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Button, Tag, Divider, Alert, Space } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SSETestPage = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Clean up function to close the connection when component unmounts
    return () => {
      if (window.eventSource) {
        window.eventSource.close();
        console.log('SSE connection closed');
      }
    };
  }, []);

  const connectToSSE = () => {
    setError(null);
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in first.');
      return;
    }

    try {
      // Close existing connection if any
      if (window.eventSource) {
        window.eventSource.close();
      }

      // Create a new EventSource with the token in the URL
      window.eventSource = new EventSource(`http://localhost:3000/order-updates?token=${token}`);
      
      // Connection opened
      window.eventSource.onopen = () => {
        console.log('SSE connection opened');
        setConnected(true);
        addMessage({
          type: 'system',
          message: 'Connection established with server',
          timestamp: new Date()
        });
      };
      
      // Message received
      window.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('SSE message received:', data);
          
          addMessage({
            type: data.type || 'unknown',
            message: data.message || JSON.stringify(data),
            data: data,
            timestamp: new Date()
          });
        } catch (err) {
          console.error('Error parsing SSE message:', err);
          addMessage({
            type: 'error',
            message: `Error parsing message: ${event.data}`,
            timestamp: new Date()
          });
        }
      };
      
      // Error handling
      window.eventSource.onerror = (err) => {
        console.error('SSE connection error:', err);
        setConnected(false);
        setError('Connection error. The server might be down or you may not be authenticated.');
        
        // Close the connection on error
        window.eventSource.close();
      };
      
    } catch (err) {
      console.error('Failed to establish SSE connection:', err);
      setError(`Failed to establish connection: ${err.message}`);
    }
  };

  const disconnectFromSSE = () => {
    if (window.eventSource) {
      window.eventSource.close();
      window.eventSource = null;
      setConnected(false);
      addMessage({
        type: 'system',
        message: 'Disconnected from server',
        timestamp: new Date()
      });
    }
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [message, ...prevMessages]);
  };

  const simulateOrderUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in first.');
        return;
      }

      // This is just a test - in a real app, you'd have a real order ID
      const testOrderId = 'test-order-' + Math.floor(Math.random() * 1000);
      
      // Simulate an order status update
      const response = await fetch('http://localhost:3000/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: testOrderId,
          newStatus: ['pendiente', 'procesando', 'enviado', 'entregado'][Math.floor(Math.random() * 4)]
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        addMessage({
          type: 'system',
          message: `Simulated order update sent: ${data.message}`,
          timestamp: new Date()
        });
      } else {
        setError(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error simulating order update:', err);
      setError(`Error simulating order update: ${err.message}`);
    }
  };

  // Function to get the appropriate icon for message type
  const getMessageIcon = (type) => {
    switch (type) {
      case 'connection':
        return <CheckCircleOutlined style={{ color: 'green' }} />;
      case 'order_updated':
        return <SyncOutlined style={{ color: 'blue' }} />;
      case 'system':
        return <ClockCircleOutlined style={{ color: 'gray' }} />;
      case 'error':
        return <ClockCircleOutlined style={{ color: 'red' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>SSE Test Page</Title>
        <Text>This page helps you test the Server-Sent Events (SSE) implementation.</Text>
        
        <Divider />
        
        <Space direction="vertical" style={{ width: '100%' }}>
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}
          
          <Space>
            <Button 
              type="primary" 
              onClick={connectToSSE} 
              disabled={connected}
            >
              Connect to SSE
            </Button>
            
            <Button 
              danger 
              onClick={disconnectFromSSE} 
              disabled={!connected}
            >
              Disconnect
            </Button>
            
            <Button 
              onClick={simulateOrderUpdate}
            >
              Simulate Order Update
            </Button>
          </Space>
          
          <div style={{ marginTop: '10px' }}>
            Status: {connected ? 
              <Tag color="green">Connected</Tag> : 
              <Tag color="red">Disconnected</Tag>
            }
          </div>
        </Space>
        
        <Divider />
        
        <Title level={4}>Event Log</Title>
        <List
          bordered
          dataSource={messages}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={getMessageIcon(item.type)}
                title={
                  <span>
                    <Tag color={
                      item.type === 'connection' ? 'green' : 
                      item.type === 'order_updated' ? 'blue' :
                      item.type === 'system' ? 'default' :
                      item.type === 'error' ? 'red' : 'purple'
                    }>
                      {item.type}
                    </Tag>
                    <Text type="secondary" style={{ marginLeft: '10px' }}>
                      {item.timestamp.toLocaleTimeString()}
                    </Text>
                  </span>
                }
                description={item.message}
              />
              {item.data && item.data.orderId && (
                <div>
                  <Text strong>Order ID: </Text>
                  <Text>{item.data.orderId}</Text>
                  {item.data.status && (
                    <>
                      <br />
                      <Text strong>Status: </Text>
                      <Tag color={
                        item.data.status === 'pendiente' ? 'orange' :
                        item.data.status === 'procesando' ? 'blue' :
                        item.data.status === 'enviado' ? 'cyan' :
                        item.data.status === 'entregado' ? 'green' : 'default'
                      }>
                        {item.data.status}
                      </Tag>
                    </>
                  )}
                </div>
              )}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default SSETestPage;