import { validationResult } from "express-validator";

const getPosts = (req, res) => {
  return res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/dummy.png",
        creator: {
          name: "Ina",
        },
        createdAt: new Date(),
      },
    ],
  });
};

const createPost = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Validation fail", errors: errors.array() });
  }

  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: "Post created Successfully",
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: "ina" },
      createAt: new Date(),
    },
  });
};

export default {
  getPosts,
  createPost,
};
