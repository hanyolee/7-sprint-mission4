import prisma from "../../prisma/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashedPassword = (password) => {
  const saltRounds = 10;

  return bcrypt.hashSync(password, saltRounds);
};

export const createUser = asyncHandler(async (req, res) => {
  const { email, password, nickname } = req.body;

  const getUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nickname }],
    },
    select: { email: true, nickname: true },
  });
  console.log(getUser);

  if (getUser) {
    if (getUser.email) {
      return res.status(404).json({ message: "invalid email" });
    }
    if (getUser.nickname) {
      return res.status(404).json({ message: "invalid nickname" });
    }
  }

  const setUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword(password),
      nickname,
    },
  });

  res.status(201).json({ ...setUser, id: Number(setUser.id) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const getUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!getUser) {
    return res.status(404).json({ message: "not exists email" });
  }

  const matchPassword = await bcrypt.compare(password, getUser.password);

  if (!matchPassword) {
    return res.status(404).json({ message: "invalid password" });
  }

  const payload = {
    id: Number(getUser.id),
    role: "user",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(201).json({ message: "login success", accessToken: token });
});

export const checkUserInfo = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);

  const getUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      nickname: true,
      email: true,
      image: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!getUser) {
    res.status(404).json({ message: "not exists user" });
  }

  res.status(201).json(getUser);
});

export const updateUserInfo = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const { nickname, email, image } = req.body;

  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      nickname,
      email,
      image,
    },
    select: {
      nickname: true,
      email: true,
      image: true,
      created_at: true,
      updated_at: true,
    },
  });

  res.status(201).json(updateUser);
});

export const updateUserPassword = asyncHandler(async (req, res) => {
  const userId = BigInt(req.user.id);
  const { newPassword } = req.body;

  const currentPassword = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      password: true,
    },
  });

  const isMatch = bcrypt.compare(currentPassword, newPassword);
  if (!isMatch) {
    return res
      .status(400)
      .json({ error: "현재 비밀번호가 일치하지 않습니다." });
  }
  if (currentPassword === newPassword) {
    return res
      .status(400)
      .json({ error: "새 비밀번호는 이전과 다르게 설정해야 합니다." });
  }

  const hashedNewPassword = hashedPassword(newPassword);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedNewPassword,
    },
  });

  res.status(201).json({ message: "비밀번호가 변경되었습니다." });
});
