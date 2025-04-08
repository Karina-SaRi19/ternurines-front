import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Input, Spin, message, Modal } from "antd";
import { UserOutlined, OrderedListOutlined, GiftOutlined, QuestionCircleOutlined, LogoutOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Components from "../Components/Components";
import LogoTernurin from "../../images/LogoTernurin.png";
import { getUserData, updateUserProfile, logoutUser } from "../../services/authService";

const { Footer } = Layout;

const PerfilPage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const data = await getUserData();

      setUserData({
        username: data.username || "Usuario",
        email: data.email || "Correo no disponible",
        password: data.password || "",
      });

      setProfileImage(data.profileImage || null);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      if (error.response?.status === 401) {
        message.error("Sesión expirada. Inicia sesión nuevamente.");
        handleLogout();
      } else {
        message.error("Error al obtener la información del usuario");
      }
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setIsModalVisible(true);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Sesión expirada. Inicia sesión nuevamente.");
        navigate("/login");
        return;
      }

      await updateUserProfile({
        username: userData.username,
        email: userData.email,
        profileImage: profileImage,
      });

      message.success("Perfil actualizado con éxito.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      message.error("No se pudo actualizar el perfil. Inténtalo de nuevo.");
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirmModal = () => {
    setIsModalVisible(false);
    handleSaveChanges();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Components />
      <Layout style={{ minHeight: "100vh", padding: "20px" }}>
        <Footer style={{ background: "#F5F5F5", display: "flex" }}>
          <div style={{ width: "30%", maxWidth: "400px", marginRight: "40px" }}>
            <Table
              columns={[
                { title: "", dataIndex: "icon", key: "icon", width: 50 },
                {
                  title: "Contenido",
                  dataIndex: "title",
                  key: "title",
                  render: (text, record) => (
                    <div
                      onClick={record.onClick}
                      style={{
                        cursor: record.onClick ? "pointer" : "default", // Mantener el cursor como puntero cuando haya acción
                        display: "flex",
                        alignItems: "center", // Asegura que el ícono y el texto estén alineados
                        padding: "5px", // Espaciado alrededor de la opción
                        backgroundColor: "inherit", // Mantener el fondo transparente o el color original
                        borderRadius: "4px", // Bordes redondeados para mayor estilo
                      }}
                    >
                      <span style={{ marginLeft: "-20px" }}>{text}</span> {/* El texto al lado del ícono */}
                    </div>
                  ),
                },
              ]}
              dataSource={[
                { key: "1", icon: <UserOutlined />, title: "Descripción general de la cuenta", onClick: () => navigate("/perfil") },
                { key: "2", icon: <OrderedListOutlined />, title: "Mis pedidos", onClick: () => navigate("/carrito") },
                { key: "3", icon: <GiftOutlined />, title: "Lista de deseos", onClick: () => navigate("/favoritos") },
                { key: "4", icon: <QuestionCircleOutlined />, title: "Soporte y ayuda", onClick: () => navigate("/ayuda") }, // Navegar a "ayuda"
                { key: "5", icon: <BellOutlined />, title: "Notificaciones (SSE Test)", onClick: () => navigate("/sse-test") },
                { key: "5", icon: <LogoutOutlined />, title: "Cerrar sesión", onClick: handleLogout },
              ]}
              pagination={false}
              showHeader={false}
            />
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>Mi Cuenta</h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "#fff",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                maxWidth: "400px",
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <img
                  src={profileImage || LogoTernurin}
                  alt="foto de perfil"
                  width={120}
                  height={120}
                  style={{
                    borderRadius: "50%",
                    backgroundColor: "#FCE4EC",
                    padding: 7,
                    marginTop: 10,
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <span
                  style={{ cursor: "pointer", color: "#1890ff" }}
                  onClick={() => document.getElementById("profileImageInput").click()} // Abrir el input de archivo
                >
                  Cambiar foto de perfil
                </span>
              </div>

              <input
                id="profileImageInput"
                type="file"
                style={{ display: "none" }} // Hacer el input invisible
                onChange={handleProfileImageChange}
              />

              {loading ? (
                <Spin size="large" />
              ) : (
                <>
                  <div style={{ width: "100%", marginTop: "20px", textAlign: "left" }}>
                    <p>
                      <b>Nombre de usuario:</b>
                    </p>
                    <Input
                      name="username"
                      value={userData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={{ marginBottom: "15px" }}
                    />
                    <p>
                      <b>Correo:</b>
                    </p>
                    <Input
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={{ marginBottom: "15px" }}
                    />
                  </div>
                  <Button
                    onClick={handleEditToggle}
                    icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                    type={isEditing ? "primary" : "default"}
                    style={{ width: "100%", marginTop: "20px" }}
                  >
                    {isEditing ? "Guardar cambios" : "Editar"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Footer>
      </Layout>

      <Modal
        title="Confirmar cambios"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        onOk={handleConfirmModal}
      >
        <p>¿Estás seguro de que quieres guardar los cambios realizados?</p>
      </Modal>
    </div>
  );
};

export default PerfilPage;
