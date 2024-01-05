const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../src/index.js");

describe("Notes API", () => {
  let authToken; // Store the authentication token for testing protected routes
  let noteId; // Store the ID of a note for testing

  beforeAll(async () => {
    // Perform user login to get an authentication token for protected routes

    const userCredentials = {
      username: "testuser",
      password: "testpassword",
    };
    const signupResponse = await request(app)
      .post("/api/auth/signup")
      .send(userCredentials);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(userCredentials);

    authToken = loginResponse.body.token;

    const newNote = {
      title: "Test Note",
      text: "This is a test note.",
    };
    const createNoteResponse = await request(app)
      .post("/api/notes")
      .set("authorization", `${authToken}`)
      .send(newNote);

    noteId = createNoteResponse.body.id;
  });

  it("should get all notes", async () => {
    const response = await request(app)
      .get("/api/notes")
      .set("authorization", `${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should get a specific note by ID", async () => {
    const response = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("authorization", `${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", noteId);
  });

  it("should create a new note", async () => {
    const newNote = {
      title: "New Test Note",
      text: "This is a new test note.",
    };

    const response = await request(app)
      .post("/api/notes")
      .set("authorization", `${authToken}`)
      .send(newNote);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("id");
  });

  it("should update a note", async () => {
    const existingnote = {
      title: "another Test Note",
      text: "This is another test note.",
    };

    const createresult = await request(app)
      .post("/api/notes")
      .set("authorization", `${authToken}`)
      .send(existingnote);
    const existingnoteid = createresult.body.id;
    const updatednote = {
      title: "Updated Test Note",
      text: "YU is a new test note.",
    };

    const response = await request(app)
      .put(`/api/notes/${existingnoteid}`)
      .set("authorization", `${authToken}`)
      .send(updatednote);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Successfully updated." });
  });

  it("should delete a note", async () => {
    const response = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set("authorization", `${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Successfully Deleted." });
  });
});

afterAll(async () => {
  // Close the Mongoose connection
  await mongoose.connection.close();

  // Close the Express server
  await server.close();
});
