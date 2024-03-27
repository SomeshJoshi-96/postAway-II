import dotenv from "dotenv";
dotenv.config();
import express from "express";
import userRouter from "./src/features/user/user.routes.js";
import cookieParser from "cookie-parser";
import { appLevelErrorHandlerMiddleware } from "./src/features/middlewares/errorHandler.js";
import postRoutes from "./src/features/post/post.routes.js";
import commentRouter from "./src/features/comment/comment.routes.js";
import likeRouter from "./src/features/like/like.routes.js";
import friendRouter from "./src/features/friend/friend.routes.js";
import otpRouter from "./src/features/otp/otp.routes.js";
import loggerMiddleware from "./src/features/middlewares/logger.middleware.js";
const server = express();

server.use(express.static("public"));
server.use(cookieParser());
server.use(express.json());
server.use(loggerMiddleware)
server.use("/api/users", userRouter);
server.use("/api/posts", postRoutes);
server.use("/api/comments", commentRouter);
server.use("/api/likes", likeRouter);
server.use("/api/friends", friendRouter);
server.use("/api/otp", otpRouter);
server.use(appLevelErrorHandlerMiddleware);

export default server;
