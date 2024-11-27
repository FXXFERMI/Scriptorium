import axios from 'axios';
import Cookies from 'js-cookie';

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  });

  api.interceptors.request.use(
    async (config) => {
      const accessToken = Cookies.get('accessToken');

      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          console.log("0000000000000000000000000000000");
          // const refreshToken = Cookies.get('refreshToken');
          // if (!refreshToken) {
          //   throw new Error('Refresh token is missing');
          // }
          // console.log("111111efef3g4fgggf411111111111111");
          // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/refresh`, { refreshToken }, {
          //   withCredentials: true,
          // });
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, null, {
            withCredentials: true,
          });
          console.log("11111111111111111111111111111111");
          // console.log(response.data);
          const { accessToken } = response.data;
          console.log("222222222222222222222222222222222");
          // Set new access token in cookies
          Cookies.set('accessToken', accessToken, { path: '/' });
          console.log("3333333333333333333333333333333333");
          // Update authorization header
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          console.log("44444444444444444444444444444444444");
          // Retry original request
          // authContext.refreshLoginStatus();
          return api(originalRequest);
        } catch (err) {
          // Handle refresh token expiry or failure to refresh
          console.error(err, error.response);
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          window.location.href = '/users/login'; // Redirect to login page
        }
      }

      return Promise.reject(error);
    }
  );

export default api;