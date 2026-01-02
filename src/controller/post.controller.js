import prisma from "../../prisma/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createPost = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const { title, contents } = req.body;

  console.log("userId : ", userId);

  const post = await prisma.post.create({
    data: {
      user_id: userId,
      title,
      contents,
    },
  });

  res.status(201).json({ message: "create post!" });
});

export const deletePost = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const postId = BigInt(req.params.postId);

  const post = await prisma.post.delete({
    where: {
      id: postId,
      user_id: userId,
    },
  });

  if (!post) {
    res.status(404).json({ message: "not exists post" });
  }

  res.status(201).json({ message: "delete ok!" });
});

export const updatePost = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const postId = BigInt(req.params.postId);
  const { title, contents } = req.body;

  const post = await prisma.post.update({
    where: {
      id: postId,
      user_id: userId,
    },
    data: {
      title,
      contents,
    },
  });

  if (!post) {
    res.status(404).json({ message: "not exists post" });
  }

  res.status(201).json({ message: "update ok!" });
});
