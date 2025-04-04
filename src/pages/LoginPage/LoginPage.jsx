import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { loginUser } from "../../services/authService";
// Import the new MFA service
import { sendMfaCode, verifyMfaCode } from "../../services/mfaService";

// Importa la imagen desde la carpeta assets
import LogoTernurin from "../../images/LogoTernurin.png";

const { Title } = Typography;

const LoginPage = () => {
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const [loginStep, setLoginStep] = useState(1); // 1: Credenciales, 2: Código MFA
  const [mfaCode, setMfaCode] = useState("");
  const [tempUserData, setTempUserData] = useState(null);
  const [form] = Form.useForm(); // Add form instance to control the form
  const navigate = useNavigate();
  const location = useLocation();

  // Clear session data when component mounts
  useEffect(() => {
    // Check if we're coming from an authenticated page
    const referrer = document.referrer;
    const isComingFromAuthPage = referrer.includes('/catalogo') || 
                                referrer.includes('/perfil') || 
                                referrer.includes('/carrito') || 
                                referrer.includes('/favoritos');
    
    if (location.pathname === "/login" || location.pathname === "/") {
      // Clear form fields
      form.resetFields();
      
      // Reset login state
      setLoginStep(1);
      setMfaCode("");
      setTempUserData(null);
      
      // If coming from an authenticated page, clear session
      if (isComingFromAuthPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");
        message.info("Sesión cerrada. Por favor inicia sesión nuevamente.");
      }
    }
  }, [location.pathname, form]);

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const token = localStorage.getItem("token");

    // Si ya tiene un token y está en la página de login, redirigir al catálogo
    if (token && (location.pathname === "/" || location.pathname === "/login")) {
      navigate("/catalogo");
    } 
    // Si no está autenticado y intenta acceder al catálogo, redirigirlo a login
    else if (!token && location.pathname === "/catalogo") {
      navigate("/login"); // Redirige al login si intenta acceder sin autenticación
    }
  }, [navigate, location]);

  // Agregar un efecto para verificar la autenticación en cada cambio de ruta
  useEffect(() => {
    // Función para verificar autenticación
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const protectedRoutes = ["/catalogo", "/carrito", "/favoritos", "/perfil"];
      
      if (!token && protectedRoutes.some(route => window.location.pathname.includes(route))) {
        navigate("/login");
        message.warning("Debes iniciar sesión para acceder a esta página");
      }
    };

    // Verificar al montar el componente
    checkAuth();

    // Agregar listener para cambios en la URL
    window.addEventListener('popstate', checkAuth);

    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener('popstate', checkAuth);
    };
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (isBlocked && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsBlocked(false);
      setAttempts(0);
      setError("");
      setCountdown(7);
    }
    return () => clearInterval(timer);
  }, [isBlocked, countdown]);

  const handleLogin = async (values) => {
    if (isBlocked) {
      return;
    }

    try {
      // Primer paso: autenticación con usuario y contraseña
      const response = await loginUser(values.username, values.password);
      
      // Guardar temporalmente los datos del usuario
      setTempUserData(response);
      
      // Enviar código MFA al correo del usuario usando el nuevo servicio
      await sendMfaCode(response.userId, response.user.email);
      
      message.success("Se ha enviado un código de verificación a tu correo electrónico");
      setLoginStep(2); // Avanzar al paso de verificación MFA
      
    } catch (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setIsBlocked(true);
        setError(`Demasiados intentos. Espere ${countdown} segundos antes de intentarlo nuevamente.`);
      } else {
        setError("Credenciales incorrectas, intenta nuevamente");
      }
    }
  };

  const handleVerifyMFA = async () => {
    if (!mfaCode.trim()) {
      setError("Por favor ingresa el código de verificación");
      return;
    }

    try {
      // Verificar el código MFA usando el nuevo servicio
      const response = await verifyMfaCode(tempUserData.userId, mfaCode.trim());

      // Si la verificación es exitosa, completar el login
      if (response.success) {
        // Guardar datos en localStorage
        localStorage.setItem("token", tempUserData.token);
        localStorage.setItem("userId", tempUserData.userId);
        localStorage.setItem("userRole", tempUserData.user.rol);
        localStorage.setItem("username", tempUserData.user.username);

        message.success("Autenticación completada con éxito");
        navigate("/catalogo");
      } else {
        setError("Código de verificación incorrecto");
      }
    } catch (error) {
      setError("Error al verificar el código. Inténtalo nuevamente.");
    }
  };

  const handleResendCode = async () => {
    try {
      // Reenviar el código MFA usando el nuevo servicio
      await sendMfaCode(tempUserData.userId, tempUserData.user.email);
      message.success("Se ha enviado un nuevo código de verificación");
    } catch (error) {
      message.error("Error al reenviar el código");
    }
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
          width: 380,
          padding: 25,
          textAlign: "center",
          borderRadius: 20,
          backgroundColor: "#fff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Title level={3} style={{ color: "#9C2780", fontWeight: "bold" }}>
          Bienvenido a CuchiTernuras!
        </Title>

        {/* Imagen debajo del título */}
        <div style={{ marginBottom: 20 }}>
          <img
            src={LogoTernurin}
            alt="logo"
            width={150}
            height={150}
            style={{
              borderRadius: "50%",
              backgroundColor: "#FCE4EC",
              padding: 7,
              marginTop: 10,
            }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {loginStep === 1 ? (
          // Paso 1: Formulario de credenciales
          <Form form={form} onFinish={handleLogin} layout="vertical">
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Ingrese usuario" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#9C2780" }} />}
                placeholder="Usuario"
                style={{
                  height: 40,
                  fontSize: "16px",
                  borderRadius: 20,
                  backgroundColor: "#FCE4EC",
                  border: "2px solid #9C2780",
                  color: "black",
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Ingrese contraseña" }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#9C2780" }} />}
                placeholder="Contraseña"
                style={{
                  height: 40,
                  fontSize: "16px",
                  borderRadius: 20,
                  backgroundColor: "#FCE4EC",
                  border: "2px solid #9C2780",
                  color: "black",
                }}
              />
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Checkbox style={{ color: "#9C2780" }} />
                <span style={{ color: "#9C2780", fontSize: "14px" }}>Recuérdame</span>
              </div>
              <button
                onClick={() => navigate("/reset-password")}
                style={{
                  textDecoration: "underline",
                  border: "none",
                  background: "none",
                  color: "#9C2780",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Form.Item style={{ marginTop: "20px" }}>
              <Button
                htmlType="submit"
                block
                style={{
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
                Entrar
              </Button>
            </Form.Item>

            <p style={{ fontSize: "14px" }}>
              ¿No tienes cuenta?{" "}
              <span
                onClick={() => navigate("/registro")}
                style={{
                  color: "#9C2780",
                  cursor: "pointer",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                Regístrate aquí
              </span>
            </p>
          </Form>
        ) : (
          // Paso 2: Verificación MFA
          <div>
            <p style={{ marginBottom: "20px" }}>
              Hemos enviado un código de verificación a tu correo electrónico.
              Por favor, ingrésalo a continuación:
            </p>
            
            <Input
              prefix={<SafetyOutlined style={{ color: "#9C2780" }} />}
              placeholder="Código de verificación"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              style={{
                height: 40,
                fontSize: "16px",
                borderRadius: 20,
                backgroundColor: "#FCE4EC",
                border: "2px solid #9C2780",
                color: "black",
                marginBottom: "20px",
              }}
            />
                          
              <Button
                onClick={handleVerifyMFA}
                block
                style={{
                  backgroundColor: "#FBE59D",
                  borderColor: "#9C2780",
                  color: "black",
                  height: 40,
                  fontSize: "16px",
                  borderRadius: 20,
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Verificar
              </Button>
              
              <Button
                onClick={handleResendCode}
                type="link"
                style={{
                  color: "#9C2780",
                  fontSize: "14px",
                }}
              >
                Reenviar código
              </Button>
              
              <Button
                onClick={() => setLoginStep(1)}
                type="link"
                style={{
                  color: "#9C2780",
                  fontSize: "14px",
                  marginLeft: "10px",
                }}
              >
                Volver
              </Button>
            </div>
          )}
      </Card>
    </div>
  );
};

export default LoginPage;
