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
