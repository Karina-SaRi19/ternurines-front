const styles = {
  pageContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "#333"
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#7D1C4A",
    textAlign: "center"
  },
  emptyCart: {
    textAlign: "center",
    padding: "40px 0",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    marginTop: "20px"
  },
  emptyCartIcon: {
    fontSize: "60px",
    marginBottom: "20px"
  },
  emptyCartText: {
    fontSize: "18px",
    marginBottom: "20px"
  },
  emptyCartButton: {
    backgroundColor: "#7D1C4A",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s"
  },
  cartContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  cartHeader: {
    display: "grid",
    gridTemplateColumns: "3fr 1fr 1fr 1fr auto",
    padding: "10px 0",
    borderBottom: "2px solid #eee",
    fontWeight: "bold"
  },
  cartItem: {
    display: "grid",
    gridTemplateColumns: "3fr 1fr 1fr 1fr auto",
    padding: "15px 0",
    borderBottom: "1px solid #eee",
    alignItems: "center"
  },
  productInfo: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  productImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "5px"
  },
  productName: {
    fontWeight: "bold"
  },
  productType: {
    color: "#666",
    fontSize: "14px"
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  quantityButton: {
    width: "30px",
    height: "30px",
    border: "1px solid #ddd",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    cursor: "pointer"
  },
  quantityInput: {
    width: "40px",
    textAlign: "center",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "5px"
  },
  price: {
    fontWeight: "bold"
  },
  subtotal: {
    fontWeight: "bold",
    color: "#7D1C4A"
  },
  removeButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#999",
    cursor: "pointer",
    fontSize: "18px",
    transition: "color 0.3s"
  },
  summaryContainer: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px"
  },
  promoContainer: {
    flex: "1",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px"
  },
  promoTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px"
  },
  promoForm: {
    display: "flex",
    gap: "10px"
  },
  promoInput: {
    flex: "1",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px"
  },
  promoButton: {
    backgroundColor: "#7D1C4A",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  promoMessage: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#7D1C4A"
  },
  totalContainer: {
    flex: "1",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px"
  },
  totalTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px"
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },
  totalLabel: {
    color: "#666"
  },
  totalValue: {
    fontWeight: "bold"
  },
  grandTotal: {
    borderTop: "1px solid #ddd",
    paddingTop: "10px",
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: "18px"
  },
  checkoutButton: {
    backgroundColor: "#7D1C4A",
    color: "white",
    border: "none",
    padding: "15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    marginTop: "15px",
    transition: "background-color 0.3s"
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px"
  },
  continueButton: {
    backgroundColor: "transparent",
    border: "1px solid #7D1C4A",
    color: "#7D1C4A",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px"
  },
  clearButton: {
    backgroundColor: "transparent",
    border: "1px solid #999",
    color: "#999",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  errorMessage: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    textAlign: "center"
  },
  loadingContainer: {
    textAlign: "center",
    padding: "40px 0"
  }
};

export default styles;