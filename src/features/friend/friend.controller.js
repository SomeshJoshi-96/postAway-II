import { customErrorHandler } from "../middlewares/errorHandler.js";
import FriendRepository from "./friend.repository.js";

export default class FriendController {
  constructor() {
    this.friendRepository = new FriendRepository();
  }

  async getFriends(req, res, next) {
    try {
      const userId = req.params.userId;

      const resp = await this.friendRepository.getFriends(userId);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Fetched friends successfully",
          friends: resp.res,
        });
      } else {
        if (resp.error.msg) {
          throw new customErrorHandler(resp.error.statusCode, resp.error.msg);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      next(err);
    }
  }

  async getPendingrequests(req, res, next) {
    try {
      const resp = await this.friendRepository.getPendingrequests(req._id);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Fetched pending friend requests successfully",
          pendingFriendrequests: resp.res,
        });
      } else {
        if (resp.error.msg) {
          throw new customErrorHandler(resp.error.statusCode, resp.error.msg);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      next(err);
    }
  }

  async toggleFriendship(req, res, next) {
    try {
      const userId = req._id;
      const friendId = req.params.friendId;
      if (userId == friendId) {
        throw new customErrorHandler(400, "Can't send request to yourself!");
      }
      const resp = await this.friendRepository.toggleFriendship(
        userId,
        friendId
      );
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Toggled friendship successfully",
          user: resp.res1,
          friend: resp.res2,
          toggleAction: resp.toggleAction,
        });
      } else {
        if (resp.error.msg) {
          throw new customErrorHandler(resp.error.statusCode, resp.error.msg);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      next(err);
    }
  }

  async responseTorequest(req, res, next) {
    try {
      const userId = req._id;
      const friendId = req.params.friendId;
      const response = req.params.response;
      if (userId == friendId) {
        throw new customErrorHandler(400, "Can't accept request of yourself!");
      }

      if (response != "accept" && response != "reject") {
        throw new customErrorHandler(400, "Invalid response");
      }
      const resp = await this.friendRepository.responseTorequest(
        userId,
        friendId,
        response
      );
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Responded successfully",
          user: resp.res1,
          friend: resp.res2,
          action: resp.action,
        });
      } else {
        if (resp.error.msg) {
          throw new customErrorHandler(resp.error.statusCode, resp.error.msg);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      next(err);
    }
  }
}
