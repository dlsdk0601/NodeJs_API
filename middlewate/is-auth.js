import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isAuth = (req, res, next) => {
  let decodedToken;

  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const err = new Error("Not authenticated.");
    err.statusCode = 401;
    throw err;
  }

  const token = authHeader.split("Bearer ")[1]; // 띄어쓰기 떄문에 토큰 검사가 계속 실패로떴음!!

  try {
    const KEY = process.env.JSONWEBTOKEN_SECRET_KEY;
    decodedToken = jwt.verify(token, KEY);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const err = new Error("Not authenticated.");
    err.statusCode = 401;
    throw err;
  }

  req.userId = decodedToken.userId;
  next();
};

export default isAuth;
