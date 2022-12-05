const getPosts = (req, res) => {
  return res.status(200).json({
    posts: [
      {
        title: "First Post",
        content: "This is the first post!",
      },
    ],
  });
};

const createPost = (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: "Post created Successfully",
    post: { id: new Date().toISOString(), title, content },
  });
};

export default {
  getPosts,
  createPost,
};
