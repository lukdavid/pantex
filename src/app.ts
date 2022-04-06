import express from "express";
import pandoc from "./handlers/pandoc";
import latex from "./handlers/latex";
import htmlToPdf from "./handlers/htmlToPdf";
import fileUpload from "express-fileupload";

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(fileUpload());

app.get("/ping", (req, res) => {
  res.send("Hello World!");
});

app.post("/pandoc", pandoc);

app.post("/latex", latex);

app.post("/html2pdf", htmlToPdf);

export default app;
