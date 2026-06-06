import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

import authenticateToken from "../middleware/authenticateToken.js";

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test("authenticateToken rejects missing bearer token", () => {
  const req = { headers: {} };
  const res = createResponse();
  let nextCalled = false;

  authenticateToken(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, "Access token required.");
});

test("authenticateToken accepts a valid admin token", () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "test-secret";

  const token = jwt.sign(
    { role: "admin", username: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = createResponse();
  let nextCalled = false;

  authenticateToken(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user.role, "admin");
  assert.equal(req.user.username, "admin");

  if (previousSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = previousSecret;
  }
});

test("authenticateToken rejects expired token", () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "test-secret";

  const token = jwt.sign(
    { role: "admin", username: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "-1s" }
  );

  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = createResponse();
  let nextCalled = false;

  authenticateToken(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.message, "Invalid or expired token.");

  if (previousSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = previousSecret;
  }
});
