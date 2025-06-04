import axios from "axios";
// Create an axiosInstance that will create a connection to make requests to the server
// Set the baseURL to the backend endpoint and set withCredentials to true to send cookies and credentials w/ cross-origin requests
export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
});
