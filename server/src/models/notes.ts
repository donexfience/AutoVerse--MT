import mongoose, { Document, Schema } from "mongoose";

export interface IPosition {
  x: number;
  y: number;
}

export interface INote extends Document {
  title: string;
  content: string;
  position: IPosition;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Optional: Automatically update `updatedAt` on save currently im handling in the controler 
// NoteSchema.pre("save", function (next) {
//   this.updatedAt = new Date();
//   next();
// });

export default mongoose.model<INote>("Note", NoteSchema);
