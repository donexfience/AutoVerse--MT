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
    onSuccess: (data:any) => {
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
  });
};

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateNoteById,
    onSuccess: (data) => {
      dispatch(updateNote(data));
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
    mutationFn: ({ id, prompt }: { id: string; prompt: string }) =>
      enhanceNote(id, prompt),
    onSuccess: (data) => {
      dispatch(updateNote(data));
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
