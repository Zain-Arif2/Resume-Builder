import { baseApi } from '@/services/baseApi';

export const resumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listResumes: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/resumes?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.data?.resumes
          ? [
              ...result.data.resumes.map(({ _id }) => ({
                type: 'Resume',
                id: _id,
              })),
              { type: 'Resume', id: 'LIST' },
            ]
          : [{ type: 'Resume', id: 'LIST' }],
    }),

    getResume: builder.query({
      query: (id) => `/resumes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Resume', id }],
    }),

    createResume: builder.mutation({
      query: (data) => ({
        url: '/resumes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Resume', id: 'LIST' }],
    }),

    updateResume: builder.mutation({
      query: ({ id, saveVersion, ...data }) => ({
        url: `/resumes/${id}${saveVersion ? '?saveVersion=true' : ''}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Resume', id },
        { type: 'Resume', id: 'LIST' },
      ],
    }),

    deleteResume: builder.mutation({
      query: (id) => ({
        url: `/resumes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Resume', id: 'LIST' }],
    }),

    duplicateResume: builder.mutation({
      query: (id) => ({
        url: `/resumes/${id}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Resume', id: 'LIST' }],
    }),

    getPublicResume: builder.query({
      query: (slug) => `/public/resumes/${slug}`,
    }),

    listVersions: builder.query({
      query: (id) => `/resumes/${id}/versions`,
      providesTags: (result, error, id) => [
        { type: 'ResumeVersion', id },
      ],
    }),

    restoreVersion: builder.mutation({
      query: ({ id, versionNumber }) => ({
        url: `/resumes/${id}/versions/${versionNumber}/restore`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Resume', id },
        { type: 'ResumeVersion', id },
      ],
    }),
  }),
});

export const {
  useListResumesQuery,
  useGetResumeQuery,
  useCreateResumeMutation,
  useUpdateResumeMutation,
  useDeleteResumeMutation,
  useDuplicateResumeMutation,
  useGetPublicResumeQuery,
  useListVersionsQuery,
  useRestoreVersionMutation,
} = resumeApi;