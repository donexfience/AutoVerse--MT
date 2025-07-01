export type APIErrorResponse = {
  message: string;
};

export type Note = {
  _id: string;
  title: string;
  content: string;
  position: { x: number; y: number };
  createdAt: string;
  updatedAt: string;
};

export type CreateNoteRequest = {
  title: string;
  content: string;
  position?: { x: number; y: number };
};

export type UpdateNoteRequest = {
  _id: string;
  title?: string;
  content?: string;
  position?: { x: number; y: number };
};
