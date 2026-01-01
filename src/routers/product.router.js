import express from "express";
import {
  createProduct,
  deleteProduct,
  patchProduct,
} from "../controller/product.controller.js";
import { tokenVerify } from "../middleware/jwtVerify.js";

const router = express.Router();

router.post("/create", tokenVerify, createProduct);
router.delete("/:productId/delete", tokenVerify, deleteProduct);
router.patch("/:productId/update", tokenVerify, patchProduct);

export default router;
