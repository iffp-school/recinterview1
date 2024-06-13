import axios from "axios";

const axiosClient = axios.create({ //global config
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  withCredentials: true, // send cookies when cross-domain requests
})

// axiosClient.interceptors.request.use(function (config) {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = 'Bearer ' + token
//   }
//   return config
// })

export {axiosClient}
