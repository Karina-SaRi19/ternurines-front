import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import "antd/dist/reset.css"; 
import PerfilPage from "./pages/Perfil/PerfilPage";
import CatalogoPage from "./pages/Catalogo/CatalogoPage";
import AyudaPage from "./pages/Ayuda/AyudaPage";
import RegistroPage from "./pages/Registro/RegistroPage.jsx";
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx';
import CarritoPage from './pages/Carrito/CarritoPage.jsx';
import CompraExitosa from './pages/CompraExitosa/CompraExitosa.jsx';
import { CartProvider } from './context/CartContext';
import FavoritosPage from "./pages/Favoritos/FavoritosPage.jsx";
import SSETestPage from "./pages/SSETestPage/SSETestPage.jsx";
import AuthGuard from "./components/AuthGuard/AuthGuard.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Perfil" element={<AuthGuard><PerfilPage /></AuthGuard>} />
          <Route path="/Catalogo" element={<AuthGuard><CatalogoPage /></AuthGuard>} />
          <Route path="/Ayuda" element={<AyudaPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route path="/Reset-Password" element={<ResetPassword />} /> 
          <Route path="/carrito" element={<AuthGuard><CarritoPage /></AuthGuard>} />
          <Route path="/compra-exitosa" element={<AuthGuard><CompraExitosa /></AuthGuard>} />
          <Route path="/favoritos" element={<AuthGuard><FavoritosPage /></AuthGuard>} />
          <Route path="/sse-test" element={<AuthGuard><SSETestPage /></AuthGuard>} />
        </Routes>
      </Router>
    </CartProvider>
  </React.StrictMode>
);
