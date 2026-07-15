import { baseApi } from '@/services/baseApi';

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateProfessionalSummary: builder.mutation({
      query: (data) => ({ url: '/ai/professional-summary', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    improveExperience: builder.mutation({
      query: (data) => ({ url: '/ai/improve-experience', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    improveSkills: builder.mutation({
      query: (data) => ({ url: '/ai/improve-skills', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    improveGrammar: builder.mutation({
      query: (data) => ({ url: '/ai/grammar', method: 'POST', body: data }),
    }),
    generateCoverLetter: builder.mutation({
      query: (data) => ({ url: '/ai/cover-letter', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    analyzeATS: builder.mutation({
      query: (data) => ({ url: '/ai/ats-analysis', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    analyzeGeneralATS: builder.mutation({
      query: (data) => ({ url: '/ai/general-ats-score', method: 'POST', body: data }),
    }),
    generateInterviewQuestions: builder.mutation({
      query: (data) => ({ url: '/ai/interview-questions', method: 'POST', body: data }),
    }),
    suggestCareers: builder.mutation({
      query: (data) => ({ url: '/ai/career-suggestions', method: 'POST', body: data }),
    }),
  }),
});

export const {
  useGenerateProfessionalSummaryMutation,
  useImproveExperienceMutation,
  useImproveSkillsMutation,
  useImproveGrammarMutation,
  useGenerateCoverLetterMutation,
  useAnalyzeATSMutation,
  useAnalyzeGeneralATSMutation,
  useGenerateInterviewQuestionsMutation,
  useSuggestCareersMutation,
} = aiApi;
