import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import process from "process";
import { runPandoc } from "./writers/pandoc";
import { execAsync } from "./writers/exec";
import shortid from "shortid";

const pandoc: RequestHandler = async (req, res) => {
  const { outputFormat } = req.body;
  if (!outputFormat) {
    res.status(400);
    res.send({
      code: "RequiredField",
      message: "Cannot be empty",
      property: "outputFormat",
    });
  } else if (!req.files || Object.keys(req.files).length !== 1) {
    res.status(400);
    res.send("One file must be provided to run pandoc");
  } else {
    const k = Object.keys(req.files)[0];
    const file = req.files[k] as UploadedFile;

    const inputFormat = file.name.split(".").pop();
    const fileName = `main-${shortid.generate()}`;
    const inputFile = `${fileName}.${inputFormat}`;
    await file.mv(`./${inputFile}`);
    const outputFile = `${fileName}.${outputFormat}`;

    runPandoc(inputFile, outputFile)
      .then(({ stdout, stderr }) => {
        console.log(stdout);
        res.sendFile(outputFile, { root: process.cwd() });
      })
      .catch((error) => {
        console.error("Error running pandoc", error);
        res.status(500);
        res.send(error);
      })
      .finally(() => execAsync(`rm ${fileName}*`));
  }
};

export default pandoc;
