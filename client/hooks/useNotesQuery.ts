import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  createNote,
  getNotes,
  updateNoteById,
  deleteNoteById,
  enhanceNote,
} from "../api/services/notes";
import {
  setNotes,
  addNote,
  updateNote,
  deleteNote,
} from "../redux/slice/noteSlice";

export const useNotesQuery = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
    onSuccess: (data: any) => {
      dispatch(setNotes(data));
    },
  } as any);
};

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createNote,
    onSuccess: (data) => {
      dispatch(addNote(data));
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateNoteById,
    onSuccess: (data) => {
      dispatch(updateNote(data));
      // Invalidate queries to refetch fresh data to prevent cahcing
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onMutate: async (updatedNote: any) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      // getting  the previous value
      const previousNotes = queryClient.getQueryData(["notes"]);

      // ALl time  update the Redux state
      dispatch(updateNote(updatedNote));

      // Return a context object with the got value
      return { previousNotes };
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: deleteNoteById,
    onSuccess: (_, deletedId) => {
      dispatch(deleteNote(deletedId));
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useEnhanceNoteMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, promptType }: { id: string; promptType: string }) =>
      enhanceNote(id, promptType),
    onSuccess: (response: any) => {
      if (response.type === "enhanced") {
        dispatch(updateNote(response.data));
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      } else if (response.type === "suggestion") {
      }
    },
  });
};
