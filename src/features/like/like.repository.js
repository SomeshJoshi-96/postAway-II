import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { PostModel } from "../post/post.repository.js";
import { CommentModel } from "../comment/comment.repository.js";
const LikeModel = mongoose.model("Like", likeSchema);

export class LikeRepository {
  async getLikes(id) {
    try {
      const likes = await LikeModel.find({ likeable: id });
      if (likes.length == 0) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "No likes!",
          },
        };
        return resp;
      }
      const resp = {
        success: true,
        res: likes,
      };
      return resp;
    } catch (err) {
      throw new Error();
    }
  }

  async toggleLike(userId, id, on_model) {
    try {
      if (on_model == "Post") {
        const post = await PostModel.findById(id);
        if (!post) {
          const resp = {
            success: false,
            error: {
              statusCode: 400,
              msg: "No such post!",
            },
          };
          return resp;
        }
      }
      if (on_model == "Comment") {
        const comment = await CommentModel.findById(id);
        if (!comment) {
          const resp = {
            success: false,
            error: {
              statusCode: 400,
              msg: "No such comment!",
            },
          };
          return resp;
        }
      }
      const deletedLike = await LikeModel.findOneAndDelete({
        user: userId,
        likeable: id,
        on_model: on_model,
      }).populate([
        { path: "user", select: "id email name gender" },
        { path: "likeable", model: on_model },
      ]);
      if (deletedLike) {
        const resp = {
          success: true,
          res: deletedLike,
          likeStatus: "unliked",
        };
        return resp;
      }
      const newLike = new LikeModel({
        user: userId,
        likeable: id,
        on_model: on_model,
      });

      await newLike.populate([
        { path: "user", select: "id email name gender" },
        { path: "likeable", model: on_model },
      ]);

      // Now, save the newLike instance
      await newLike.save();
      const resp = {
        success: true,
        res: newLike,
        likeStatus: "liked",
      };
      return resp;
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }
}
