import prisma from "../../prisma/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      price,
      user_id: Number(req.user.id),
    },
  });

  res.status(201).json({ message: "제품 추가 성공" });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = BigInt(req.params.productId);
  const userId = BigInt(req.user.id);

  const product = await prisma.product.delete({
    where: {
      id: productId,
      user_id: userId,
    },
  });

  res.status(201).json({ message: "제품 삭제 성공" });
});

export const patchProduct = asyncHandler(async (req, res) => {
  const productId = BigInt(req.params.productId);
  const userId = BigInt(req.user.id);
  const { name, price } = req.body;

  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name,
      price,
    },
  });

  if (!product) {
    res.status(404).json({ message: "상품 없음" });
  }
  if (product.user_id !== userId) {
    res.status(403).json({ message: "권한 없음" });
  }

  res.status(201).json({ message: "제품 수정 성공" });
});

export const likeProduct = asyncHandler(async (req, res) => {
  const productId = BigInt(req.params.productId);

  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      like: {
        increment: 1,
      },
    },
    select: {
      like: true,
    },
  });

  res.status(201).json({ message: "like +1" });
});
