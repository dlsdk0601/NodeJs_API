import express from "express";
import feedController from "../contorllers/feed.js";

const router = express.Router();

// /feed/posts
router.get("/posts", feedController.getPosts);

router.post("/post", feedController.createPost);

export default router;
