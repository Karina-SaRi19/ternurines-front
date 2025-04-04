import React, { useState, useEffect, useRef } from "react";
import Components from "../Components/Components";
import imagePaths from "../Catalogo/imagesPaths"; // Importa las rutas de las imágenes
import styles from "./CatalogoStyles";
import { useCart } from "../../context/CartContext";
import api from "../../services/api"; // Importamos el servicio API con interceptor

const CatalogoPage = () => {
  const { addToCart } = useCart();
  
  // Estado para manejar favoritos, recuperando desde localStorage
  const [favoritos, setFavoritos] = useState(() => {
    const favoritosGuardados = localStorage.getItem("favoritos");
    return favoritosGuardados ? JSON.parse(favoritosGuardados) : {};
  });
  
  // Función para obtener imágenes variadas para las ofertas
  const getOfertaImage = (index) => {
    const ofertaImages = [
      imagePaths.ofertas.oferta1,
      imagePaths.ofertas.oferta2,
      imagePaths.ofertas.oferta3,
      imagePaths.ofertas.oferta4,
      imagePaths.ofertas.oferta5,
      imagePaths.ofertas.oferta6,
    ];
    
    return ofertaImages[index % ofertaImages.length];
  };
  
  // Estado para el carrito de compras
  const [carrito, setCarrito] = useState([]);
  
  // Estado para el modal de notificación
  const [notificacion, setNotificacion] = useState({
    visible: false,
    mensaje: "",
    tipo: ""
  });
  
  // Estado para el modal del carrito
  const [modalCarrito, setModalCarrito] = useState({
    visible: false,
    producto: null
  });

  // Referencias para las secciones
  const novedadesRef = useRef(null);
  const ofertasRef = useRef(null);
  const exclusivosRef = useRef(null);
  const coleccionesRef = useRef(null);
  const todosRef = useRef(null);

  // Función para scroll suave
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Efecto para guardar en localStorage cuando cambian los favoritos
  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  // Efecto para ocultar la notificación después de un tiempo
  useEffect(() => {
    if (notificacion.visible) {
      const timer = setTimeout(() => {
        setNotificacion({ ...notificacion, visible: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notificacion]);

  // Cargar carrito al iniciar
  useEffect(() => {
    const cargarCarrito = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const response = await api.get('/api/cart');
          setCarrito(response.data.items);
        } else {
          const carritoLocal = localStorage.getItem('carrito');
          if (carritoLocal) {
            setCarrito(JSON.parse(carritoLocal));
          }
        }
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
        const carritoLocal = localStorage.getItem('carrito');
        if (carritoLocal) {
          setCarrito(JSON.parse(carritoLocal));
        }
      }
    };
    
    cargarCarrito();
  }, []);

  // Función para alternar el estado de favorito
  const [modalFavoritos, setModalFavoritos] = useState({
  visible: false
  });
  
  useEffect(() => {
  const handleToggleFavoritos = () => {
  setModalFavoritos(prev => ({
  visible: !prev.visible
  }));
  };
  
  window.addEventListener('toggleFavoritos', handleToggleFavoritos);
  
  return () => {
  window.removeEventListener('toggleFavoritos', handleToggleFavoritos);
  };
  }, []);
  
  const toggleFavorito = (index, nombre) => {
  setFavoritos((prev) => {
  const nuevoEstado = { ...prev };
  nuevoEstado[index] = !prev[index];
  
  // Mostrar notificación
  if (nuevoEstado[index]) {
  setNotificacion({
  visible: true,
  mensaje: `¡${nombre} agregado a favoritos!`,
  tipo: "exito"
  });
  } else {
  setNotificacion({
  visible: true,
  mensaje: `${nombre} eliminado de favoritos`,
  tipo: "info"
  });
  }
  
  return nuevoEstado;
  });
  };

  // Función para agregar al carrito
  const agregarAlCarrito = async (producto) => {
    try {
      addToCart(producto);
      setModalCarrito({
        visible: true,
        producto: producto
      });
      setTimeout(() => {
        setModalCarrito({
          visible: false,
          producto: null
        });
      }, 3000);
      
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      
      // Show error notification
      setNotificacion({
        visible: true,
        mensaje: "Error al agregar al carrito. Intente nuevamente.",
        tipo: "info"
      });
    }
  };

  // Testimonios de clientes
  const testimonios = [
    {
      id: 1, nombre: "María García", 
      texto: "¡Los Ternurines son adorables! Mi colección crece cada mes y la calidad es excelente.",
      estrellas: 5
    },
    {
      id: 2, nombre: "Carlos Rodríguez",
      texto: "Compré un set para mi hija y está encantada. El empaque es precioso y llegó en perfecto estado.",
      estrellas: 5
    },
    {
      id: 3, nombre: "Laura Martínez", 
      texto: "Me encantan los diseños exclusivos. Son el regalo perfecto para cualquier ocasión.",
      estrellas: 4
    }
  ];

  return (
    <div style={styles.pageContainer}>
      <Components />
      {/* Notificación Modal */}
      {notificacion.visible && (
        <div style={notificacion.tipo === "exito" ? styles.notificacionExito : styles.notificacionInfo}>
          <div style={styles.notificacionContenido}>
            <span style={styles.notificacionIcono}>
              {notificacion.tipo === "exito" ? "❤️" : "ℹ️"}
            </span>
            <span style={styles.notificacionMensaje}>{notificacion.mensaje}</span>
            <button 
              style={styles.notificacionCerrar} 
              onClick={() => setNotificacion({...notificacion, visible: false})}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modal de Carrito */}
      {modalCarrito.visible && modalCarrito.producto && (
        <div style={styles.modalCarrito}>
          <div style={styles.modalCarritoContenido}>
            <div style={styles.modalCarritoIcono}>✅</div>
            <div style={styles.modalCarritoInfo}>
              <h3 style={styles.modalCarritoTitulo}>¡Producto agregado al carrito!</h3>
              <p style={styles.modalCarritoProducto}>{modalCarrito.producto.nombre}</p>
              <p style={styles.modalCarritoPrecio}>${modalCarrito.producto.precio.toFixed(2)}</p>
            </div>
            <div style={styles.modalCarritoBotones}>
              <button 
                style={styles.modalCarritoBotonSeguir} 
                onClick={() => setModalCarrito({visible: false, producto: null})}
              >
                Seguir comprando
              </button>
              <button 
                style={styles.modalCarritoBotonVerCarrito} 
                onClick={() => window.location.href = '/carrito'}
              >
                Ver carrito
              </button>
            </div>
            <button 
              style={styles.modalCarritoCerrar} 
              onClick={() => setModalCarrito({visible: false, producto: null})}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modal de Favoritos */}
      {modalFavoritos.visible && (
        <div style={styles.modalFavoritos}>
          <div style={styles.modalFavoritosContenido}>
            <h3 style={styles.modalFavoritosTitulo}>Mis Favoritos</h3>
            <button 
              style={styles.modalFavoritosCerrar} 
              onClick={() => setModalFavoritos({visible: false})}
            >
              ✕
            </button>
            <div style={styles.favoritosContainer}>
              {Object.keys(favoritos).filter(key => favoritos[key]).length === 0 ? (
                <p style={styles.emptyFavoritos}>No tienes productos favoritos</p>
              ) : (
                Object.keys(favoritos).filter(key => favoritos[key]).map((key) => {
                  // Extract product type and id from the key
                  const [tipo, id] = key.split('-');
                  
                  // Determine product details based on type
                  let producto = {};
                  if (tipo === 'lanzamiento') {
                    producto = {
                      nombre: `Ternurine ${id}`,
                      precio: 199.00,
                      imagen: imagePaths.lanzamientos[`lanzamiento${id}`]
                    };
                  } else if (tipo === 'oferta') {
                    producto = {
                      nombre: `Oferta Ternurine ${id}`,
                      precio: 280 + parseInt(id) * 15,
                      imagen: getOfertaImage(parseInt(id))
                    };
                  } else if (tipo === 'set') {
                    producto = {
                      nombre: `Set Ternurine ${parseInt(id) + 1}`,
                      precio: 299 + parseInt(id) * 50,
                      imagen: [imagePaths.sets.set1, imagePaths.sets.set2, imagePaths.sets.set3][parseInt(id)]
                    };
                  }
                  
                  return (
                    <div key={key} style={styles.favoritoItem}>
                      <img 
                        src={producto.imagen || "https://via.placeholder.com/80x80"} 
                        alt={producto.nombre} 
                        style={styles.favoritoImagen} 
                      />
                      <div style={styles.favoritoInfo}>
                        <h4 style={styles.favoritoNombre}>{producto.nombre}</h4>
                        <p style={styles.favoritoPrecio}>${producto.precio.toFixed(2)}</p>
                      </div>
                      <div style={styles.favoritoAcciones}>
                        <button 
                          style={styles.favoritoBotonEliminar}
                          onClick={() => toggleFavorito(key, producto.nombre)}
                        >
                          ❌
                        </button>
                        <button 
                          style={styles.favoritoBotonAgregar}
                          onClick={() => {
                            agregarAlCarrito({
                              id: parseInt(id),
                              tipo: tipo,
                              nombre: producto.nombre,
                              precio: producto.precio,
                              imagen: producto.imagen
                            });
                            setModalFavoritos({visible: false});
                          }}
                        >
                          🛒
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Banner principal */}
      <div style={styles.bannerContainer}>
        <img src={imagePaths.banners.banner1} alt="Banner 1" style={styles.bannerImage} />
        <div style={styles.bannerText}>La dulzura nunca pasa de moda. ¡Encuentra tu favorito aquí!</div>
        <img src={imagePaths.banners.banner2} alt="Banner 2" style={styles.bannerImage} />
      </div>

      {/* Contenedor de categorías */}
      <div style={styles.categoriesContainer}>
        <a href="#novedades" onClick={(e) => { e.preventDefault(); scrollToSection(novedadesRef); }} style={styles.categoryItem}>
          <div style={styles.categoryImageContainer}>
            <img src={imagePaths.categorias.categoria1} alt="Novedades" style={styles.categoryImage} />
          </div>
          <span style={styles.categoryText}>Novedades</span>
        </a>
        <a href="#ofertas" onClick={(e) => { e.preventDefault(); scrollToSection(ofertasRef); }} style={styles.categoryItem}>
          <div style={styles.categoryImageContainer}>
            <img src={imagePaths.categorias.categoria2} alt="Ofertas" style={styles.categoryImage} />
          </div>
          <span style={styles.categoryText}>Ofertas</span>
        </a>
        <a href="#exclusivos" onClick={(e) => { e.preventDefault(); scrollToSection(exclusivosRef); }} style={styles.categoryItem}>
          <div style={styles.categoryImageContainer}>
            <img src={imagePaths.categorias.categoria3} alt="Exclusivos" style={styles.categoryImage} />
          </div>
          <span style={styles.categoryText}>Exclusivos</span>
        </a>
        <a href="#colecciones" onClick={(e) => { e.preventDefault(); scrollToSection(coleccionesRef); }} style={styles.categoryItem}>
          <div style={styles.categoryImageContainer}>
            <img src={imagePaths.categorias.categoria4} alt="Colecciones" style={styles.categoryImage} />
          </div>
          <span style={styles.categoryText}>Colecciones</span>
        </a>
        <a href="#todos" onClick={(e) => { e.preventDefault(); scrollToSection(todosRef); }} style={styles.categoryItem}>
          <div style={styles.categoryImageContainer}>
            <img src={imagePaths.categorias.categoria5} alt="Todos los sets" style={styles.categoryImage} />
          </div>
          <span style={styles.categoryText}>Todos los sets</span>
        </a>
      </div>

      {/* Sección de últimos lanzamientos */}
      <div ref={novedadesRef} id="novedades" style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Últimos Lanzamientos</h2>
        <div style={styles.lanzamientosContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} style={styles.lanzamientoItem}>
              <div style={styles.lanzamientoImageContainer}>
                <img 
                  src={imagePaths.lanzamientos[`lanzamiento${num}`]} 
                  alt={`Lanzamiento ${num}`} 
                  style={styles.lanzamientoImage} 
                />
                <div style={styles.newBadge}>¡Nuevo!</div>
                {/* Botón de favorito para lanzamientos */}
                <div 
                  style={favoritos[`lanzamiento-${num}`] ? styles.favoriteIconSmall : styles.favoriteIconEmptySmall} 
                  onClick={() => toggleFavorito(`lanzamiento-${num}`, `Ternurine ${num}`)}
                >
                  {favoritos[`lanzamiento-${num}`] ? "❤️" : "🤍"}
                </div>
              </div>
              <div style={styles.lanzamientoInfo}>
                <span style={styles.lanzamientoName}>Ternurine {num}</span>
                <div style={styles.lanzamientoDetails}>
                  <span style={styles.lanzamientoPrice}>$199.00</span>
                  <button 
                    style={styles.smallButton}
                    onClick={() => agregarAlCarrito({
                      id: num,
                      tipo: 'lanzamiento',
                      nombre: `Ternurine ${num}`,
                      precio: 199.00,
                      imagen: imagePaths.lanzamientos[`lanzamiento${num}`]
                    })}
                  >
                    🛒
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de ofertas */}
      <div ref={ofertasRef} id="ofertas" style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Ofertas Especiales</h2>
        <div style={styles.ofertasScrollContainer}>
          <div style={styles.ofertasCarousel}>
            {[1, 2, 3, 4, 5, 6].map((index) => (              
                            <div key={index} style={styles.ofertaCard}>
                                <div style={styles.ofertaImageContainer}>
                                    <img 
                                    src={getOfertaImage(index)} 
                                    alt={`Oferta ${index}`} 
                                    style={styles.ofertaImage} 
                                  />
                                  <div style={styles.discountBadge}>-{15 + (index % 3) * 5}%</div>
                                  {index % 4 === 0 && <div style={styles.limitedBadge}>¡Limitado!</div>}
                                  {/* Botón de favorito para ofertas */}
                                  <span 
                                    style={favoritos[`oferta-${index}`] ? styles.favoriteIconSmall : styles.favoriteIconEmptySmall} 
                                    onClick={() => toggleFavorito(`oferta-${index}`, `Oferta Ternurine ${index}`)}
                                  >
                                    {favoritos[`oferta-${index}`] ? "❤️" : "🤍"}
                                  </span>
                                </div>
                                <h3 style={styles.ofertaTitle}>Ternurine Oferta {index}</h3>
                                <div style={styles.priceContainer}>
                                  <p style={styles.oldPrice}>${(350 + index * 20).toFixed(2)}</p>
                                  <p style={styles.setPrice}>${(280 + index * 15).toFixed(2)}</p>
                                </div>
                                <p style={styles.ofertaDescription}>
                                  {index % 3 === 0 
                                    ? "¡Últimas unidades disponibles! No te pierdas esta oferta especial." 
                                    : "Aprovecha esta oferta por tiempo limitado en nuestros sets más populares."}
                                </p>
                                <div style={styles.actionContainer}>
                                  <a href="javascript:void(0)" style={styles.viewMoreLink} onClick={(e) => e.preventDefault()}>Ver más</a>
                                  <button 
                                    style={styles.addToCartButton}
                                    onClick={() => agregarAlCarrito({
                                      id: index,
                                      tipo: 'oferta',
                                      nombre: `Oferta Ternurine ${index}`,
                                      precio: 280 + index * 15,
                                      precioOriginal: 350 + index * 20,
                                      imagen: getOfertaImage(index)
                                    })}
                                  >
                                    <span style={styles.cartIcon}>🛒</span>
                                    Agregar
                                  </button>
                                </div>
                              </div>
            ))}
          </div>
          <div style={styles.scrollIndicator}>
            <span>← Desliza para ver más ofertas →</span>
          </div>
        </div>
      </div>

    {/* Sección de sets destacados */}
      <div ref={exclusivosRef} id="exclusivos" style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Sets Exclusivos</h2>
        <div style={styles.setsContainer}>
          {[imagePaths.sets.set1, imagePaths.sets.set2, imagePaths.sets.set3].map((set, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.imageContainer}>
                <img src={set} alt={`Set ${index + 1}`} style={styles.setImage} />
                <div 
                  style={favoritos[`set-${index}`] ? styles.favoriteIcon : styles.favoriteIconEmpty} 
                  onClick={() => toggleFavorito(`set-${index}`, `Set Ternurine ${index + 1}`)}
                >
                  {favoritos[`set-${index}`] ? "❤️" : "🤍"}
                </div>
                {index === 2 && <div style={styles.premiumCardBadge}>Premium</div>}
              </div>
              <h3 style={styles.setTitle}>Set Ternurine {index + 1}</h3>
              <p style={styles.setPrice}>${(299 + index * 50).toFixed(2)}</p>
              <p style={styles.setDescription}>Este es un hermoso set de productos exclusivos con diseños únicos y detalles encantadores.</p>
              <div style={styles.actionContainer}>
                <a href="javascript:void(0)" style={styles.viewMoreLink} onClick={(e) => e.preventDefault()}>Ver más</a>
                <button 
                  style={styles.addToCartButton}
                  onClick={() => agregarAlCarrito({
                    id: index,
                    tipo: 'set',
                    nombre: `Set Ternurine ${index + 1}`,
                    precio: 299 + index * 50,
                    imagen: set,
                    premium: index === 2
                  })}
                >
                  <span style={styles.cartIcon}>🛒</span>
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nueva sección: Colección del mes */}
      <div ref={coleccionesRef} id="colecciones" style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Colección del Mes</h2>
        <div style={styles.collectionBanner}>
          <div style={styles.collectionInfo}>
            <h3 style={styles.collectionTitle}>Ternurines Primavera</h3>
            <p style={styles.collectionDescription}>
              Descubre nuestra nueva colección inspirada en la primavera. Colores vibrantes y diseños florales que llenarán tu espacio de alegría.
            </p>
            <a href="javascript:void(0)" style={styles.collectionButton} onClick={(e) => e.preventDefault()}>Explorar colección</a>
          </div>
          <div style={styles.collectionImageContainer}>
            <img 
              src={imagePaths.coleccion.coleccion1} 
              alt="Colección Primavera" 
              style={styles.collectionImage} 
            />
          </div>
        </div>
      </div>

      {/* Sección de todos los sets */}
      <div ref={todosRef} id="todos" style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Todos Nuestros Sets</h2>
        <div style={styles.allSetsContainer}>
          <p style={styles.comingSoonText}>¡Próximamente más sets disponibles!</p>
        </div>
      </div>

      {/* Nueva sección: Testimonios de clientes */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Lo que dicen nuestros clientes</h2>
        <div style={styles.testimoniosContainer}>
          {testimonios.map((testimonio) => (
            <div key={testimonio.id} style={styles.testimonioCard}>
              <p style={styles.testimonioText}>{testimonio.texto}</p>
              <div style={styles.testimonioAuthor}>{testimonio.nombre}</div>
              <div style={styles.testimonioStars}>
                {[...Array(testimonio.estrellas)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mensaje de agradecimiento */}
      <div style={styles.ctaContainer}>
        <h2 style={styles.ctaTitle}>¡Gracias por visitarnos!</h2>
        <p style={styles.ctaText}>
        Que la ternura te acompañe siempre. 💕 ¡Vuelve pronto!</p>
      </div>
    </div>
  );
};

export default CatalogoPage;


