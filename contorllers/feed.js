import fs from "fs";
import path from "path";
import { validationResult } from "express-validator";
import PostModel from "../models/post.js";
import User from "../models/user.js";

const __dirname = path.resolve();

const PER_PAGE = 2;

const getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;

  try {
    const totalItems = await PostModel.find().countDocuments();
    const posts = await PostModel.find()
      .skip((currentPage - 1) * PER_PAGE)
      .limit(PER_PAGE);
    return res.status(200).json({
      posts,
      totalItems,
      message: "Success!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 401;
    }
    next(err);
  }
};

const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fail");
    error.statusCode = 422;

    // throw 해버리면 자동으로 함수를 멈추고 express에서 제공하는 다음 오류 처리 함수나 미들웨어로 향하려 한다.
    throw error;
  }

  if (!req.file) {
    const error = new Error("No Image provided.");
    error.statusCode = 422;
    throw error;
  }

  let creator;
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new PostModel({
    title,
    content,
    imageUrl,
    creator: req.userId,
  });

  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    const savedUser = await user.save();
    res.status(201).json({
      message: "Post created Successfully",
      post: post,
      creator: { _id: creator._id, name: creator.name },
    });
    return savedUser;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
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

const updatePost = (req, res, next) => {
  const postId = req.params.postId;

  const err = validationResult(req);
  if (!err.isEmpty()) {
    const error = new Error("Validation failed, entered datat is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const {
    body: { title, content },
  } = req;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error("no file picked");
    error.statusCode = 422;
    throw error;
  }

  PostModel.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Could not find post.");
        err.statusCode = 404;
        throw err;
      }

      // 권한 있는 유저 아니면 편집 못하게
      if (post.creator.toString() !== req.userId) {
        const err = new Error("Not authorized!");
        err.statusCode = 403;
        throw err;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;

      return post.save();
    })
    .then((result) => {
      return res.status(200).json({ message: "Post updated!", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const deletePost = (req, res, next) => {
  const postId = req.params.postId;
  PostModel.findById(postId)
    .then((post) => {
      // check logged user 현재 로그인 구현 아직

      if (!post) {
        const err = new Error("Could not find post.");
        err.statusCode = 404;
        throw err;
      }

      // 권한 있는 유저 아니면 편집 못하게
      if (post.creator.toString() !== req.userId) {
        const err = new Error("Not authorized!");
        err.statusCode = 403;
        throw err;
      }

      clearImage(post.imageUrl);

      // 처음부터 findByIdAndRemove 를 사용하지 않은 이유는
      // 해당 post가 있는지 확인부터 하기 위해 findById를 사용하고
      // 해당 post가 있으면 remove 하는 로직 사용
      return PostModel.findByIdAndRemove(postId);
    })
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId); // pull은 mongoose에서 제공하는 내장 method push의 반대
      return user.save();
    })
    .then(() => {
      return res.status(200).json({ message: "Deleted post." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//이미지 지우는 함수
const clearImage = (filepath) => {
  filepath = path.join(__dirname, filepath); // /images안에 사진 파일 경로
  // __dirname 현재 root 경로, filepath 로 join

  fs.unlink(filepath, (err) => console.log(err)); // 삭제
};

export default {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
};
