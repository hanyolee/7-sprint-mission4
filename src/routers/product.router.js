import express from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  createProductComment,
  deleteProductComment,
  updateProductComment,
} from "../controller/product.controller.js";
import { tokenVerify } from "../middleware/jwtVerify.js";

const router = express.Router();

router.post("/create", tokenVerify, createProduct);
router.delete("/:productId/delete", tokenVerify, deleteProduct);
router.patch("/:productId/update", tokenVerify, updateProduct);

router.post("/:productId/createComment", tokenVerify, createProductComment);
router.delete(
  "/:productId/:commentId/deleteComment",
  tokenVerify,
  deleteProductComment
);
router.patch(
  "/:productId/:commentId/updateComment",
  tokenVerify,
  updateProductComment
);

export default router;
