import { RequestHandler } from "express";
import { execAsync } from "./writers/exec";
import process from "process";
import { writeAndCompileLatex } from "./writers/latex";

const latex: RequestHandler = async (req, res) => {
  const { content } = req.body;
  if (!content || typeof content !== "string") {
    res.status(400);
    res.send({
      code: "RequiredField",
      message: "Cannot be empty",
      property: "content",
    });
  }

  writeAndCompileLatex(content)
    .then((pdfFile) => {
      res.sendFile(pdfFile, { root: `${process.cwd()}` }, (error) => {
        if (error) {
          console.error(error);
          res.status(500);
          res.send(`error sending pdf, ${error}`);
        }
        execAsync(`rm ${pdfFile}`); // cleanup
      });
    })
    .catch((error) => {
      res.status(500);
      res.send(`error compiling Latex, ${error}`);
    });
};

export default latex;
