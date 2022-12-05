import express from "express";
import feedRouter from "./routes/feed.js"

const PORT = 8080;

const app = express();

app.use("/feed", feedRouter);

app.listen(PORT, () => console.log("CONNECT::::::::::::::::::::::::::::::::"));