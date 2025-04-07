import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import LandingPage from './pages/LandingPage/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage/LoginPage';
import PerfilPage from './pages/Perfil/PerfilPage';
import CatalogoPage from './pages/Catalogo/CatalogoPage';
import Components from "./Components/Components"; // Asegúrate de que la ruta sea correcta
import AyudaPage from './pages/Ayuda/AyudaPage'; // Importa la página de ayuda si existe
import RegistroPage from './pages/Registro/RegistroPage.jsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx';
import CarritoPage from './pages/Carrito/CarritoPage.jsx';
import CompraExitosa from './pages/CompraExitosa/CompraExitosa.jsx';
import FavoritosPage from './pages/Favoritos/FavoritosPage.jsx';

const App = () => {
  return (
    <Router>
      <Components /> {/* Agrega el menú en todas las páginas */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route path="/ayuda" element={<AyudaPage />} /> {/* Agrega la ruta de ayuda */}
        <Route path="/registro" element={<RegistroPage />} /> {/* Agrega la ruta de ayuda */}
        <Route path="/Reset-Password" element={<ResetPassword />} /> 
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/favoritos" element={<FavoritosPage />} />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
