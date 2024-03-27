import express from 'express';
import { LikeController } from './like.controller.js';
import { auth } from '../middlewares/jwtAuth.js';
// 2. Initialize Express router.
const likeRouter = express.Router();

const likeController = new LikeController();

likeRouter.get("/:id", auth, (req, res, next)=>{
    likeController.getLikes(req, res, next);
})

likeRouter.get("/toggle/:id", auth,(req, res, next)=>{
    likeController.toggleLike(req, res, next);
})

export default likeRouter;