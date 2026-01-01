import express from "express";
import {
  createPost,
  deletePost,
  updatePost,
} from "../controller/post.controller";
import { tokenVerify } from "../middleware/jwtVerify.js";

const router = express.Router();

router.post("/create", tokenVerify, createPost);
router.delete("/:postId/delete", tokenVerify, deletePost);
router.patch("/:postId/update", tokenVerify, updatePost);

export default router;
