import express from "express";
import {
  createUser,
  login,
  checkUserInfo,
  updateUserInfo,
  updateUserPassword,
} from "../controller/user.controller.js";
import { tokenVerify } from "../middleware/jwtVerify.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", login);
router.get("/getUserInfo", tokenVerify, checkUserInfo);
router.patch("/updateUserInfo", tokenVerify, updateUserInfo);
router.patch("/updateUserPassword", tokenVerify, updateUserPassword);

export default router;
