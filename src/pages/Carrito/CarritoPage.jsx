import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Components from "../Components/Components";
import styles from "./CarritoStyles";
import { useCart } from "../../context/CartContext";

const CarritoPage = () => {
  const { 
    cartItems: carrito, 
    loading: cartLoading, // Rename to avoid conflict with local state
    updateCartItemQuantity: actualizarCantidad,
    removeFromCart: eliminarProducto,
    clearCart: vaciarCarrito,
    loadCart
  } = useCart();
  
  const [error, setError] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [impuestos, setImpuestos] = useState(0);
  const envio = 150; // Costo fijo de envío
  const [total, setTotal] = useState(0);
  const [codigoPromo, setCodigoPromo] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [mensajePromo, setMensajePromo] = useState("");
  const [loading, setLoading] = useState(false); // Add local loading state
  
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcular totales cuando cambia el carrito
  useEffect(() => {
    const nuevoSubtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const nuevoImpuestos = nuevoSubtotal * 0.16; // 16% de impuestos
    
    setSubtotal(nuevoSubtotal);
    setImpuestos(nuevoImpuestos);
    setTotal(nuevoSubtotal + nuevoImpuestos + envio - descuento);
  }, [carrito, envio, descuento]);

  // Aplicar código promocional
  const aplicarPromo = () => {
    const promos = {
      "BIENVENIDO10": 10,
      "DESCUENTO20": 20,
      "PROMO30": 30
    };
    
    if (codigoPromo.trim() === "") {
      setMensajePromo("Por favor ingresa un código promocional");
      return;
    }
    
    const porcentajeDescuento = promos[codigoPromo.toUpperCase()];
    
    if (porcentajeDescuento) {
      const nuevoDescuento = (subtotal * porcentajeDescuento) / 100;
      setDescuento(nuevoDescuento);
      setMensajePromo(`¡Código aplicado! ${porcentajeDescuento}% de descuento`);
    } else {
      setMensajePromo("Código promocional inválido");
      setDescuento(0);
    }
  };

  // Proceder al checkout
  const irAlCheckout = () => {
    if (carrito.length === 0) {
      setError("Tu carrito está vacío. Agrega productos antes de continuar.");
      return;
    }
    
    // Simulate processing time
    setLoading(true);
    
    setTimeout(() => {
      // Clear the cart after "processing"
      vaciarCarrito();
      setLoading(false);
      
      // Navigate to success page with order details
      navigate("/compra-exitosa", { 
        state: { 
          orderDetails: {
            items: carrito,
            subtotal,
            impuestos,
            envio,
            descuento,
            total,
            orderNumber: Math.floor(Math.random() * 1000000) // Generate random order number
          } 
        } 
      });
    }, 1500); // Simulate 1.5 seconds of processing
  };

  // Update the loading check in the return statement
  return (
    <div>
      <Components />
      
      <div style={styles.pageContainer}>
        <h1 style={styles.pageTitle}>Mi Carrito de Compras</h1>
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        {loading || cartLoading ? (
          <div style={styles.loadingContainer}>
            <p>Cargando tu carrito...</p>
          </div>
        ) : carrito.length === 0 ? (
          <div style={styles.emptyCart}>
            <div style={styles.emptyCartIcon}>🛒</div>
            <p style={styles.emptyCartText}>Tu carrito está vacío</p>
            <button 
              style={styles.emptyCartButton}
              onClick={() => navigate("/catalogo")}
            >
              Ir a comprar
            </button>
          </div>
        ) : (
          <>
            <div style={styles.cartContainer}>
              <div style={styles.cartHeader}>
                <div>Producto</div>
                <div>Precio</div>
                <div>Cantidad</div>
                <div>Subtotal</div>
                <div></div>
              </div>
              
              {carrito.map((item) => (
                <div key={`${item.id}-${item.tipo}`} style={styles.cartItem}>
                  <div style={styles.productInfo}>
                    <img 
                      src={item.imagen || "https://via.placeholder.com/80x80"} 
                      alt={item.nombre} 
                      style={styles.productImage} 
                    />
                    <div>
                      <div style={styles.productName}>{item.nombre}</div>
                      <div style={styles.productType}>Tipo: {item.tipo}</div>
                    </div>
                  </div>
                  
                  <div style={styles.price}>${item.precio.toFixed(2)}</div>
                  
                  <div style={styles.quantityControl}>
                    <button 
                      style={styles.quantityButton}
                      onClick={() => actualizarCantidad(item.id, item.tipo, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.cantidad} 
                      onChange={(e) => actualizarCantidad(item.id, item.tipo, parseInt(e.target.value) || 1)}
                      style={styles.quantityInput}
                    />
                    <button 
                      style={styles.quantityButton}
                      onClick={() => actualizarCantidad(item.id, item.tipo, item.cantidad + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div style={styles.subtotal}>
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </div>
                  
                  <button 
                    style={styles.removeButton}
                    onClick={() => eliminarProducto(item.id, item.tipo)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <div style={styles.actionsContainer}>
              <button 
                style={styles.continueButton}
                onClick={() => navigate("/catalogo")}
              >
                ← Continuar comprando
              </button>
              
              <button 
                style={styles.clearButton}
                onClick={vaciarCarrito}
              >
                Vaciar carrito
              </button>
            </div>
            
            <div style={styles.summaryContainer}>
              <div style={styles.promoContainer}>
                <h3 style={styles.promoTitle}>Código Promocional</h3>
                <div style={styles.promoForm}>
                  <input 
                    type="text" 
                    placeholder="Ingresa tu código" 
                    value={codigoPromo}
                    onChange={(e) => setCodigoPromo(e.target.value)}
                    style={styles.promoInput}
                  />
                  <button 
                    style={styles.promoButton}
                    onClick={aplicarPromo}
                  >
                    Aplicar
                  </button>
                </div>
                {mensajePromo && <p style={styles.promoMessage}>{mensajePromo}</p>}
              </div>
              
              <div style={styles.totalContainer}>
                <h3 style={styles.totalTitle}>Resumen de Compra</h3>
                
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Subtotal:</span>
                  <span style={styles.totalValue}>${subtotal.toFixed(2)}</span>
                </div>
                
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Impuestos (16%):</span>
                  <span style={styles.totalValue}>${impuestos.toFixed(2)}</span>
                </div>
                
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Envío:</span>
                  <span style={styles.totalValue}>${envio.toFixed(2)}</span>
                </div>
                
                {descuento > 0 && (
                  <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>Descuento:</span>
                    <span style={styles.totalValue}>-${descuento.toFixed(2)}</span>
                  </div>
                )}
                
                <div style={styles.grandTotal}>
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <button 
                  style={styles.checkoutButton}
                  onClick={irAlCheckout}
                >
                  Proceder al pago
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CarritoPage;