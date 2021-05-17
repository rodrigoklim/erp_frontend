import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost/criomec_final/backend/erp_backend/public/api',
  // baseURL: 'https://criomecapi.tecnoklim.com.br/api',
  withCredentials: true
})

export default apiClient
