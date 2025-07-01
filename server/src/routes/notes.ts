import { Router } from "express";
import { NoteController } from "../controllers/noteController";
import { userMiddleware } from "../middlewares/user";

export class NoteRoutes {
  private router: Router;
  private noteController: NoteController;

  constructor(noteController: NoteController) {
    this.router = Router();
    this.noteController = noteController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/details", (req, res) => {
      res.json({
        message: "NOTE API is running!",
        version: "1.0.5",
        endpoints: {
          notes: {
            "GET /api/notes": " get notes from server",
            "POST /api/notes": "create a notes to server",
            "PUT /api/notes/:id": " update a note from server",
            "DELETE /api/notes/:id": "delte a notes from server",
            "POST /api/notes/:id/enhance": "enhance a note from server",
            "GET /api/notes/:id": "get a note by id from server",
          },
        },
      });
    });
    this.router.use(userMiddleware);
    this.router.post("/:id/enhance", this.noteController.enhanceNote);
    this.router.get("/", this.noteController.getNotes);
    this.router.get("/:id", this.noteController.getNoteById);
    this.router.post("/", this.noteController.createNote);
    this.router.put("/:id", this.noteController.updateNote);
    this.router.delete("/:id", this.noteController.deleteNote);
  }

  public getRouter(): Router {
    return this.router;
  }
}
