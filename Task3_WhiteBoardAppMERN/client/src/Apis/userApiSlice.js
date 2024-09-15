import { apiSlice } from "./apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data) => ({
        url: `/users/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["USER"],
    }),
    createUser: build.mutation({
      query: (data) => ({
        url: `/users/create`,
        method: "POST",
        body: data,
      }),
    }),
    updatePassword: build.mutation({
      query: (data) => ({
        url: `/users/update-password`,
        method: "POST",
        body: data,
      }),
    }),
    getAllUsers: build.query({
      query: () => ({
        url: `/users/get-all-users`,
        method: "GET",
      }),
      providesTags: ["ALLUSERS"],
    }),
    deleteUser: build.mutation({
      query: (userId) => ({
        url: `/users/delete/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ALLUSERS"], 
    }),
  }),
});

export const {
  useLoginMutation,
  useCreateUserMutation,
  useUpdatePasswordMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,  
} = userApiSlice;
