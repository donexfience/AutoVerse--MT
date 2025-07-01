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
    console.log("User connected:", socket.id);

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
        console.log("Note position updated and broadcasted:", noteId, position);
      } catch (error) {
        console.error("Error updating note position:", error);
        socket.emit("error", "Failed to update note position");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  };

  private async updateNotePosition(
    noteId: string,
    userId: string,
    position: { x: number; y: number }
  ) {
    console.log(noteId, userId);
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) throw new Error("Note not found");

    note.position = position;
    note.updatedAt = new Date();
    return await note.save();
  }
}
