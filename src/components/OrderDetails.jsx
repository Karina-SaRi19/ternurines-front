import React, { useEffect, useState } from 'react';
import { Card, Typography, Steps, notification } from 'antd';
import orderUpdateService from '../services/orderUpdateService';

const { Title, Text } = Typography;
const { Step } = Steps;

const OrderDetails = ({ orderId, initialStatus }) => {
  const [orderStatus, setOrderStatus] = useState(initialStatus || 'pendiente');
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Function to handle order updates
    const handleOrderUpdate = (data) => {
      if (data.type === 'order_updated') {
        setOrderStatus(data.status);
        setLastUpdate(new Date());
        
        // Show notification
        notification.info({
          message: 'Actualización de Pedido',
          description: data.message,
          placement: 'topRight',
        });
      }
    };
    
    // Register listener for this specific order
    orderUpdateService.addListener(orderId, handleOrderUpdate);
    
    // Clean up on unmount
    return () => {
      orderUpdateService.removeListener(orderId, handleOrderUpdate);
    };
  }, [orderId]);

  // Map status to step number
  const getStepNumber = (status) => {
    const statusMap = {
      'pendiente': 0,
      'procesando': 1,
      'enviado': 2,
      'entregado': 3
    };
    return statusMap[status] || 0;
  };

  return (
    <Card title={<Title level={4}>Detalles del Pedido #{orderId}</Title>}>
      <Steps current={getStepNumber(orderStatus)}>
        <Step title="Pendiente" description="Pedido recibido" />
        <Step title="Procesando" description="Preparando tu pedido" />
        <Step title="Enviado" description="En camino" />
        <Step title="Entregado" description="¡Disfruta!" />
      </Steps>
      
      {lastUpdate && (
        <Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
          Última actualización: {lastUpdate.toLocaleString()}
        </Text>
      )}
    </Card>
  );
};

export default OrderDetails;