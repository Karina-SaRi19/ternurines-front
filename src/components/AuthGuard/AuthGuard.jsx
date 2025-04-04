import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      message.warning('Debes iniciar sesión para acceder a esta página');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;