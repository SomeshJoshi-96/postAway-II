import express from 'express';
import UserController from './user.controller.js';
import { auth } from '../middlewares/jwtAuth.js';

// 2. Initialize Express router.
const userRouter = express.Router();

const userController = new UserController();

// All the paths to controller methods.

userRouter.post('/signup', (req, res, next)=>{
    console.log("In Signup")
    userController.signUp(req, res, next)
});
userRouter.post('/signin', (req, res,next)=>{
    console.log("In Signin")
    userController.signIn(req, res, next)
});

userRouter.get('/logout', auth,(req, res,next)=>{
    console.log("In logout")
    userController.logOut(req, res, next)
});

userRouter.get('/logout-all-devices', auth,(req, res,next)=>{
    console.log("In logout All")
    userController.logOutfromAlldevices(req, res, next)
});

userRouter.get('/get-details/:id', auth,(req, res,next)=>{
    console.log("In Get Details")
    userController.getDetails(req, res, next)
});
// /get-all-details
userRouter.get('/get-all-details', auth,(req, res,next)=>{
    console.log("In Get All Details")
    userController.getAlldetails(req, res, next)
});
///update-details/651e54c19a3e7dfa69019d99
userRouter.put('/update-details/:id', auth,(req, res,next)=>{
    console.log("In Update Details")
    userController.updateDetails(req, res, next)
});

export default userRouter;
