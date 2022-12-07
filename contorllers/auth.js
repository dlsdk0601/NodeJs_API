import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

const signUp = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = new Error("Validation failed.");
    err.statusCode = 422;
    err.data = error.array();
    throw err;
  }

  const {
    body: { email, name, password },
  } = req;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email,
        password: hashedPw,
        name,
      });

      return user.save();
    })
    .then((result) => {
      return res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const {
    body: { email, password },
  } = req;

  let loadedUser;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const err = new Error("A user with this email could not be found.");
        err.statusCode = 401;
        throw err;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const err = new Error("Wrong password!");
        err.statusCode = 401;
        throw err;
      }

      // sign 내부 method로 토큰을 생성하는데, 첫번쨰 파라미터에는 토큰에 포함할 데이터,
      // 두번째 파라미터에는 가입에 사용된 비공개 키
      // 세번째 파라미터는 유효기간을 적는다.
      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser._id.toString() },
        process.env.JSONWEBTOKEN_SECRET_KEY,
        { expiresIn: "1h" },
      );

      return res.status(200).json({ token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export default {
  signUp,
  login,
};
