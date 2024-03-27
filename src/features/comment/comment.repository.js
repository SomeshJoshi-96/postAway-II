import mongoose from "mongoose";
import { commentSchema } from "./comment.schema.js";
import { UserModel } from "../user/user.repository.js";
import { PostModel } from "../post/post.repository.js";
// creating model from schema.
export const CommentModel = mongoose.model("Comment", commentSchema);

export default class CommentRepository {
  async addComment(commentData) {
    try {
      const postRequired = await PostModel.findById(commentData.post);
      if (!postRequired) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "No such post",
          },
        };
        return resp;
      }

      let newComment = new CommentModel(commentData);
      const comment = await newComment.save();
      const resp = {
        success: true,
        res: comment,
      };
      console.log(resp);
      const user = await UserModel.findById(commentData.user);
      user.comments.push(comment._id);
      await user.save();
      console.log(user);
      const post = await PostModel.findById(commentData.post);
      console.log(post);
      post.comments.push(comment._id);
      await post.save();
      console.log(post);
      return resp;
    } catch (err) {
      console.log(err);
      console.log(err.message);
      const resp = {
        success: false,
        error: {
          statusCode: 400,
          msg: err.message,
        },
      };
      return resp;
    }
  }

  async getComments(postId) {
    try {
      const post = await PostModel.findById(postId);
      console.log(post);
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
      let commentsArray = [];
      console.log(post.comments);
      for (let comment of post.comments) {
        let commentElement = await CommentModel.findById(comment);
        console.log(commentElement);
        commentsArray.push(commentElement);
      }

      const resp = {
        success: true,
        res: commentsArray,
      };
      return resp;
    } catch (err) {
      throw new Error();
    }
  }

  async updateComment(content, id, user) {
    try {
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
      } else {
        if (comment.user == user) {
          const updatedComment = await CommentModel.findByIdAndUpdate(
            id,
            content,
            { new: true, runValidators: true }
          );
          await updatedComment.save();
          console.log(updatedComment);
          const resp = {
            success: true,
            res: updatedComment,
          };
          return resp;
        } else {
          console.log("here");
          const resp = {
            success: false,
            error: {
              statusCode: 400,
              msg: "Comment by another user!",
            },
          };
          return resp;
        }
      }
    } catch (err) {
      throw new Error();
    }
  }

  async deleteComment(id, user) {
    try {
      console.log(id, user);
      const comment = await CommentModel.findById(id);
      console.log(comment);
      if (!comment) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "No such comment!",
          },
        };
        return resp;
      } else {
        if (comment.user == user) {
          const deletedComment = await CommentModel.findByIdAndDelete(id);
          console.log("deletedComment:", deletedComment);
          const requiredUser = await UserModel.findById(user);
          console.log(requiredUser);
          const index = requiredUser.comments.indexOf(id);
          requiredUser.comments.splice(index, 1);
          const updatedUser = await requiredUser.save();
          console.log(updatedUser);
          const requiredPost = await PostModel.findById(comment.post);
          console.log(requiredPost);
          const index1 = requiredPost.comments.indexOf(id);
          requiredPost.comments.splice(index1, 1);
          const updatedPost = await requiredPost.save();
          console.log(updatedPost);
          const resp = {
            success: true,
            res: deletedComment,
            updatedUsercomments: updatedUser.comments,
            updatedPostcomments: updatedUser.comments
          };
          return resp;
        } else {
          const resp = {
            success: false,
            error: {
              statusCode: 400,
              msg: "Comment by another user!",
            },
          };
          return resp;
        }
      }
    } catch (err) {
      throw new Error();
    }
  }
}
