import supertest from "supertest";
import app from "../app";
import { readFileSync } from "fs";

describe("Ping", () => {
  it("should respond hello to ping", async () => {
    await supertest(app)
      .get("/health")
      .expect(200)
      .then((res) => {
        expect(res.text).toBe("OK");
      });
  });
  it("Should return 404 for invalid route", async () => {
    await supertest(app).get("/unknown-route").expect(404);
  });
});

describe("Latex", () => {
  const content = readFileSync("examples/small2e.tex").toString();
  it("should compile demo file successfully", async () => {
    await supertest(app).post("/latex").send({ content }).expect(200);
  });
  it("should return pdf file", async () => {
    await supertest(app)
      .post("/latex")
      .send({ content })
      .then((response) => {
        const { headers } = response;
        expect(headers["content-type"]).toBe("application/pdf");
        expect(parseInt(headers["content-length"], 10)).toBeGreaterThan(50000);
      });
  });
  it("should return server error for invalid tex file", async () => {
    const corruptedContent = content.replace(/\\section/g, "\\fakeCommmand");
    await supertest(app)
      .post("/latex")
      .send({ content: corruptedContent })
      .expect(500);
  });
});

describe("Pandoc", () => {
  it("Should convert html to md", async () => {
    await supertest(app)
      .post("/pandoc")
      .field("outputFormat", "md")
      .attach("demo.html", "examples/demo.html")
      .expect(200);
  });
  it("Should return md content in body", async () => {
    await supertest(app)
      .post("/pandoc")
      .field("outputFormat", "md")
      .attach("demo.html", "examples/demo.html")
      .then((response) => {
        const { headers, text } = response;
        expect(headers["content-type"]).toMatch(/^text\/markdown/);
        expect(/\*\*test 1234\*\*/.test(text)).toBeTruthy();
      });
  });
});

describe("Html2pdf", () => {
  const content = readFileSync("examples/demo.html").toString();
  it("Should convert to tex and compile to pdf", async () => {
    await supertest(app).post("/html2pdf").send({ content }).expect(200);
  });
  it("Should convert to tex and compile to pdf", async () => {
    await supertest(app)
      .post("/html2pdf")
      .send({ content })
      .then(({ headers }) => {
        expect(headers["content-type"]).toBe("application/pdf");
        expect(parseInt(headers["content-length"], 10)).toBeGreaterThan(50000);
      });
  });
});
