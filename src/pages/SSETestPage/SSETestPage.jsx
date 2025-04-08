import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Button, Tag, Divider, Alert, Space, Layout, Spin } from 'antd';
import { ClockCircleOutlined, ShoppingCartOutlined, HeartOutlined, UserOutlined, LogoutOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { connectToSSE, disconnectFromSSE } from '../../services/sseService';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;
const { Content } = Layout;

const SSETestPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load historical activities and connect to SSE
    loadUserActivities();
    initializeSSEConnection();
    
    // Clean up function to close the connection when component unmounts
    return () => {
      disconnectFromSSE();
      console.log('SSE connection closed');
    };
  }, []);

  const loadUserActivities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user-activities');
      
      if (response.data && response.data.activities) {
        // Format activities for display
        const formattedActivities = response.data.activities.map(activity => ({
          type: activity.type,
          message: activity.message || '',
          data: activity,
          timestamp: new Date(activity.timestamp)
        }));
        
        setMessages(formattedActivities);
      }
    } catch (error) {
      console.error('Error loading user activities:', error);
      setError('No se pudieron cargar las actividades recientes. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const initializeSSEConnection = () => {
    try {
      // Connect to SSE for real-time updates
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
          console.log('SSE connection established');
        },
        // onError callback
        (err) => {
          console.error('SSE connection error:', err);
          setError('No se pudo establecer conexión con el servidor de actividad. Algunas actualizaciones podrían no mostrarse en tiempo real.');
        }
      );
    } catch (err) {
      console.error('Failed to initialize SSE connection:', err);
      setError('Error al inicializar la conexión de actividad en tiempo real.');
    }
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [message, ...prevMessages]);
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
      case 'cart_remove':
        return <ShoppingCartOutlined style={{ color: 'red' }} />;
      case 'cart_clear':
        return <ShoppingCartOutlined style={{ color: 'gray' }} />;
      case 'favorite_add':
        return <HeartOutlined style={{ color: 'pink' }} />;
      case 'favorite_remove':
        return <HeartOutlined style={{ color: 'gray' }} />;
      case 'profile_edit':
        return <UserOutlined style={{ color: 'purple' }} />;
      case 'system':
        return <ClockCircleOutlined style={{ color: 'gray' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: '20px' }}>
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
          
          <Text>Esta página muestra un registro de tu actividad reciente en la plataforma en tiempo real.</Text>
          
          <Divider />
          
          {error && (
            <Alert
              message="Aviso"
              description={error}
              type="warning"
              showIcon
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: '20px' }}
            />
          )}
          
          <Title level={4}>Historial de Actividad</Title>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <p style={{ marginTop: '16px' }}>Cargando actividades...</p>
            </div>
          ) : (
            <List
              bordered
              dataSource={messages}
              locale={{ emptyText: 'No hay actividades registradas' }}
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
                          item.type === 'cart_remove' ? 'red' :
                          item.type === 'cart_clear' ? 'default' :
                          item.type === 'favorite_add' ? 'pink' :
                          item.type === 'favorite_remove' ? 'default' :
                          item.type === 'profile_edit' ? 'purple' :
                          item.type === 'system' ? 'default' : 'cyan'
                        }>
                          {item.type === 'login' ? 'Inicio de sesión' :
                           item.type === 'logout' ? 'Cierre de sesión' :
                           item.type === 'purchase' ? 'Compra' :
                           item.type === 'cart_add' ? 'Añadido al carrito' :
                           item.type === 'cart_remove' ? 'Eliminado del carrito' :
                           item.type === 'cart_clear' ? 'Carrito vaciado' :
                           item.type === 'favorite_add' ? 'Añadido a favoritos' :
                           item.type === 'favorite_remove' ? 'Eliminado de favoritos' :
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
                          <Text>${item.data.total}</Text>
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
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default SSETestPage;