import axios from "axios"
import { API_BASE_URL } from "../constants/config"
import * as SecureStore from "expo-secure-store"

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

API.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default API
