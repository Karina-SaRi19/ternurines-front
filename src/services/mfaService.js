import axios from "axios";

const API_URL = "https://ternurines-back.onrender.com";

// Function to request an MFA code be sent to the user's email
export const sendMfaCode = async (userId, email) => {
  try {
    const response = await axios.post(`${API_URL}/send-mfa-code`, {
      userId,
      email
    });
    
    return response.data;
  } catch (error) {
    console.error("Error sending MFA code:", error);
    throw error;
  }
};

// Function to verify the MFA code entered by the user
export const verifyMfaCode = async (userId, code) => {
  try {
    const response = await axios.post(`${API_URL}/verify-mfa`, {
      userId,
      code
    });
    
    return response.data;
  } catch (error) {
    console.error("Error verifying MFA code:", error);
    throw error;
  }
};