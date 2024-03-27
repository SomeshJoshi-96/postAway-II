import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import { UserModel } from "../user/user.repository.js";
// creating model from schema.
export const PostModel = mongoose.model("Post", postSchema);

export default class PostRepository {
  async addPost(postData) {
    console.log(postData);
    try {
      // create instance of model.
      let newPost = new PostModel(postData);
      newPost = await newPost.save();
      const resp = {
        success: true,
        res: newPost,
      };
      const user = await UserModel.findById(postData.user);
      user.posts.push(newPost._id);
      await user.save();
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

  async getOnePost(postID) {
    console.log(postID);
    try {
      // create instance of model.
      let post = await PostModel.findById(postID);
      if (post) {
        const resp = {
          success: true,
          res: post,
        };
        return resp;
      } else {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "No such post!",
          },
        };
        return resp;
      }
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  }

  async getAll() {
    try {
      const posts = await PostModel.find();
      console.log(posts);
      const resp = {
        success: true,
        res: posts,
      };
      return resp;
    } catch (err) {
      throw new Error();
    }
  }

  async getAllposts(user) {
    try {
      console.log(user);
      const posts = await PostModel.find({ user: user });
      console.log(posts);
      if (posts) {
        const resp = {
          success: true,
          res: posts,
        };
        return resp;
      } else {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "No post by you!",
          },
        };
        return resp;
      }
    } catch (err) {
      throw new Error();
    }
  }

  async deletePost(id, user) {
    try {
      console.log(id, user);
      const post = await PostModel.findById(id);
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
      } else {
        if (post.user == user) {
          const deletedPost = await PostModel.findByIdAndDelete(id);
          console.log("deletedPost:", deletedPost);
          console.log(user);
          const requiredUser = await UserModel.findById(user);
          console.log(requiredUser);
          const index = requiredUser.posts.indexOf(id);
          requiredUser.posts.splice(index, 1);
          const updatedUser = await requiredUser.save();
          console.log(updatedUser);
          const resp = {
            success: true,
            res: deletedPost,
            updatedUserposts: updatedUser.posts,
          };
          return resp;
        } else {
          const resp = {
            success: false,
            error: {
              statusCode: 400,
              msg: "Post by another user!",
            },
          };
          return resp;
        }
      }
    } catch (err) {
      throw new Error();
    }
  }

  async updatePost(postData, id, user) {
    try {
      console.log(postData, id, user);
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
      } else {
        if (post.user == user) {
          const updatedPost = await PostModel.findByIdAndUpdate(
            id,
            postData,
            { new: true, runValidators: true }
          );
          await updatedPost.save();
          console.log(updatedPost);
          const resp = {
            success: true,
            res: updatedPost,
          };
          return resp;
        } else {
          const resp = {
            success: false,
            error: {
              statusCode: 400,
              msg: "Post by another user!",
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
