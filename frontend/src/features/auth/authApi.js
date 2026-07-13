import { baseApi } from '@/services/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({ url: '/auth/register', method: 'POST', body: data }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({ url: '/auth/verify-otp', method: 'POST', body: data }),
    }),
    resendOtp: builder.mutation({
      query: (data) => ({ url: '/auth/resend-otp', method: 'POST', body: data }),
    }),
    login: builder.mutation({
      query: (data) => ({ url: '/auth/login', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['User'],
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({ url: '/auth/me', method: 'PATCH', body: data }),
      invalidatesTags: ['User'],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({ url: '/auth/forgot-password', method: 'POST', body: data }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({ url: `/auth/reset-password/${token}`, method: 'POST', body: { password } }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
