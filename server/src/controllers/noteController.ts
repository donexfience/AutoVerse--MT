import { Request, Response } from "express";
import { HttpCode } from "@/utils/constants";


export class NoteController {
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
