import { baseApi } from '@/services/baseApi';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (planId) => ({ url: '/payments/checkout', method: 'POST', body: { planId } }),
    }),
  }),
});

export const { useCreateCheckoutSessionMutation } = paymentApi;
