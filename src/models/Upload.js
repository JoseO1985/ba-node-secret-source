import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema(
  {
    originalname: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      unique: true,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    processed: {
      type: Boolean,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model("Upload", UploadSchema);
