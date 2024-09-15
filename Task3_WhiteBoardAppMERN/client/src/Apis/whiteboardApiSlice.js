import { apiSlice } from "./apiSlice";

const whiteboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createDraw: build.mutation({
      query: (data) => ({
        url: `/whiteboards/create`, 
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ALLDRAWINGS", "ALLUSERS"], 
    }),
    
    // Fetch all drawings
    getAllDrawings: build.query({
      query: (data) => ({
        url: `/whiteboards/drawings`, 
        method: "POST",
        body: data,
      }),
      providesTags: ["ALLDRAWINGS"], 
    }),

    getDrawingById: build.query({
      query: (id) => `whiteboards/drawings/${id}`,
    }),
    
    // Update a specific drawing
    updateDrawing: build.mutation({
      query: ({ id, shapeCoordination, drawingTitle }) => ({
        url: `whiteboards/drawings/${id}`,
        method: "PUT",
        body: { shapeCoordination, drawingTitle },
      }),
      invalidatesTags: ["ALLDRAWINGS"],
    }),
    
    // Delete a specific drawing
    deleteDrawing: build.mutation({
      query: (id) => ({
        url: `whiteboards/drawings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ALLDRAWINGS"],  
    }),
  }),
});

export const { 
  useCreateDrawMutation, 
  useGetAllDrawingsQuery, 
  useUpdateDrawingMutation, 
  useGetDrawingByIdQuery, 
  useDeleteDrawingMutation 
} = whiteboardApiSlice;
