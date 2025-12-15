import API_URL from "../config/api";

const AUTH_URL = `${API_URL}/api/auth`;

export const login = async (username, password) => {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return response.json(); // this should return the JWT token
};
