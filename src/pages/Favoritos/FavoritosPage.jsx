import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Components from "../Components/Components";
import imagePaths from "../Catalogo/imagesPaths";
import styles from "./FavoritosStyles";
import { useCart } from "../../context/CartContext";

const FavoritosPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [favoritos, setFavoritos] = useState({});
  const [notificacion, setNotificacion] = useState({
    visible: false,
    mensaje: "",
    tipo: ""
  });

  // Cargar favoritos desde localStorage
  useEffect(() => {
    const favoritosGuardados = localStorage.getItem("favoritos");
    if (favoritosGuardados) {
      setFavoritos(JSON.parse(favoritosGuardados));
    }
  }, []);

  // Efecto para ocultar la notificación después de un tiempo
  useEffect(() => {
    if (notificacion.visible) {
      const timer = setTimeout(() => {
        setNotificacion({ ...notificacion, visible: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notificacion]);

  // Función para eliminar un producto de favoritos
  const eliminarDeFavoritos = (key, nombre) => {
    setFavoritos((prev) => {
      const nuevoEstado = { ...prev };
      delete nuevoEstado[key];
      
      // Guardar en localStorage
      localStorage.setItem("favoritos", JSON.stringify(nuevoEstado));
      
      // Mostrar notificación
      setNotificacion({
        visible: true,
        mensaje: `${nombre} eliminado de favoritos`,
        tipo: "info"
      });
      
      return nuevoEstado;
    });
  };

  // Función para agregar al carrito
  const agregarAlCarrito = (producto) => {
    addToCart(producto);
    
    // Mostrar notificación
    setNotificacion({
      visible: true,
      mensaje: `${producto.nombre} agregado al carrito`,
      tipo: "exito"
    });
  };

  // Función para volver al catálogo
  const volverAlCatalogo = () => {
    navigate("/catalogo");
  };

  // Obtener la lista de productos favoritos
  const productosFavoritos = Object.keys(favoritos)
    .filter(key => favoritos[key])
    .map((key) => {
      const [tipo, id] = key.split('-');
      
      let producto = {
        key: key
      };
      
      if (tipo === 'lanzamiento') {
        producto = {
          ...producto,
          nombre: `Ternurine ${id}`,
          precio: 199.00,
          imagen: imagePaths.lanzamientos[`lanzamiento${id}`] || "https://via.placeholder.com/150",
          tipo: 'lanzamiento',
          id: parseInt(id)
        };
      } else if (tipo === 'oferta') {
        producto = {
          ...producto,
          nombre: `Oferta Ternurine ${id}`,
          precio: 280 + parseInt(id) * 15,
          precioOriginal: 350 + parseInt(id) * 20,
          imagen: parseInt(id) % 2 === 0 ? 
            (imagePaths.sets.set2 || "https://via.placeholder.com/150") : 
            (imagePaths.sets.set3 || "https://via.placeholder.com/150"),
          tipo: 'oferta',
          id: parseInt(id),
          descuento: true
        };
      } else if (tipo === 'set') {
        const setImages = [
          imagePaths.sets.set1 || "https://via.placeholder.com/150", 
          imagePaths.sets.set2 || "https://via.placeholder.com/150", 
          imagePaths.sets.set3 || "https://via.placeholder.com/150"
        ];
        const imageIndex = Math.min(parseInt(id), 2);
        
        producto = {
          ...producto,
          nombre: `Set Ternurine ${parseInt(id) + 1}`,
          precio: 299 + parseInt(id) * 50,
          imagen: setImages[imageIndex],
          tipo: 'set',
          id: parseInt(id),
          premium: parseInt(id) === 2
        };
      } else {
        // Default case for unknown types
        producto = {
          ...producto,
          nombre: `Producto ${id}`,
          precio: 99.00,
          imagen: "https://via.placeholder.com/150",
          tipo: tipo || 'unknown',
          id: parseInt(id)
        };
      }
      
      return producto;
    });

  return (
    <div style={styles.pageContainer}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Components />
      </div>
      
      <div style={styles.contentContainer}>
        <div style={styles.favoritosHeader}>
          <h1 style={styles.pageTitle}>Mis Favoritos</h1>
          <button 
            style={styles.volverButton}
            onClick={volverAlCatalogo}
          >
            Volver al Catálogo
          </button>
        </div>
        
        {productosFavoritos.length === 0 ? (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIcon}>💔</div>
            <h2 style={styles.emptyTitle}>No tienes productos favoritos</h2>
            <p style={styles.emptyText}>
              Explora nuestro catálogo y agrega productos a tus favoritos para verlos aquí
            </p>
            <button 
              style={styles.explorarButton}
              onClick={volverAlCatalogo}
            >
              Explorar Catálogo
            </button>
          </div>
        ) : (
          <div style={styles.favoritosGrid}>
            {productosFavoritos.map((producto) => (
              <div key={producto.key} style={styles.favoritoCard}>
                <div style={styles.favoritoImageContainer}>
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre} 
                    style={styles.favoritoImage} 
                  />
                  {producto.descuento && (
                    <div style={styles.discountBadge}>
                      -{Math.round((1 - producto.precio / producto.precioOriginal) * 100)}%
                    </div>
                  )}
                  {producto.premium && (
                    <div style={styles.premiumBadge}>Premium</div>
                  )}
                  <button 
                    style={styles.favoritoHeartButton}
                    onClick={() => eliminarDeFavoritos(producto.key, producto.nombre)}
                  >
                    ❤️
                  </button>
                </div>
                
                <div style={styles.favoritoInfo}>
                  <h3 style={styles.favoritoNombre}>{producto.nombre}</h3>
                  
                  <div style={styles.favoritoPrecioContainer}>
                    {producto.precioOriginal && (
                      <span style={styles.precioOriginal}>
                        ${producto.precioOriginal ? producto.precioOriginal.toFixed(2) : '0.00'}
                      </span>
                    )}
                    <span style={styles.favoritoPrecio}>
                      ${producto.precio ? producto.precio.toFixed(2) : '0.00'}
                    </span>
                  </div>
                  
                  <button 
                    style={styles.favoritoBotonAgregar}
                    onClick={() => agregarAlCarrito({
                      id: producto.id,
                      tipo: producto.tipo,
                      nombre: producto.nombre,
                      precio: producto.precio,
                      imagen: producto.imagen,
                      ...(producto.premium && { premium: true }),
                      ...(producto.precioOriginal && { precioOriginal: producto.precioOriginal })
                    })}
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Notificación */}
      {notificacion.visible && (
        <div style={notificacion.tipo === "exito" ? styles.notificacionExito : styles.notificacionInfo}>
          <div style={styles.notificacionContenido}>
            <span style={styles.notificacionIcono}>
              {notificacion.tipo === "exito" ? "✅" : "ℹ️"}
            </span>
            <span style={styles.notificacionMensaje}>{notificacion.mensaje}</span>
            <button 
              style={styles.notificacionCerrar}
              onClick={() => setNotificacion({ ...notificacion, visible: false })}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritosPage;