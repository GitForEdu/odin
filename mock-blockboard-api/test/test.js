import app from "../src/server.js"
import request from "supertest"

describe("GET /", function() {
  it("respond with hello world", function(done) {
    request(app).get("/").expect("Hello World", done)
  })
})