import express from "express";
import {
  createPost,
  deletePost,
  updatePost,
  createPostComment,
  deletePostComment,
  updatePostComment,
} from "../controller/post.controller.js";
import { tokenVerify } from "../middleware/jwtVerify.js";

const router = express.Router();

router.post("/create", tokenVerify, createPost);
router.delete("/:postId/delete", tokenVerify, deletePost);
router.patch("/:postId/update", tokenVerify, updatePost);

router.post("/:postId/createComment", tokenVerify, createPostComment);
router.delete(
  "/:postId/:commentId/deleteComment",
  tokenVerify,
  deletePostComment
);
router.patch(
  "/:postId/:commentId/updateComment",
  tokenVerify,
  updatePostComment
);

export default router;
