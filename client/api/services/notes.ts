import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import {
  APIErrorResponse,
  CreateNoteRequest,
  Note,
  UpdateNoteRequest,
} from "../../types/types";

export const getNotes = async (): Promise<Note[]> => {
  try {
    const response = await axiosInstance.get("/notes");
    return response.data.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const getNoteById = async (id: string): Promise<Note> => {
  try {
    const response = await axiosInstance.get(`/notes/${id}`);
    return response.data.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const createNote = async (note: CreateNoteRequest): Promise<Note> => {
  try {
    const response = await axiosInstance.post("/notes", note);
    return response.data.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const updateNoteById = async (note: UpdateNoteRequest): Promise<Note> => {
  try {
    const response = await axiosInstance.put(`/notes/${note._id}`, note);
    return response.data.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const updateNotePosition = async (
  note: Pick<Note, "_id" | "position">
): Promise<Note> => {
  try {
    const response = await axiosInstance.put(`/notes/${note._id}`, {
      position: note.position,
    });
    return response.data.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const deleteNoteById = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/notes/${id}`);
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const enhanceNote = async (
  id: string,
  promptType: string
): Promise<Note> => {
  try {
    const response = await axiosInstance.post(`/notes/${id}/enhance`, {
      promptType,
    });
    return response.data.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};
