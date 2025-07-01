import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Automatically update `updatedAt` on save currently im handling in the controler
// NoteSchema.pre("save", function (next) {
//   this.updatedAt = new Date();
//   next();
// });

export default mongoose.model<INote>("Note", noteSchema);
