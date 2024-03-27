// 1. Import express.
import express from "express";
import { auth } from "../middlewares/jwtAuth.js";
import { uploadFile } from "../middlewares/fileUpload.middleware.js";
import PostController from "./post.controller.js";
// 2. Initialize Express router.
const postRoutes = express.Router();

const postController = new PostController();

// All the paths to controller methods.
postRoutes.post("/", auth, uploadFile.single("imageUrl"), (req, res, next) => {
  console.log("In add post");
  postController.addPost(req, res, next);
});

postRoutes.get("/", auth, (req, res, next) => {
  postController.getAllposts(req, res, next);
});

postRoutes.get("/all", auth, (req, res, next) => {
  postController.getAll(req, res, next);
});

postRoutes.get("/:id", auth, (req, res, next) => {
  postController.getOnePost(req, res, next);
});

postRoutes.delete("/:id", auth, (req, res, next) => {
  postController.deletePost(req, res, next);
});

postRoutes.put(
  "/:id",
  auth,
  uploadFile.single("imageUrl"),
  (req, res, next) => {
    postController.updatePost(req, res, next);
  }
);

export default postRoutes;
