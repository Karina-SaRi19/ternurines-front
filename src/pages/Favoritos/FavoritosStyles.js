const styles = {
  pageContainer: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#fff5f8",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    paddingTop: "100px", // Add padding to account for fixed header
  },
  contentContainer: {
    padding: "0 20px 20px",
    paddingTop: "0", // Remove top padding completely
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    position: "relative",
    zIndex: 1,
  },
  favoritosHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px", // Reduced from 30px to 20px
    borderBottom: "1px solid #f0d4e0",
    paddingBottom: "10px", // Reduced from 15px to 10px
  },
  pageTitle: {
    fontSize: "28px",
    color: "#5a2d82",
    margin: 0,
    fontWeight: "600",
    position: "relative",
    paddingLeft: "15px",
  },
  volverButton: {
    backgroundColor: "#f0d4e0",
    color: "#5a2d82",
    border: "none",
    borderRadius: "25px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    margin: "0 auto",
    maxWidth: "600px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "70px",
    marginBottom: "20px",
    animation: "pulse 2s infinite",
  },
  emptyTitle: {
    fontSize: "26px",
    color: "#5a2d82",
    marginBottom: "15px",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
    maxWidth: "400px",
    lineHeight: "1.6",
  },
  explorarButton: {
    backgroundColor: "#ff6b9d",
    color: "white",
    border: "none",
    borderRadius: "25px",
    padding: "12px 30px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(255, 107, 157, 0.3)",
  },
  favoritosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "25px",
    padding: "10px 0",
  },
  favoritoCard: {
    backgroundColor: "white",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  favoritoImageContainer: {
    position: "relative",
    height: "200px",
    overflow: "hidden",
  },
  favoritoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },
  favoritoHeartButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "rgba(255, 255, 255, 0.8)",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
  },
  discountBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#ff6b6b",
    color: "white",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  premiumBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#ffd700",
    color: "#333",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  favoritoInfo: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  favoritoNombre: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "10px",
    fontWeight: "500",
    lineHeight: "1.3",
  },
  favoritoPrecioContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  precioOriginal: {
    fontSize: "14px",
    color: "#999",
    textDecoration: "line-through",
  },
  favoritoPrecio: {
    fontSize: "22px",
    color: "#ff6b9d",
    fontWeight: "bold",
  },
  favoritoBotonAgregar: {
    width: "100%",
    padding: "12px 0",
    backgroundColor: "#5a2d82",
    color: "white",
    border: "none",
    borderRadius: "25px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    boxShadow: "0 4px 10px rgba(90, 45, 130, 0.2)",
    marginTop: "auto",
  },
  // Estilos para notificaciones
  notificacionExito: {
    position: "fixed",
    top: "80px",
    right: "20px",
    zIndex: 1000,
    backgroundColor: "white",
    borderLeft: "4px solid #4CAF50",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    padding: "15px 20px",
    minWidth: "300px",
    animation: "slideIn 0.3s ease-out forwards",
  },
  notificacionInfo: {
    position: "fixed",
    top: "80px",
    right: "20px",
    zIndex: 1000,
    backgroundColor: "white",
    borderLeft: "4px solid #2196F3",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    padding: "15px 20px",
    minWidth: "300px",
    animation: "slideIn 0.3s ease-out forwards",
  },
  notificacionContenido: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  notificacionIcono: {
    marginRight: "15px",
    fontSize: "20px",
  },
  notificacionMensaje: {
    fontSize: "14px",
    color: "#333",
    flex: 1,
    fontWeight: "500",
  },
  notificacionCerrar: {
    background: "none",
    border: "none",
    color: "#999",
    fontSize: "16px",
    cursor: "pointer",
    padding: "0 5px",
    marginLeft: "10px",
  },
  "@keyframes pulse": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.1)" },
    "100%": { transform: "scale(1)" }
  },
  "@keyframes slideIn": {
    "from": { transform: "translateX(100%)", opacity: 0 },
    "to": { transform: "translateX(0)", opacity: 1 }
  }
};

export default styles;