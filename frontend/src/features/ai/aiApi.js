import { baseApi } from '@/services/baseApi';

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateProfessionalSummary: builder.mutation({
      query: (data) => ({ url: '/ai/professional-summary', method: 'POST', body: data }),
    }),
    improveExperience: builder.mutation({
      query: (data) => ({ url: '/ai/improve-experience', method: 'POST', body: data }),
    }),
    improveSkills: builder.mutation({
      query: (data) => ({ url: '/ai/improve-skills', method: 'POST', body: data }),
    }),
    improveGrammar: builder.mutation({
      query: (data) => ({ url: '/ai/grammar', method: 'POST', body: data }),
    }),
  }),
});

export const {
  useGenerateProfessionalSummaryMutation,
  useImproveExperienceMutation,
  useImproveSkillsMutation,
  useImproveGrammarMutation,
} = aiApi;
