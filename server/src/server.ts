import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { NoteController } from "./controllers/noteController";
import { NoteRoutes } from "./routes/notes";
import Database from "./config/database";
import { NoteSocketHandler } from "./sockets/noteSocketHandler";

dotenv.config();

class Server {
  private app: Application;
  private port: number;
  private noteController: NoteController;
  private noteRoutes: NoteRoutes;
  private io: SocketIOServer;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.noteController = new NoteController();
    this.noteRoutes = new NoteRoutes(this.noteController);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.connectToDatabase();

    // Create HTTP server and initialize Socket.IO
    const httpServer = createServer(this.app);
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        credentials: true,
      },
    });
    new NoteSocketHandler(this.io);

    // // Socket.IO authentication middleware
    // this.io.use((socket, next) => {
    //   const token = socket.handshake.query.token;
    //   if (token) {
    //     // Replace with your actual token verification logic (e.g., JWT)
    //     const user = this.verifyToken(token as string); // Implement this function
    //     if (user) {
    //       socket.user = user; // Attach user to socket
    //       next();
    //     } else {
    //       next(new Error("Authentication error"));
    //     }
    //   } else {
    //     next(new Error("No token provided"));
    //   }
    // });

    // Start the server
    httpServer.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
      console.log(`📍 Health check: http://localhost:${this.port}/health`);
      console.log(`📍 API endpoints: http://localhost:${this.port}/api`);
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
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

  private async connectToDatabase(): Promise<void> {
    await Database.connect();
  }

  public getApp(): Application {
    return this.app;
  }

  // private verifyToken(token: string): any {
  //   return { id: "user-id-example" };
  // }
}

export default Server;
