import express from "express";
import { getUserData, loginUser, registerUser, getAllUsers, addAdmin } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUserData)
userRouter.get('/all', protect, getAllUsers)
userRouter.post('/add-admin', protect, addAdmin)

export default userRouter;