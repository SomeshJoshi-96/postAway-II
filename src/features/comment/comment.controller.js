import CommentRepository from "./comment.repository.js";
import { customErrorHandler } from "../middlewares/errorHandler.js";

export default class CommentController {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async addComment(req, res, next) {
    try {
      const postId = req.params.postId;
      const user = req._id;
      const content = req.body.content;
      const commentData = {
        content: content,
        post: postId,
        user: user,
      };
      console.log(commentData);
      const resp = await this.commentRepository.addComment(commentData);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Comment added successfully",
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

  async getComments(req, res, next) {
    try {
      const postId = req.params.postId;
      const resp = await this.commentRepository.getComments(postId);
      console.log(resp);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Comments fetched successfully",
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
      next(err);
    }
  }

  async deleteComment(req, res, next) {
    try {
        const id = req.params.id;
        console.log(id, req._id);
        const resp = await this.commentRepository.deleteComment(id, req._id);
        if (resp.success) {
          res.status(201).json({
            success: true,
            msg: "Comment deleted successfully",
            res: resp.res,
            updatedUsercomments: resp.updatedUsercomments,
            updatedPostcomments: resp.updatedPostcomments
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

  async updateComment(req, res, next) {
    try {
      const id = req.params.id;
      const content = req.body;
      console.log(id,content)
      const resp = await this.commentRepository.updateComment(content, id, req._id);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Comment updated successfully",
          updatedComment: resp.res,
        });
      } else {
        if (resp.error.msg) {
            console.log(resp.error.msg)
          throw new customErrorHandler(resp.error.statusCode, resp.error.msg);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
        next(err)
    }
  }
}
