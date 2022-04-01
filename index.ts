import express from "express";
import pandoc from "./handlers/pandoc";
import latex from "./handlers/latex";
import fileUpload from "express-fileupload";

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(fileUpload());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/pandoc", pandoc);

app.post("/latex", latex);

// app.use(router);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
