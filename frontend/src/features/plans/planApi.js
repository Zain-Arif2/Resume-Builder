import { baseApi } from '@/services/baseApi';

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listActivePlans: builder.query({
      query: () => '/plans',
      providesTags: ['Plan'],
    }),
    listAllPlans: builder.query({
      query: () => '/plans/all',
      providesTags: ['Plan'],
    }),
    createPlan: builder.mutation({
      query: (data) => ({ url: '/plans', method: 'POST', body: data }),
      invalidatesTags: ['Plan'],
    }),
    updatePlan: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/plans/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Plan'],
    }),
    deletePlan: builder.mutation({
      query: (id) => ({ url: `/plans/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Plan'],
    }),
  }),
});

export const {
  useListActivePlansQuery,
  useListAllPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = planApi;
