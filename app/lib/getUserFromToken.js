export const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) return null;

    // Decode JWT payload
    const base64Payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(base64Payload));

    return decodedPayload; // { id, email, name }
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};