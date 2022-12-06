import { validationResult } from "express-validator";
import PostModel from "../models/post.js";

const getPosts = (req, res, next) => {
  PostModel.find()
    .then((posts) => {
      return res.status(200).json({
        posts,
        message: "Success!",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fail");
    error.statusCode = 422;

    // throw 해버리면 자동으로 함수를 멈추고 express에서 제공하는 다음 오류 처리 함수나 미들웨어로 향하려 한다.
    throw error;
  }
  console.log(req.file);
  if (!req.file) {
    const error = new Error("No Image provided.");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new PostModel({
    title,
    content,
    imageUrl,
    creator: { name: "ina" },
  });

  post
    .save()
    .then((result) => {
      return res.status(201).json({
        message: "Post created Successfully",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const getPost = (req, res, next) => {
  const postId = req.params.postId;

  PostModel.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 400;
        throw error;
      }

      return res.status(200).json({ message: "Post fetched", post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export default {
  getPosts,
  createPost,
  getPost,
};
