import axios from 'axios';

const BASE_URL = process.env.REACT_APP_FHIR_SERVER_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/fhir+json',
    'Accept': 'application/fhir+json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  },
  withCredentials: false, // No enviar credenciales cruzadas si no es necesario
});

// Enviar solicitud OPTIONS para preflight manual
const sendPreflightRequest = async (resourceType) => {
  try {
    console.log(resourceType);
    const response = await axiosInstance.options(`/${resourceType}`);
    console.log('Preflight OPTIONS Response:', response);
  } catch (error) {
    console.error('Error en preflight OPTIONS:', error);
  }
};

export { sendPreflightRequest };
