import express from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import feedRouter from "./routes/feed.js";

const PORT = 8080;

dotenv.config();

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // null 자리는 error 파라미터, /images 폴더를 바라본다.
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + `-${file.originalname}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const __dirname = path.resolve();

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form 태그에 적합한 parser>
app.use(bodyParser.json()); // application/json 에 적합한 parser

// single("image") 는 들어오는 요청의 image 필드에 저장된 단일 파일을 추출
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

app.use("/images", express.static(path.join(__dirname, "images"))); // path.join이 images폴더의 절대 경로를 구성해주며, 접근 가능하게 함
//cors 라이브러리 사용하지 않고, cors 오류 설정
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//
//   next();
// });

app.use(
  cors({
    origin: "*",
  }),
);

app.use("/feed", feedRouter);

app.use((err, req, res) => {
  console.log(err);
  const status = err.statusCode ?? 500;
  const message = err.message;

  return res.status(status).json({ message });
});
// route 컨트롤러에서 err가 발생하면 throw 했기 때문에 다음 미들웨어인 여기로 온다.
// 그래서 route 미들웨어 밑에 작업해야함

mongoose
  .connect(
    `mongodb+srv://dlsdk0601:${process.env.MONGODB_PASSWORD}@portfolio.dacwcma.mongodb.net/test-api`,
  )
  .then(() => {
    app.listen(PORT, () => console.log("CONNECT::::::::::::::::::::::::::::::::"));
  })
  .catch((err) => {
    console.log(err);
  });
