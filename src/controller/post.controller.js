import prisma from "../../prisma/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

// model Post {
//   id          BigInt    @id @default(autoincrement())
//   title       String
//   contents    String
//   like        Int?

//   comment     Comment[]

//   user_id     BigInt
//   user        User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
// }

export const createPost = asyncHandler(async (req, res) => {
  const { title, contents } = req.body;
  const userId = BigInt(req.user.id);

  const post = await prisma.post.create({
    data: {
      id: userId,
      title,
      contents,
    },
  });

  res.status(201).json({ message: "create post!" });
});

export const deletePost = asyncHandler(async (req, res) => {
  const postId = BigInt(req.params.postId);
});

export const updatePost = asyncHandler(async (req, res) => {});
