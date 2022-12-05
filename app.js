import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import feedRouter from "./routes/feed.js";

const PORT = 8080;

dotenv.config();

const app = express();

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form 태그에 적합한 parser>
app.use(bodyParser.json()); // application/json 에 적합한 parser

//cors 라이브러리 사용하지 않고, cors 오류 설정
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

app.use("/feed", feedRouter);

mongoose
  .connect(
    `mongodb+srv://dlsdk0601:${process.env.MONGODB_PASSWORD}@portfolio.dacwcma.mongodb.net/test`,
  )
  .then(() => {
    app.listen(PORT, () => console.log("CONNECT::::::::::::::::::::::::::::::::"));
  })
  .catch((err) => {
    console.log(err);
  });
