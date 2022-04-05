import { RequestHandler } from "express";
import shortid from "shortid";
import { writeFile } from "fs/promises";
import { readFileSync } from "fs";
import { runPandoc } from "./writers/pandoc";
import preprocessTex from "./preprocessors/preprocessTex";
import { compileLatex } from "./writers/latex";
import process from "process";
import { execAsync } from "./writers/exec";

const htmlToPdf: RequestHandler = async (req, res) => {
  const { content: htmlContent } = req.body;
  if (!htmlContent || typeof htmlContent !== "string") {
    res.status(400);
    res.send({
      code: "RequiredField",
      message: "Cannot be empty",
      property: "content",
    });
  }
  // write html file
  const fileName = `main-${shortid.generate()}`;
  await writeFile(`${fileName}.html`, htmlContent);
  // convert to tex
  await runPandoc(`${fileName}.html`, `${fileName}.tex`);
  // preprocess
  await preprocessTex(`${fileName}.tex`, "basic");
  // compile and return
  compileLatex(fileName)
    .then((pdfFile) => {
      res.sendFile(pdfFile, { root: process.cwd() }, (error) => {
        if (error) {
          console.error(error);
          res.status(500);
          res.send(`Error sending pdf ${error}`);
        }
        execAsync(`rm ${fileName}*`);
      });
    })
    .catch((error) => {
      console.error(`Error compiling latex`, error);
      res.status(500);
      res.send({
        message: `Error compiling latex, ${error}`,
        file: readFileSync(`${fileName}.tex`).toString(),
      });
      execAsync(`rm ${fileName}*`);
    });
};

export default htmlToPdf;
