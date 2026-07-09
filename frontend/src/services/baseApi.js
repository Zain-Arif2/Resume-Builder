import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  credentials: 'include', // HTTP-only cookies (access/refresh token) automatically bhejne ke liye
});

// Base query jo 401 par automatically refresh-token endpoint try karta hai
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Refresh token cookie se naya access token lene ki koshish
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Refresh successful — original request retry karo
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh bhi fail — user ko logout state mein bhejo
      api.dispatch({ type: 'auth/forceLogout' });
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Resume', 'ResumeVersion', 'Template', 'AIHistory', 'Notification', 'Admin'],
  endpoints: () => ({}), // Har feature apne endpoints "injectEndpoints" se add karega
});