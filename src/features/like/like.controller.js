import { LikeRepository } from "./like.repository.js";
import { customErrorHandler } from "../middlewares/errorHandler.js";

export class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async getLikes(req, res, next) {
    try {
      const id = req.params.id;
      const resp = await this.likeRepository.getLikes(id);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Like fetched successfully",
          res: resp.res,
        });
      } else {
        if (resp.error.msg) {
          throw new customErrorHandler(resp.error.statusCode, resp.error.msg);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async toggleLike(req, res, next) {
    try {
      const id = req.params.id;
      const user = req._id;
      const on_model = req.query.type;
      const resp = await this.likeRepository.toggleLike(user, id, on_model);

      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Like action performed successfully",
          res: resp.res,
          likeStatus: resp.likeStatus,
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
