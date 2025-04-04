import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Alert, Modal } from "antd";
import { requestPasswordReset, resetPassword } from "../../services/authService";

import TernuFlag from "../../images/ternuFlag1.png"; // Ajusta la ruta si es necesario

const { Title } = Typography;

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener los parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const emailFromURL = queryParams.get("email");

  // Establecer el email desde la URL cuando el componente se monta
  useEffect(() => {
    if (emailFromURL) {
      setEmail(emailFromURL);
      console.log("Email from URL:", emailFromURL);
      console.log("Token from URL:", token);
    }
  }, [emailFromURL, token]);

  const isResetMode = Boolean(token); // Verifica si el token está presente en la URL

  // Función para validar la contraseña
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8}$/;
    return regex.test(password);
  };

  // Manejar cambios en la contraseña y mostrar mensajes en rojo
  const handlePasswordChange = (e) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);

    // Validaciones en tiempo real
    if (newPasswordValue.length > 8) {
      setPasswordError("⚠ Solo se permiten 8 caracteres.");
    } else if (!/[A-Z]/.test(newPasswordValue)) {
      setPasswordError("⚠ Debe contener al menos una letra mayúscula.");
    } else if (!/[!@#$%^&*]/.test(newPasswordValue)) {
      setPasswordError("⚠ Debe contener al menos un carácter especial (!@#$%^&*).");
    } else {
      setPasswordError(""); // Limpia el mensaje si es válida
    }
  };

  // Enviar solicitud para restablecimiento de contraseña
  const sendResetLink = async () => {
    setError("");
    try {
      if (!email) {
        setError("Por favor ingresa un correo válido.");
        return;
      }

      await requestPasswordReset(email);
      // Replace alert with modal
      setModalMessage("Correo enviado. Revisa tu bandeja de entrada.");
      setIsModalVisible(true);
    } catch (error) {
      setError(error.response?.data?.error || "Error al enviar el correo.");
    }
  };

  // Restablecer contraseña con el token de la URL
  const handleResetPassword = async () => {
    setError(""); // Limpiar error previo

    if (!validatePassword(newPassword)) {
      setError("La contraseña debe tener exactamente 8 caracteres, incluir al menos una mayúscula y un carácter especial (!@#$%^&*).");
      return;
    }

    try {
      await resetPassword(token, emailFromURL, newPassword);
      // Replace alert with modal
      setModalMessage("Contraseña actualizada con éxito.");
      setIsModalVisible(true);
      // Navigate after modal is closed
    } catch (error) {
      setError(error.response?.data?.error || "Error al actualizar la contraseña.");
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    // If password was reset successfully, navigate to login
    if (modalMessage === "Contraseña actualizada con éxito.") {
      navigate("/login");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "radial-gradient(circle, rgba(45,170,158,1) 10%, rgba(152,216,239,1) 100%)" }}>
      <Card style={{ width: 400, padding: 25, textAlign: "center", borderRadius: 20, backgroundColor: "#fff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)" }}>
        <Title level={3} style={{ color: "#9C2780", fontWeight: "bold" }}>{isResetMode ? "Nueva Contraseña" : "Restablecer Contraseña"}</Title>
        <div style={{ marginBottom: 20 }}>
          <img src={TernuFlag} alt="logo" width={130} height={120} style={{ borderRadius: "50%", backgroundColor: "#E6B2BA", padding: 7, marginTop: 10, border: "4px solid #BE5985" }} />
        </div>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 15 }} />}

        {/* Paso 1: Solicitar enlace de restablecimiento */}
        {!isResetMode && (
          <Form onFinish={sendResetLink} layout="vertical">
            <Form.Item label="Correo electrónico" rules={[{ required: true, message: "Ingresa tu correo" }]}>
              <Input placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" block>Enviar Enlace</Button>
            </Form.Item>
          </Form>
        )}

        {/* Paso 2: Ingresar nueva contraseña */}
        {isResetMode && (
          <Form onFinish={handleResetPassword} layout="vertical">
            <Form.Item label="Nueva Contraseña">
              <Input.Password 
                placeholder="Nueva contraseña" 
                value={newPassword} 
                maxLength={8} 
                onChange={handlePasswordChange} 
              />
              {/* Mensaje de validación en rojo */}
              {passwordError && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{passwordError}</p>}
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" block disabled={!!passwordError}>Actualizar Contraseña</Button>
            </Form.Item>
          </Form>
        )}
      </Card>

      {/* Add Modal component */}
      <Modal
        title="Notificación"
        open={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button 
            key="ok" 
            onClick={handleModalClose}
            style={{
              backgroundColor: "#FBE59D",
              borderColor: "#9C2780",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Aceptar
          </Button>
        ]}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default ResetPassword;
