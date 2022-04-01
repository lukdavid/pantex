import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import { WORK_DIR } from "../const";
import process from "process";
import { runPandoc } from "./utils/pandoc";

const pandoc: RequestHandler = (req, res) => {
  const { outputFormat } = req.body;
  if (!outputFormat) {
    res.status(400);
    res.send("Must specify outputFormat (file extension) eg docx, html, md");
  }
  if (!req.files || Object.keys(req.files).length !== 1) {
    res.status(400);
    res.send("One file must be provided to run pandoc");
  } else {
    const k = Object.keys(req.files)[0];
    const file = req.files[k] as UploadedFile;

    const inputPath = `${WORK_DIR}/${file.name}`;
    const outputPath = `${WORK_DIR}/${file.name.replace(/\.md$/, ".docx")}`;
    file.mv(inputPath);
    console.log(`converting ${inputPath} to ${outputPath}`);

    runPandoc(inputPath, outputPath)
      .then(({ stdout, stderr }) => {
        console.log(stdout);
        res.sendFile(outputPath, { root: process.cwd() });
      })
      .catch((error) => {
        console.error("Error running pandoc", error);
        res.status(500);
        res.send(error);
      });
  }
};

export default pandoc;
