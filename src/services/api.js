import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://criomec_final.test/api',
  // baseURL: 'https://criomecapi.tecnoklim.com.br/api',
  withCredentials: true
})

export default apiClient