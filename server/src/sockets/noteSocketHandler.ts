import { Server as SocketIOServer, Socket } from "socket.io";
import Note from "@/models/notes";

interface NotePositionData {
  noteId: string;
  position: {
    x: number;
    y: number;
  };
  userId: string;
}

export class NoteSocketHandler {
  constructor(private io: SocketIOServer) {
    this.io.on("connection", this.handleConnection);
  }

  private handleConnection = (socket: Socket): void => {

    socket.on("updateNotePosition", async (data: NotePositionData) => {
      const { noteId, position, userId } = data;
      try {
        const updatedNote = await this.updateNotePosition(
          noteId,
          userId,
          position
        );
        socket.broadcast.emit("notePositionUpdated", {
          noteId,
          position: updatedNote.position,
        });
      } catch (error) {
        socket.emit("error", "Failed to update note position");
      }
    });

    socket.on("disconnect", () => {
    });
  };

  private async updateNotePosition(
    noteId: string,
    userId: string,
    position: { x: number; y: number }
  ) {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) throw new Error("Note not found");

    note.position = position;
    note.updatedAt = new Date();
    return await note.save();
  }
}
