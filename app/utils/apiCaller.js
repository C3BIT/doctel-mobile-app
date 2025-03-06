import axios from "axios";
import { api } from "../config/api";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};
const fileConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const publicGet = async (endpoint) => {
  const response = await axios.get(`${api}${endpoint}`, config);
  return response.data;
};
export const publicGetSingle = async (endpoint, id) => {
  const response = await axios.get(`${api}${endpoint}`, config);
  return response.data;
};
export const publicPost = async (endpoint, body) => {
  const response = await axios.post(`${api}${endpoint}`, body, config);
  return response.data;
};

export const privateGet = async (endpoint, token) => {
  config.headers.token = `${token}`;
  const response = await axios.get(`${api}${endpoint}`, config);
  return response.data;
};

export const privatePost = async (endpoint, token, body) => {
  config.headers.token = `${token}`;
  const response = await axios.post(`${api}${endpoint}`, body, config);
  return response.data;
};

export const privatePostFile = async (endpoint, token, body) => {
  fileConfig.headers.token = `${token}`;
  const response = await axios.post(`${api}${endpoint}`, body, fileConfig);
  return response.data;
};

export const privatePut = async (endpoint, token, body) => {
  config.headers.token = `${token}`;
  const response = await axios.put(`${api}${endpoint}`, body, config);
  return response.data;
};
export const privatePatch = async (endpoint, token, body) => {
  config.headers.token = `${token}`;
  const response = await axios.patch(`${api}${endpoint}`, body, config);
  return response.data;
};

export const publicPatch = async (endpoint, body) => {
  const response = await axios.patch(`${api}${endpoint}`, body, config);
  return response.data;
};