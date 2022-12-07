import express from "express";
import { body } from "express-validator";
import User from "../models/user.js";
import authController from "../contorllers/auth.js";

const router = express.Router();

router.put(
  "/sign-up",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signUp,
);

router.post("/login", authController.login);

export default router;
