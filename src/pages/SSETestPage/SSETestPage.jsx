import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Button, Tag, Divider, Alert, Space } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { connectToSSE, disconnectFromSSE, simulateOrderUpdate } from '../../services/sseService';

const { Title, Text } = Typography;

const SSETestPage = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Clean up function to close the connection when component unmounts
    return () => {
      disconnectFromSSE();
      console.log('SSE connection closed');
    };
  }, []);

  const handleConnectToSSE = () => {
    setError(null);
    
    try {
      connectToSSE(
        // onMessage callback
        (data) => {
          addMessage({
            type: data.type || 'unknown',
            message: data.message || JSON.stringify(data),
            data: data,
            timestamp: new Date()
          });
        },
        // onOpen callback
        () => {
          setConnected(true);
          addMessage({
            type: 'system',
            message: 'Connection established with server',
            timestamp: new Date()
          });
        },
        // onError callback
        (err) => {
          setConnected(false);
          setError('Connection error. The server might be down or you may not be authenticated.');
        }
      );
    } catch (err) {
      console.error('Failed to establish SSE connection:', err);
      setError(`Failed to establish connection: ${err.message}`);
    }
  };

  const handleDisconnectFromSSE = () => {
    if (disconnectFromSSE()) {
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

  const handleSimulateOrderUpdate = async () => {
    try {
      const data = await simulateOrderUpdate();
      
      addMessage({
        type: 'system',
        message: `Simulated order update sent: ${data.message}`,
        timestamp: new Date()
      });
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
              onClick={handleConnectToSSE} 
              disabled={connected}
            >
              Connect to SSE
            </Button>
            
            <Button 
              danger 
              onClick={handleDisconnectFromSSE} 
              disabled={!connected}
            >
              Disconnect
            </Button>
            
            <Button 
              onClick={handleSimulateOrderUpdate}
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