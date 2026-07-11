import { baseApi } from '@/services/baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query({
      query: ({ page = 1, limit = 15, search = '' } = {}) =>
        `/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      providesTags: (result) =>
        result?.data?.users
          ? [...result.data.users.map(({ _id }) => ({ type: 'Admin', id: _id })), { type: 'Admin', id: 'LIST' }]
          : [{ type: 'Admin', id: 'LIST' }],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({ url: `/admin/users/${id}/role`, method: 'PATCH', body: { role } }),
      invalidatesTags: [{ type: 'Admin', id: 'LIST' }],
    }),
    toggleUserActive: builder.mutation({
      query: ({ id, isActive }) => ({ url: `/admin/users/${id}/status`, method: 'PATCH', body: { isActive } }),
      invalidatesTags: [{ type: 'Admin', id: 'LIST' }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Admin', id: 'LIST' }],
    }),
    getAnalytics: builder.query({
      query: () => '/admin/analytics',
    }),
    getSystemLogs: builder.query({
      query: () => '/admin/logs',
    }),
  }),
});

export const {
  useListUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserActiveMutation,
  useDeleteUserMutation,
  useGetAnalyticsQuery,
  useGetSystemLogsQuery,
} = adminApi;
