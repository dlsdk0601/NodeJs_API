import { expect } from "chai";
import sinon from "sinon";
import dotenv from "dotenv";
import mongoose, { mongo } from "mongoose";
import User from "../models/user.js";
import Post from "../models/post.js";
import FeedController from "../contorllers/feed.js";

dotenv.config();

describe("Feed Controller", function (done) {
  // 매 테스트를 진행할때마다 연결하고 유저 만들지 말고 before로 테스트 직전에 한번만 실행
  before((done) => {
    mongoose
      .connect(
        `mongodb+srv://dlsdk0601:${process.env.MONGODB_PASSWORD}@portfolio.dacwcma.mongodb.net/test-test-api`,
      )
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "Test",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });

        return user.save();
      })
      .then(() => {
        done();
      });
  });

  it("should add a created post to the posts of the creator", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        title: "Test Post",
        content: "A Test Post",
      },
      file: {
        path: "ABC",
      },
      userId: "XYZ",
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FeedController.createPost(req, res, () => {}).then((res) => {
      expect(res).to.have.property("posts");
      expect(res.posts).to.have.length(1);
      done();
    });

    User.findOne.restore();
  });

  // 모든 테스트가 완료되고 나서 실행
  after((done) => {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
