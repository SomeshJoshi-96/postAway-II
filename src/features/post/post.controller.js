import PostRepository from "./post.repository.js";
import { customErrorHandler } from "../middlewares/errorHandler.js";

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  async addPost(req, res, next) {
    try {
      let formData = "";
      if (req.file) {
        formData = {
          caption: req.body.caption,
          imageURL:
            req.protocol +
            "://" +
            req.get("host") +
            "/images/" +
            req.file.filename,
          user: req._id,
        };
      } else {
        formData = {
          caption: req.body.caption,
          user: req._id,
        };
      }

      console.log(formData);
      const resp = await this.postRepository.addPost(formData);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Post added successfully",
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

  async getOnePost(req, res, next) {
    try {
      const id = req.params.id;
      const resp = await this.postRepository.getOnePost(id);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Post fetched successfully",
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

  async getAll(req, res, next) {
    try {
      const posts = await this.postRepository.getAll();
      res.status(201).json({
        success: true,
        msg: "Posts fetched successfully",
        res: posts.res,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllposts(req, res, next) {
    try {
      console.log(req._id);
      const posts = await this.postRepository.getAllposts(req._id);
      if (posts.success) {
        res.status(201).json({
          success: true,
          msg: "Posts by user fetched successfully",
          res: posts.res,
        });
      } else {
        if (posts.error.msg) {
          throw new customErrorHandler(posts.error.statusCode, posts.error.msg);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      const id = req.params.id;
      console.log(id, req._id);
      const resp = await this.postRepository.deletePost(id, req._id);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Posts deleted successfully",
          res: resp.res,
          updatedUserposts: resp.updatedUserposts,
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

  async updatePost(req, res, next) {
    try {
      let formData = "";
      if (req.file) {
        formData = {
          caption: req.body.caption,
          imageURL:
            req.protocol +
            "://" +
            req.get("host") +
            "/images/" +
            req.file.filename,
          user: req._id,
        };
      } else {
        formData = {
          caption: req.body.caption,
          user: req._id,
        };
      }

      console.log(formData);
      const resp = await this.postRepository.updatePost(
        formData,
        req.params.id,
        req._id
      );
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Post updated successfully",
          updatedPost: resp.res,
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
