import { Request, Response } from "express";
import Note from "@/models/notes";
import axios from "axios";
import { HttpCode } from "../utils/constants";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export class NoteController {
  // Get all notes for a user
  public getNotes = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId || (req.headers["x-user-id"] as string);

      if (!userId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "User ID is required",
        });
        return;
      }

      const notes = await Note.find({ userId });
      res.status(HttpCode.OK).json({
        success: true,
        data: notes,
        message: "Notes retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve notes");
    }
  };

  // Get a note by ID (with user validation)
  public getNoteById = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId || (req.headers["x-user-id"] as string);

      if (!id || !userId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Note ID and User ID are required",
        });
        return;
      }

      const note = await Note.findOne({ _id: id, userId });
      if (!note) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Note not found",
        });
        return;
      }

      res.status(HttpCode.OK).json({
        success: true,
        data: note,
        message: "Note retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve note");
    }
  };

  // Create a new note
  public createNote = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { title, content, position } = req.body;
      const userId = req.userId || (req.headers["x-user-id"] as string);

      if (!title || !content || !userId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Title, content, and user ID are required",
        });
        return;
      }

      const newNote = new Note({
        title,
        content,
        position: position || { x: 0, y: 0 },
        userId,
      });

      const savedNote = await newNote.save();
      res.status(HttpCode.CREATED).json({
        success: true,
        data: savedNote,
        message: "Note created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create note");
    }
  };

  // Update a note
  public updateNote = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, content, position } = req.body;
      const userId = req.userId || (req.headers["x-user-id"] as string);

      if (!id || !userId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Note ID and User ID are required",
        });
        return;
      }

      const note = await Note.findOne({ _id: id, userId });
      if (!note) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Note not found",
        });
        return;
      }

      if (title) note.title = title;
      if (content) note.content = content;
      if (position) note.position = position;
      note.updatedAt = new Date();

      const updatedNote = await note.save();

      res.status(HttpCode.OK).json({
        success: true,
        data: updatedNote,
        message: "Note updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update note");
    }
  };

  // Delete a note
  public deleteNote = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId || (req.headers["x-user-id"] as string);

      if (!id || !userId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Note ID and User ID are required",
        });
        return;
      }

      const note = await Note.findOne({ _id: id, userId });
      if (!note) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Note not found",
        });
        return;
      }

      await Note.findByIdAndDelete(id);

      res.status(HttpCode.OK).json({
        success: true,
        message: "Note deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete note");
    }
  };

  // Enhance note using AI
  public enhanceNote = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { promptType } = req.body;
      const userId = req.userId || (req.headers["x-user-id"] as string);

      if (!id || !promptType || !userId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Note ID, prompt type, and user ID are required",
        });
        return;
      }

      const note = await Note.findOne({ _id: id, userId });
      if (!note) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Note not found",
        });
        return;
      }

      let aiPrompt: string;
      switch (promptType) {
        case "improve grammar":
          aiPrompt = `Improve the grammar and style of this text: "${note.content}"`;
          break;
        case "summarize":
          aiPrompt = `Summarize this text: "${note.content}"`;
          break;
        case "expand":
          aiPrompt = `Expand this text with more details: "${note.content}"`;
          break;
        default:
          res.status(HttpCode.BAD_REQUEST).json({
            success: false,
            message: "Invalid prompt type",
          });
          return;
      }

      const aiResponse: any = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek/deepseek-r1:free",
          messages: [{ role: "user", content: aiPrompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const enhancedContent = aiResponse.data.choices[0].message.content;

      note.content = enhancedContent;
      note.updatedAt = new Date();

      const updatedNote = await note.save();

      res.status(HttpCode.OK).json({
        success: true,
        data: updatedNote,
        message: "Note enhanced successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to enhance note");
    }
  };

  // Handle errors consistently
  private handleError(res: Response, error: any, message: string): void {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message,
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
}
