import { Router } from "express";
import { NoteController } from "@/controllers/noteController";

export class NoteRoutes {
  private router: Router;
  private noteController: NoteController;

  constructor(noteController: NoteController) {
    this.router = Router();
    this.noteController = noteController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", (req, res) => {
      res.json({
        message: "API is running!",
        version: "1.0.0",
        endpoints: {
          auth: {
            "GET /api/user/notes": " get notes from server",
            "GET /api/user/notes/:id":"To get notes  by id from server",
            "GET /api/user/categories": "signup to get categories from server",
            "GET /api/user/subcategories":
              "signup to get subcategories from server",
          },
        },
      });
    });

  }

  public getRouter(): Router {
    return this.router;
  }
}
