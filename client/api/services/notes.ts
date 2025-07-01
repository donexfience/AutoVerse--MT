import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";

export type APIErrorResponse = {
  message: string;
};

export const getNotes = async () => {
  try {
    const response = await axiosInstance.get("/notes");
    return response.data;
  } catch (err) {
    throw err as AxiosError<APIErrorResponse>;
  }
};

export const updateNotePosition = async (note) => {
  const response = await axiosInstance.put(`/api/notes/${note._id}`, note);
  return response.data.data;
};
