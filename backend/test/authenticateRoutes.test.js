import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { loginAdmin } from "../router/authenticateRoutes.js";

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

function restoreEnv(previousEnv) {
  for (const [key, value] of Object.entries(previousEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

async function withAuthEnv(callback) {
  const previousEnv = {
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
    JWT_SECRET: process.env.JWT_SECRET,
  };

  process.env.ADMIN_USERNAME = "admin";
  process.env.ADMIN_PASSWORD_HASH = await bcrypt.hash("correct-password", 12);
  process.env.JWT_SECRET = "test-secret";

  try {
    await callback();
  } finally {
    restoreEnv(previousEnv);
  }
}

test("loginAdmin rejects missing credentials", async () => {
  await withAuthEnv(async () => {
    const req = { body: { username: "", password: "" } };
    const res = createResponse();

    await loginAdmin(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "Username and password are required.");
  });
});

test("loginAdmin rejects invalid username", async () => {
  await withAuthEnv(async () => {
    const req = { body: { username: "wrong", password: "correct-password" } };
    const res = createResponse();

    await loginAdmin(req, res);

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, "Invalid username or password");
  });
});

test("loginAdmin rejects invalid password", async () => {
  await withAuthEnv(async () => {
    const req = { body: { username: "admin", password: "wrong-password" } };
    const res = createResponse();

    await loginAdmin(req, res);

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, "Invalid username or password");
  });
});

test("loginAdmin returns signed admin token for valid credentials", async () => {
  await withAuthEnv(async () => {
    const req = { body: { username: "admin", password: "correct-password" } };
    const res = createResponse();

    await loginAdmin(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.message, "Login successful");
    assert.equal(typeof res.body.token, "string");

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);

    assert.equal(decoded.role, "admin");
    assert.equal(decoded.username, "admin");
  });
});
