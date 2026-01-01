import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const tokenVerify = asyncHandler(async (req, res, next) => {
  const accessToken = req.headers.accesstoken;

  if (!accessToken) {
    return res.status(401).json({ message: "not exists accessToken" });
  }

  const [bearer, token] = accessToken.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "not Bearer token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (e) {
    return res.status(401).json({
      message: "유효하지 않은 토큰입니다",
    });
  }
});
