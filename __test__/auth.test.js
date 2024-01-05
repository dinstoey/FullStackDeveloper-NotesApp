const request = require("supertest");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { app, server } = require("../src/index.js");
describe("Authentication API", () => {
  it("should sign up a new user", async () => {
    const newUser = {
      username: "testuser",
      password: "testpassword",
    };

    const response = await request(app).post("/api/auth/signup").send(newUser);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User registered successfully" });
  });

  it("should return a token on successful login", async () => {
    // Assuming you have a user created for testing in your database
    const existingUser = {
      username: "testuser",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(existingUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should reject login with incorrect credentials", async () => {
    const incorrectUser = {
      username: "testuser",
      password: "wrongpassword",
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(incorrectUser);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid username or password" });
  });
});

afterAll(async () => {
  // Close the Mongoose connection
  await mongoose.connection.close();

  // Close the Express server
  await server.close();
});

// describe("Authentication API", () => {
//   afterAll(async () => {
//     // Close the Mongoose connection
//     await mongoose.connection.close();

//     // Close the Express server
//     await server.close();
//   });

//   it("should sign up a new user", async () => {
//     const newUser = {
//       username: "testuser",
//       password: "testpassword",
//     };

//     const response = await request(app).post("/api/auth/signup").send(newUser);

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({ message: "User registered successfully" });
//   });

//   it("should reject login with incorrect credentials", async () => {
//     const incorrectUser = {
//       username: "testuser",
//       password: "wrongpassword",
//     };

//     const response = await request(app)
//       .post("/api/auth/login")
//       .send(incorrectUser);

//     expect(response.status).toBe(401);
//     expect(response.body).toEqual({ error: "Unauthorized" });
//   });

// });

// const request = require("supertest");
// const bcrypt = require("bcrypt");
// const mongoose = require("mongoose");
// const { app, server } = require("../index");

// afterAll(async () => {
//   // Close the Mongoose connection
//   await mongoose.connection.close();

//   // Close the Express server
//   await server.close();
// });
