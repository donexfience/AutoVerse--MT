import express, { Application } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { NoteController } from "./controllers/noteController";
import { NoteRoutes } from "./routes/notes";
import Database from "@/config/database";

dotenv.config();

class Server {
  private app: Application;
  private port: number;
  private noteController: NoteController;
  private noteRoutes: NoteRoutes;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.noteController = new NoteController();
    this.noteRoutes = new NoteRoutes(this.noteController);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.connectToDatabase();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(express.json());

    this.app.use(
      cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        credentials: true,
      })
    );
    this.app.use(morgan("tiny"));
    this.app.use(
      "/uploads",
      express.static(path.join(__dirname, "public/uploads"))
    );
  }

  private initializeRoutes(): void {
    this.app.use("/api/notes", this.noteRoutes.getRouter());

    this.app.get("/health", (req, res) => {
      res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
      console.log(`📍 Health check: http://localhost:${this.port}/health`);
      console.log(`📍 API endpoints: http://localhost:${this.port}/api`);
    });
  }

  private async connectToDatabase(): Promise<void> {
    await Database.connect();
  }

  public getApp(): Application {
    return this.app;
  }
}

export default Server;
