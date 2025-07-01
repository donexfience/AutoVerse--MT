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
  });
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
    onError: (error) => {
      console.error("Failed to create note:", error);
    },
  });
};

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateNoteById,
    onSuccess: (data) => {
      console.log("Note updated successfully:", data);
      dispatch(updateNote(data));
      // Invalidate queries to refetch fresh data to prevent cahcing
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Failed to update note:", error);
    },
    onMutate: async (updatedNote: any) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      // getting  the previous value
      const previousNotes = queryClient.getQueryData(["notes"]);

      // Optimistically update the Redux state
      dispatch(updateNote(updatedNote));

      // Return a context object with the snapshotted value
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
    onError: (error) => {
      console.error("Failed to delete note:", error);
    },
  });
};

export const useEnhanceNoteMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, promptType }: { id: string; promptType: string }) =>
      enhanceNote(id, promptType),
    onSuccess: (data) => {
      dispatch(updateNote(data));
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Failed to enhance note:", error);
    },
  });
};
