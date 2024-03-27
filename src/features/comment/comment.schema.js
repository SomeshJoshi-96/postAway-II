import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    maxLength: [100, "Comment can't be greater than 100 characters"],
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }
});