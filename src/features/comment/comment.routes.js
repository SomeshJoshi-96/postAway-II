import express from "express";
import CommentController from "./comment.controller.js";
import { auth } from "../middlewares/jwtAuth.js";

// 2. Initialize Express router.
const commentRouter = express.Router();

const commentController = new CommentController();

// All the paths to controller methods.

commentRouter.post("/:postId", auth, (req, res, next) => {
  console.log("In post Comment");
  commentController.addComment(req, res, next);
});

commentRouter.get("/:postId", auth, (req, res, next) => {
  console.log("In read comment");
  commentController.getComments(req, res, next);
});

commentRouter.put("/:id", auth, (req, res, next) => {
  console.log("In update comment");
  commentController.updateComment(req, res, next);
});

commentRouter.delete("/:id", auth, (req, res, next) => {
  console.log("In delete comment");
  commentController.deleteComment(req, res, next);
});

export default commentRouter;
