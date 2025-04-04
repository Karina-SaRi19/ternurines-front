import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Modal } from "antd";
import { UserOutlined, LockOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { registerUser, verifyRegistrationCode } from "../../services/authService";

// Importa la imagen desde la carpeta assets
import logoRegistro from "../../images/LogoRegis.jpg"; 

const { Title } = Typography;

const RegistroPage = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Registro, 2: Verificación
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    console.log(values);  // Agrega este log para ver los datos
    setLoading(true);
    try {
        await registerUser(values);
        message.success("Código de verificación enviado a tu correo.");
        setEmail(values.email);
        setStep(2);
    } catch (error) {
        // Check if the error is about existing email or username
        if (error.response?.data?.error) {
            // Translate common English error messages to Spanish
            let errorMsg = error.response.data.error;
            
            // Check for specific English error messages and translate them
            if (errorMsg.includes("email address is already in use") || 
                errorMsg.includes("already exists")) {
                errorMsg = "Esta dirección de correo electrónico ya está en uso por otra cuenta.";
            } else if (errorMsg.includes("username is already taken")) {
                errorMsg = "Este nombre de usuario ya está en uso.";
            }
            
            // Check if the error message contains keywords in Spanish or our translated message
            if (errorMsg.includes("correo") || 
                errorMsg.includes("email") || 
                errorMsg.includes("usuario") ||
                errorMsg.includes("username") ||
                errorMsg.includes("ya está en uso")) {
                setErrorMessage(errorMsg);
                setErrorModalVisible(true);
            } else {
                message.error(errorMsg || "Error en el registro");
            }
        } else {
            message.error("Error en el registro. Por favor, inténtalo de nuevo.");
        }
    }
    setLoading(false);
};

const handleVerifyCode = async () => {
    if (!email || !verificationCode) {
        message.error("Por favor, ingresa el código de verificación.");
        return;
    }

    setLoading(true);
    try {
        console.log("Enviando solicitud:", { email, code: verificationCode.trim() });
        await verifyRegistrationCode(email, verificationCode.trim());

        message.success("Correo verificado correctamente. Ahora puedes iniciar sesión.");
        navigate("/login");
    } catch (error) {
        console.error("Error de verificación:", error);
        message.error(error.response?.data?.error || "Código incorrecto o expirado.");
    }
    setLoading(false);
};

  const closeErrorModal = () => {
    setErrorModalVisible(false);
  };
  
  return (
    <div
      style={{
        background: "radial-gradient(circle, rgba(45,170,158,1) 10%, rgba(152,216,239,1) 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        style={{
          width: 420,
          padding: 18,
          textAlign: "center",
          borderRadius: 20,
          backgroundColor: "#fff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        }}
      >
        {step === 1 ? (
          <>
            <Title level={3} style={{ color: "#9C2780", fontWeight: "bold" }}>
              Registro CuchiTernuras!
            </Title>

            <div style={{ marginBottom: 20 }}>
              <img
                src={logoRegistro}
                alt="logo"
                width={120}
                height={120}
                style={{
                  borderRadius: "50%",
                  backgroundColor: "#D17D98",
                  padding: 7,
                  marginTop: 10,
                }}
              />
            </div>

            <Form onFinish={handleRegister} layout="vertical">
              <Form.Item
                label="Correo Electrónico"
                name="email"
                rules={[{ required: true, type: "email", message: "Ingrese un correo válido" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#9C2780" }} />}
                  placeholder="Correo Electrónico"
                  style={{
                    height: 40,
                    fontSize: "16px",
                    borderRadius: 10,
                    backgroundColor: "#FCE4EC",
                    border: "2px solid #9C2780",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Nombre de Usuario"
                name="username"
                rules={[
                  { required: true, message: "Ingrese un nombre de usuario" },
                  { pattern: /^[^\s].*[^\s]$/, message: "El nombre de usuario no puede tener espacios al inicio o al final" },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#9C2780" }} />}
                  placeholder="Usuario"
                  style={{
                    height: 40,
                    fontSize: "16px",
                    borderRadius: 10,
                    backgroundColor: "#FCE4EC",
                    border: "2px solid #9C2780",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  { required: true, message: "Ingrese una contraseña" },
                  { min: 8, message: "La contraseña debe tener al menos 8 caracteres" },
                  { pattern: /^\S*$/, message: "La contraseña no puede contener espacios" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#9C2780" }} />}
                  placeholder="Contraseña"
                  style={{
                    height: 40,
                    fontSize: "16px",
                    borderRadius: 10,
                    backgroundColor: "#FCE4EC",
                    border: "2px solid #9C2780",
                    marginBottom: "15px",
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  block
                  loading={loading}
                  style={{
                    backgroundColor: "#FBE59D",
                    borderColor: "#9C2780",
                    color: "black",
                    height: 40,
                    fontSize: "16px",
                    borderRadius: 20,
                    fontWeight: "bold",
                    marginBottom: "18px",
                  }}
                >
                  Registrarse
                </Button>

                <p style={{ fontSize: "14px" }}>
                  ¿Ya tienes una cuenta?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    style={{
                      color: "#9C2780",
                      cursor: "pointer",
                      fontWeight: "bold",
                      textDecoration: "underline",
                    }}
                  > 
                    Inicia sesión
                  </span>
                </p>
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <Title level={2} style={{ color: "#872341" }}>Verifica tu Email</Title>
            <p>Un código de verificación fue enviado a: <b>{email}</b></p>

            <Input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Código de verificación"
              style={{
                height: 40,
                fontSize: "16px",
                borderRadius: 10,
                backgroundColor: "#FCE4EC",
                border: "2px solid #9C2780",
                padding: 7,
              }}
            />

            <Button
              htmlType="submit"
              onClick={handleVerifyCode}
              block
              style={{
                marginTop: "25px", // Agrega espacio entre el input y el botón
                backgroundColor: "#FBE59D",
                borderColor: "#9C2780",
                color: "black",
                height: 40,
                fontSize: "16px",
                borderRadius: 20,
                fontWeight: "bold",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#FFD54F";
                e.currentTarget.style.color = "black"; 
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#FBE59D";
                e.currentTarget.style.color = "black"; 
              }}
            >
              Verificar Código
            </Button>
          </>
        )}
      </Card>

      {/* Modal for existing email/username error */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', color: '#9C2780' }}>
            <ExclamationCircleOutlined style={{ marginRight: 8, fontSize: 22, color: '#FF4D4F' }} />
            <span>Error de registro</span>
          </div>
        }
        open={errorModalVisible}
        onCancel={closeErrorModal}
        footer={[
          <Button 
            key="ok" 
            onClick={closeErrorModal}
            style={{
              backgroundColor: "#FBE59D",
              borderColor: "#9C2780",
              color: "black",
              fontWeight: "bold",
              borderRadius: 20,
            }}
          >
            Entendido
          </Button>
        ]}
        centered
        bodyStyle={{ padding: '20px', fontSize: '16px' }}
      >
        <p>{errorMessage}</p>
        <p>Por favor, utiliza un correo electrónico o nombre de usuario diferente para registrarte.</p>
      </Modal>
    </div>
  );
};

export default RegistroPage;
