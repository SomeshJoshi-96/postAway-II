import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    maxLength: [400, "Caption can't be greater than 400 characters"],
    required: true,
  },
  imageURL: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});
