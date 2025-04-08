import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Button, Tag, Divider, Alert, Space } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined, ArrowLeftOutlined, ShoppingCartOutlined, HeartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { connectToSSE, disconnectFromSSE, simulateOrderUpdate } from '../../services/sseService';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const SSETestPage = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    // Load initial activity logs when component mounts
    loadInitialActivityLogs();
  }, []);

  const loadInitialActivityLogs = () => {
    // Simulated activity logs - in a real app, these would come from your backend
    const activityLogs = [
      {
        type: 'login',
        message: 'Usuario inició sesión',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        data: {}
      },
      {
        type: 'cart_add',
        message: 'Producto "Peluche Oso Panda" añadido al carrito',
        timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
        data: { productId: '12345', productName: 'Peluche Oso Panda' }
      },
      {
        type: 'favorite_add',
        message: 'Producto "Peluche Unicornio" añadido a favoritos',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        data: { productId: '67890', productName: 'Peluche Unicornio' }
      },
      {
        type: 'profile_edit',
        message: 'Información de perfil actualizada',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        data: {}
      },
      {
        type: 'purchase',
        message: 'Compra realizada exitosamente',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        data: { orderId: 'ORD-2023-001', total: '$1,250.00' }
      }
    ];

    setMessages(activityLogs);
  };

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
            message: 'Conexión establecida con el servidor',
            timestamp: new Date()
          });
        },
        // onError callback
        (err) => {
          setConnected(false);
          setError('Error de conexión. El servidor podría estar caído o no estás autenticado.');
        }
      );
    } catch (err) {
      console.error('Failed to establish SSE connection:', err);
      setError(`Error al establecer conexión: ${err.message}`);
    }
  };

  const handleDisconnectFromSSE = () => {
    if (disconnectFromSSE()) {
      setConnected(false);
      addMessage({
        type: 'system',
        message: 'Desconectado del servidor',
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
        type: 'purchase',
        message: `Nueva compra realizada: ${data.message}`,
        timestamp: new Date(),
        data: { orderId: `ORD-${Math.floor(Math.random() * 10000)}`, status: 'procesando' }
      });
    } catch (err) {
      console.error('Error simulating order update:', err);
      setError(`Error al simular actualización de orden: ${err.message}`);
    }
  };

  const handleReturnToHelp = () => {
    navigate('/ayuda');
  };

  // Function to get the appropriate icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'login':
        return <UserOutlined style={{ color: 'green' }} />;
      case 'logout':
        return <LogoutOutlined style={{ color: 'red' }} />;
      case 'purchase':
        return <ShoppingCartOutlined style={{ color: 'blue' }} />;
      case 'cart_add':
        return <ShoppingCartOutlined style={{ color: 'orange' }} />;
      case 'favorite_add':
        return <HeartOutlined style={{ color: 'pink' }} />;
      case 'profile_edit':
        return <UserOutlined style={{ color: 'purple' }} />;
      case 'system':
        return <ClockCircleOutlined style={{ color: 'gray' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Title level={2}>Registro de Actividad del Usuario</Title>
          <Button 
            type="primary" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleReturnToHelp}
          >
            Regresar a Ayuda
          </Button>
        </div>
        
        <Text>Esta página muestra un registro de tu actividad reciente en la plataforma.</Text>
        
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
              Conectar a notificaciones en tiempo real
            </Button>
            
            <Button 
              danger 
              onClick={handleDisconnectFromSSE} 
              disabled={!connected}
            >
              Desconectar
            </Button>
            
            <Button 
              onClick={handleSimulateOrderUpdate}
            >
              Simular nueva actividad
            </Button>
          </Space>
          
          <div style={{ marginTop: '10px' }}>
            Estado de notificaciones: {connected ? 
              <Tag color="green">Conectado</Tag> : 
              <Tag color="red">Desconectado</Tag>
            }
          </div>
        </Space>
        
        <Divider />
        
        <Title level={4}>Historial de Actividad</Title>
        <List
          bordered
          dataSource={messages}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={getActivityIcon(item.type)}
                title={
                  <span>
                    <Tag color={
                      item.type === 'login' ? 'green' : 
                      item.type === 'logout' ? 'red' :
                      item.type === 'purchase' ? 'blue' :
                      item.type === 'cart_add' ? 'orange' :
                      item.type === 'favorite_add' ? 'pink' :
                      item.type === 'profile_edit' ? 'purple' :
                      item.type === 'system' ? 'default' : 'cyan'
                    }>
                      {item.type === 'login' ? 'Inicio de sesión' :
                       item.type === 'logout' ? 'Cierre de sesión' :
                       item.type === 'purchase' ? 'Compra' :
                       item.type === 'cart_add' ? 'Añadido al carrito' :
                       item.type === 'favorite_add' ? 'Añadido a favoritos' :
                       item.type === 'profile_edit' ? 'Edición de perfil' :
                       item.type === 'system' ? 'Sistema' : item.type}
                    </Tag>
                    <Text type="secondary" style={{ marginLeft: '10px' }}>
                      {item.timestamp.toLocaleString()}
                    </Text>
                  </span>
                }
                description={item.message}
              />
              {item.data && item.data.orderId && (
                <div>
                  <Text strong>ID de Orden: </Text>
                  <Text>{item.data.orderId}</Text>
                  {item.data.status && (
                    <>
                      <br />
                      <Text strong>Estado: </Text>
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
                  {item.data.total && (
                    <>
                      <br />
                      <Text strong>Total: </Text>
                      <Text>{item.data.total}</Text>
                    </>
                  )}
                </div>
              )}
              {item.data && item.data.productName && (
                <div>
                  <Text strong>Producto: </Text>
                  <Text>{item.data.productName}</Text>
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