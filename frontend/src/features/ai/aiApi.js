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
    generateCoverLetter: builder.mutation({
      query: (data) => ({ url: '/ai/cover-letter', method: 'POST', body: data }),
    }),
    analyzeATS: builder.mutation({
      query: (data) => ({ url: '/ai/ats-analysis', method: 'POST', body: data }),
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
  useGenerateInterviewQuestionsMutation,
  useSuggestCareersMutation,
} = aiApi;
