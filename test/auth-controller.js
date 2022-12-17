import { expect } from "chai";
import sinon from "sinon";
import dotenv from "dotenv";
import mongoose, { mongo } from "mongoose";
import User from "../models/user.js";
import AuthController from "../contorllers/auth.js";

dotenv.config();

describe("Auth Controller - Login", function (done) {
  it("should throw an error if accessing the database fails", function () {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "tsssester@test.com",
        password: "tester",
      },
    };

    AuthController.login(req, {}, () => {}).then((res) => {
      expect(res).to.be.an("error");
      expect(res).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });

  it("sould send a response with a valid iser status for an existing user", (done) => {
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
        const req = { userId: "5c0f66b979af55031b34728a" };
        const res = {
          statusCode: 500,
          userStatus: null,
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          json: function (data) {
            this.userStatus = data.status;
          },
        };
        AuthController.getUserStatus(req, res, () => {}).then(() => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.userStatus).to.be.equal("I'm new!");
          User.deleteMany({})
            .then(() => {
              return mongoose.disconnect();
            })
            .then(() => {
              done();
            });
        });
      })
      .catch((err) => console.log(err));
  });
});
