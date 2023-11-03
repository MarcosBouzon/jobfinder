import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5100",
  }),
  refetchOnFocus: true,
  tagTypes: ["Jobs", "Settings"],
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => "/",
      providesTags: ["Jobs"],
    }),
    getApplied: builder.query({
      query: () => "/applied",
    }),
    markSeen: builder.mutation({
      query: (jobId) => ({
        url: `/markseen/${jobId}`,
        method: "PATCH",
        body: jobId,
      }),
      invalidatesTags: ["Jobs"],
    }),
    markApplied: builder.mutation({
      query: (jobId) => ({
        url: `/markapplied/${jobId}`,
        method: "PATCH",
        body: jobId,
      }),
      invalidatesTags: ["Jobs"],
    }),
    markDeleted: builder.mutation({
      query: (jobId) => ({
        url: `/deletejob/${jobId}`,
        method: "DELETE",
        body: jobId,
      }),
      invalidatesTags: ["Jobs"],
    }),
    searchJobs: builder.query({
      query: ({ title, company }) => ({
        url: `/searchjob?title=${title}&company=${company}`,
      }),
      providesTags: ["Jobs"],
    }),
    undeleteJob: builder.mutation({
      query: (jobId) => ({
        url: `/undelete/${jobId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Jobs"],
    }),
    getSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),
    saveSettings: builder.mutation({
      query: (settings) => ({
        url: "/settings",
        method: "POST",
        body: settings,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetAppliedQuery,
  useMarkSeenMutation,
  useMarkAppliedMutation,
  useMarkDeletedMutation,
  useSearchJobsQuery,
  useUndeleteJobMutation,
  useGetSettingsQuery,
  useSaveSettingsMutation,
} = apiSlice;
