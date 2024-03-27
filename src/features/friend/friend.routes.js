import express from "express";
import FriendController from "./friend.controller.js";
import { auth } from "../middlewares/jwtAuth.js";

// 2. Initialize Express router.
const friendRouter = express.Router();

const friendController = new FriendController();

// All the paths to controller methods.

friendRouter.get("/get-friends/:userId",auth, (req, res, next) => {
  friendController.getFriends(req, res, next);
});
friendRouter.get("/get-pending-requests",auth, (req, res, next) => {
  friendController.getPendingrequests(req, res, next);
});
friendRouter.get("/toggle-friendship/:friendId",auth, (req, res, next) => {
  friendController.toggleFriendship(req, res, next);
});

friendRouter.get("/response-to-request/:friendId/:response",auth, (req, res, next) => {
  friendController.responseTorequest(req, res, next);
});

export default friendRouter;
