import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Button, Tag, Divider, Alert, Space, Layout, Spin, notification } from 'antd';
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
  const [isConnected, setIsConnected] = useState(false);

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
          console.log('New activity received:', data);
          
          // Format the activity data for display
          const newActivity = {
            type: data.type || 'unknown',
            message: data.message || '',
            data: data,
            timestamp: new Date()
          };
          
          // Add the new activity to the list
          addMessage(newActivity);
          
          // Show notification for new activity
          notification.info({
            message: 'Nueva actividad detectada',
            description: newActivity.message || `Actividad de tipo: ${newActivity.type}`,
            placement: 'topRight'
          });
        },
        // onOpen callback
        () => {
          console.log('SSE connection established');
          setIsConnected(true);
          setError(null);
        },
        // onError callback
        (err) => {
          console.error('SSE connection error:', err);
          setIsConnected(false);
          setError('No se pudo establecer conexión con el servidor de actividad. Algunas actualizaciones podrían no mostrarse en tiempo real.');
        }
      );
    } catch (err) {
      console.error('Failed to initialize SSE connection:', err);
      setIsConnected(false);
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


  // Function to render detailed activity information
  const renderActivityDetails = (item) => {
    switch (item.type) {
      case 'purchase':
        return (
          <div>
            {item.data.orderId && (
              <>
                <Text strong>ID de Orden: </Text>
                <Text>{item.data.orderId}</Text>
                <br />
              </>
            )}
            {item.data.total && (
              <>
                <Text strong>Total: </Text>
                <Text>${parseFloat(item.data.total).toFixed(2)}</Text>
                <br />
              </>
            )}
            {item.data.items && item.data.items.length > 0 && (
              <>
                <Text strong>Productos: </Text>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                  {item.data.items.map((product, index) => (
                    <li key={index}>
                      {product.nombre} x {product.cantidad} - ${parseFloat(product.precio * product.cantidad).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        );
      
      case 'cart_add':
      case 'cart_remove':
        return (
          <div>
            {item.data.productName && (
              <>
                <Text strong>Producto: </Text>
                <Text>{item.data.productName}</Text>
                <br />
              </>
            )}
            {item.data.productType && (
              <>
                <Text strong>Tipo: </Text>
                <Text>{item.data.productType}</Text>
                <br />
              </>
            )}
            {item.data.productId && (
              <>
                <Text strong>ID: </Text>
                <Text>{item.data.productId}</Text>
              </>
            )}
          </div>
        );
      
      case 'favorite_add':
      case 'favorite_remove':
        return (
          <div>
            {item.data.productName && (
              <>
                <Text strong>Producto: </Text>
                <Text>{item.data.productName}</Text>
                <br />
              </>
            )}
            {item.data.productId && (
              <>
                <Text strong>ID: </Text>
                <Text>{item.data.productId}</Text>
              </>
            )}
          </div>
        );
      
      case 'order_updated':
        return (
          <div>
            {item.data.orderId && (
              <>
                <Text strong>ID de Orden: </Text>
                <Text>{item.data.orderId}</Text>
                <br />
              </>
            )}
            {item.data.status && (
              <>
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
          </div>
        );
      
      default:
        // For other activity types, just show any available data
        return Object.keys(item.data || {})
          .filter(key => 
            key !== 'type' && 
            key !== 'message' && 
            key !== 'timestamp' && 
            typeof item.data[key] !== 'object'
          )
          .map(key => (
            <div key={key}>
              <Text strong>{key.charAt(0).toUpperCase() + key.slice(1)}: </Text>
              <Text>{item.data[key]}</Text>
            </div>
          ));
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: '20px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Title level={2}>Monitoreo de Actividad en Tiempo Real</Title>
            <Button 
              type="primary" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleReturnToHelp}
            >
              Regresar a Ayuda
            </Button>
          </div>
          
          <Text>Esta página muestra un monitoreo en tiempo real de la actividad del usuario en la plataforma.</Text>
          
          <Divider />
          
          <div style={{ marginBottom: '20px' }}>
            <Tag color={isConnected ? 'green' : 'red'} style={{ padding: '5px 10px' }}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Tag>
            <Button 
              type="primary" 
              size="small" 
              onClick={initializeSSEConnection} 
              style={{ marginLeft: '10px' }}
              disabled={isConnected}
            >
              Reconectar
            </Button>
          </div>
          
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
          
          <Title level={4}>Actividad Reciente</Title>
          
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
                  {renderActivityDetails(item)}
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