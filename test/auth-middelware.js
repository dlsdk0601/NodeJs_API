import { expect } from "chai";
import jwt from "jsonwebtoken";
import sinon from "sinon";
import authMiddleware from "../middlewate/is-auth.js";

describe("Auth middleware", function () {
  it("should throw an error if no authorization header is present", function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw("Not authenticated.");
  });

  it("should throw an error if the authorization header is only one string", function () {
    const req = {
      get: function (headerName) {
        return "XYZ";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the token cannot be verified", function () {
    const req = {
      get: function (headerName) {
        return "Bearer XYZ";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield a userId after decoding the token", function () {
    const req = {
      get: function (headerName) {
        return "Bearer asdfasdfasdfasdfasdfasdfasdfasdfasdf";
      },
    };
    sinon.stub(jwt, "verify"); // 원본 함수에 메서드를 추가
    jwt.verify.returns({ userId: "abc" }); // verify에 returns 메소드를 추가해서, return이 저 값이 나오게
    // 이렇게 정의하면 다른 테스트가 오염 될수 있음. 때문에 sinon을 사용한다.
    // jwt.verify = function () {
    //   return { userId: "abc" };
    // };
    authMiddleware(req, {}, () => {}); // 이 미들웨어가 작동하면서 req안에 userId를 넣음
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true; // 해당 함수가 호출 됐었는지
    jwt.verify.restore(); // 원본함수를 복원
  });
});
