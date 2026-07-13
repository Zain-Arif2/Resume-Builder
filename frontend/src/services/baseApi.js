import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { openUpgradeModal } from '@/features/credits/creditSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch({ type: 'auth/forceLogout' });
    }
  }

  // Any AI/resume-generation call that hits the free-plan limit surfaces here,
  // regardless of which feature triggered it. One place, no duplicated handling.
  if (result.error && result.error.status === 403 && result.error.data?.code === 'FREE_LIMIT_REACHED') {
    api.dispatch(openUpgradeModal());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Resume', 'ResumeVersion', 'Template', 'AIHistory', 'Notification', 'Admin'],
  endpoints: () => ({}),
});
