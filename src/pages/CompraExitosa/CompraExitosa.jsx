import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Components from "../Components/Components";

const CompraExitosa = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails || null;

  return (
    <div>
      <Components />
      
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconContainer}>
            <div style={styles.checkIcon}>✓</div>
          </div>
          
          <h1 style={styles.title}>¡Compra Exitosa!</h1>
          
          <p style={styles.message}>
            Tu pedido ha sido procesado correctamente. Gracias por tu compra.
          </p>
          
          {orderDetails && (
            <div style={styles.orderSummary}>
              <h3 style={styles.summaryTitle}>Resumen de tu pedido</h3>
              
              <div style={styles.orderItems}>
                {orderDetails.items.map((item, index) => (
                  <div key={index} style={styles.item}>
                    <span>{item.nombre} ({item.tipo}) x{item.cantidad}</span>
                    <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div style={styles.totals}>
                <div style={styles.totalRow}>
                  <span>Subtotal:</span>
                  <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>
                
                <div style={styles.totalRow}>
                  <span>Impuestos:</span>
                  <span>${orderDetails.impuestos.toFixed(2)}</span>
                </div>
                
                <div style={styles.totalRow}>
                  <span>Envío:</span>
                  <span>${orderDetails.envio.toFixed(2)}</span>
                </div>
                
                {orderDetails.descuento > 0 && (
                  <div style={styles.totalRow}>
                    <span>Descuento:</span>
                    <span>-${orderDetails.descuento.toFixed(2)}</span>
                  </div>
                )}
                
                <div style={styles.grandTotal}>
                  <span>Total:</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div style={styles.orderNumber}>
            <p>Número de pedido: <strong>#{Math.floor(Math.random() * 1000000)}</strong></p>
            <p>Recibirás un correo electrónico con los detalles de tu compra.</p>
          </div>
          
          <button 
            style={styles.button}
            onClick={() => navigate("/catalogo")}
          >
            Continuar comprando
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    textAlign: "center"
  },
  iconContainer: {
    margin: "0 auto 20px",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#7D1C4A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  checkIcon: {
    color: "white",
    fontSize: "40px",
    fontWeight: "bold"
  },
  title: {
    color: "#7D1C4A",
    fontSize: "28px",
    marginBottom: "15px"
  },
  message: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "25px"
  },
  orderSummary: {
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
    padding: "20px 0",
    margin: "20px 0",
    textAlign: "left"
  },
  summaryTitle: {
    fontSize: "18px",
    marginBottom: "15px",
    color: "#333"
  },
  orderItems: {
    marginBottom: "20px"
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px dashed #eee"
  },
  totals: {
    marginTop: "15px"
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0"
  },
  grandTotal: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    fontWeight: "bold",
    fontSize: "18px",
    borderTop: "2px solid #eee",
    marginTop: "10px"
  },
  orderNumber: {
    margin: "20px 0",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "5px"
  },
  button: {
    backgroundColor: "#7D1C4A",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background-color 0.3s"
  }
};

export default CompraExitosa;