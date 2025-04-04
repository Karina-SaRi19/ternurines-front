import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Input, Badge, Drawer, Button } from "antd";
import { 
  SearchOutlined, 
  HeartOutlined, 
  ShoppingCartOutlined,
  MenuOutlined 
} from "@ant-design/icons";
import LogoTernurin from "../../images/LogoTernurin.png";
import { useCart } from "../../context/CartContext";
import "./Components.css"; // Add this import for custom styles

const { Header } = Layout;
const { Search } = Input;

const Components = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  // Enhanced responsive check for different screen sizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallScreen(window.innerWidth <= 992);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle cart icon click
  const handleCartClick = () => {
    navigate("/carrito");
  };

  // Add this function to handle favorites icon click
  const handleFavoritesClick = () => {
    navigate("/favoritos");
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <Layout className="header-layout">
      <Header className="responsive-header">
        <div className="header-container">
          <div className="logo-container">
            <Link to="/catalogo">
              <img src={LogoTernurin} alt="Logo" className="logo-image" />
            </Link>
          </div>

          {/* Mobile menu button */}
          {isMobile ? (
            <Button 
              type="text" 
              icon={<MenuOutlined style={{ color: "white", fontSize: "20px" }} />} 
              onClick={showDrawer}
              className="mobile-menu-button"
            />
          ) : (
            /* Desktop menu */
            <Menu 
              theme="#C599B6" 
              mode="horizontal" 
              className="desktop-menu"
            >
              <Menu.Item key="inicio">
                <Link to="/catalogo" style={{ color: "white" }}>Inicio</Link>
              </Menu.Item>
              <Menu.Item key="perfil">
                <Link to="/perfil" style={{ color: "white" }}>Cuenta</Link>
              </Menu.Item>
              <Menu.Item key="ayuda">
                <Link to="/ayuda" style={{ color: "white" }}>Ayuda</Link>
              </Menu.Item>
            </Menu>
          )}

          {/* Search and icons for desktop */}
          {!isMobile && (
            <div className="header-actions">
              <Search 
                placeholder="Buscar..." 
                enterButton={<SearchOutlined />} 
                className={isSmallScreen ? "small-search" : "normal-search"}
              />
              <HeartOutlined 
                className="header-icon" 
                onClick={handleFavoritesClick}
              />
              <Badge count={cartItemCount} style={{ fontSize: "12px" }}>
                <ShoppingCartOutlined 
                  className="header-icon"
                  onClick={handleCartClick}
                />
              </Badge>
            </div>
          )}

          {/* Icons for mobile */}
          {isMobile && (
            <div className="mobile-actions">
              <HeartOutlined 
                className="header-icon"
                onClick={handleFavoritesClick}
              />
              <Badge count={cartItemCount} style={{ fontSize: "12px" }}>
                <ShoppingCartOutlined 
                  className="header-icon"
                  onClick={handleCartClick}
                />
              </Badge>
            </div>
          )}
        </div>
      </Header>

      {/* Mobile drawer menu */}
      <Drawer
        title="Menú"
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
        className="mobile-drawer"
      >
        <Menu mode="vertical" style={{ border: "none" }}>
          <Menu.Item key="inicio">
            <Link to="/catalogo" onClick={closeDrawer}>Inicio</Link>
          </Menu.Item>
          <Menu.Item key="perfil">
            <Link to="/perfil" onClick={closeDrawer}>Cuenta</Link>
          </Menu.Item>
          <Menu.Item key="ayuda">
            <Link to="/ayuda" onClick={closeDrawer}>Ayuda</Link>
          </Menu.Item>
          <Menu.Item key="search" className="drawer-search-item">
            <Search 
              placeholder="Buscar..." 
              enterButton={<SearchOutlined />} 
              className="drawer-search"
            />
          </Menu.Item>
        </Menu>
      </Drawer>
    </Layout>
  );
};

export default Components;