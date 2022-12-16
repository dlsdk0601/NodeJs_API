import { expect } from "chai";
import sinon from "sinon";
import User from "../models/user.js";
import AuthController from "../contorllers/auth.js";

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
});
