import mongoose from "mongoose";
import { UserModel } from "../user/user.repository.js";

export default class FriendRepository {
  async getFriends(userId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "No such user exist!",
          },
        };
        return resp;
      }
      const resp = {
        success: true,
        res: user.friends,
      };
      return resp;
    } catch (err) {
      throw new Error();
    }
  }
  async getPendingrequests(userId) {
    try {
      const user = await UserModel.findById(userId);
      const resp = {
        success: true,
        res: user.pendingfriendRequests,
      };
      return resp;
    } catch (err) {
      throw new Error();
    }
  }

  async toggleFriendship(userId, friendId) {
    try {
      let userFriend = await UserModel.findById(friendId);
      if (!userFriend) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "No such user exist!",
          },
        };
        return resp;
      }
      let user = await UserModel.findById(userId);
      const selectedUserDetails = {
        _id: user._id,
        name: user.name,
        email: user.email,
        friends: user.friends,
      };
      const selectedUserfriendDetails = {
        _id: userFriend._id,
        name: userFriend.name,
        email: userFriend.email,
        friends: userFriend.friends,
      };
      const alreadyIndex = user.pendingfriendRequests.findIndex((requestId) =>
        requestId.equals(friendId)
      );
      if (alreadyIndex >= 0) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "Friend request of request user already exixts!",
          },
        };
        return resp;
      }

      for (let friend of user.friends) {
        //if already friend
        if (friend == friendId) {
          const index = user.friends.findIndex((requestId) =>
            requestId.equals(friendId)
          );
          user.friends.splice(index, 1);
          user = await user.save();
          const index1 = userFriend.friends.findIndex((requestId) =>
            requestId.equals(userId)
          );
          userFriend.friends.splice(index1, 1);
          userFriend = await userFriend.save();
          const resp = {
            success: true,
            res1: selectedUserDetails,
            res2: selectedUserfriendDetails,
            toggleAction: "deleted friend",
          };

          return resp;
        }
      }
      //if friend request already sent
      for (let friendRequest of user.sentfriendRequests) {
        if (friendRequest == friendId) {
          const resp = {
            success: false,
            error: {
              statusCode: 400,
              msg: "Friend request already sent!",
            },
          };
          return resp;
        }
      }
      userFriend.pendingfriendRequests.push(userId);
      userFriend = await userFriend.save();
      user.sentfriendRequests.push(friendId);
      await user.save();
      const resp = {
        success: true,
        res1: selectedUserDetails,
        res2: selectedUserfriendDetails,
        toggleAction: "friend request sent",
      };

      return resp;
    } catch (err) {
      throw new Error();
    }
  }

  async responseTorequest(userId, friendId, response) {
    try {
      let userFriend = await UserModel.findById(friendId);
      if (!userFriend) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "No such user exist!",
          },
        };
        return resp;
      }

      let user = await UserModel.findById(userId);
      for (let pendingRequest of user.pendingfriendRequests) {
        if (pendingRequest == friendId) {
          if (response == "accept") {
            console.log("here");
            const index = user.pendingfriendRequests.findIndex((requestId) =>
              requestId.equals(friendId)
            );
            console.log(index);
            user.pendingfriendRequests.splice(index, 1);
            user.friends.push(friendId);
            const index1 = userFriend.sentfriendRequests.findIndex(
              (requestId) => requestId.equals(userId)
            );
            userFriend.sentfriendRequests.splice(index1, 1);
            userFriend.friends.push(userId);
            user = await user.save();
            userFriend = await userFriend.save();
            const selectedUserDetails = {
              _id: user._id,
              name: user.name,
              email: user.email,
              friends: user.friends,
            };
            const selectedUserfriendDetails = {
              _id: userFriend._id,
              name: userFriend.name,
              email: userFriend.email,
              friends: userFriend.friends,
            };
            const resp = {
              success: true,
              res1: selectedUserDetails,
              res2: selectedUserfriendDetails,
              action: "Friend Request accepted!",
            };

            return resp;
          } else {
            const index = user.pendingfriendRequests.findIndex((requestId) =>
              requestId.equals(friendId)
            );
            user.pendingfriendRequests.splice(index, 1);
            const index1 = userFriend.sentfriendRequests.findIndex(
              (requestId) => requestId.equals(userId)
            );
            userFriend.sentfriendRequests.splice(index1, 1);
            user = await user.save();
            userFriend = await userFriend.save();
            const selectedUserDetails = {
              _id: user._id,
              name: user.name,
              email: user.email,
              friends: user.friends,
            };
            const selectedUserfriendDetails = {
              _id: userFriend._id,
              name: userFriend.name,
              email: userFriend.email,
              friends: userFriend.friends,
            };
            const resp = {
              success: true,
              res1: selectedUserDetails,
              res2: selectedUserfriendDetails,
              action: "Friend Request rejected!",
            };

            return resp;
          }
        }
      }

      const resp = {
        success: false,
        error: {
          statusCode: 400,
          msg: "No such pending friend request exists!",
        },
      };
      return resp;
    } catch (err) {
      throw new Error();
    }
  }
}
