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

  const pdfFile = await writeAndCompileLatex(content);

  res.sendFile(pdfFile, { root: process.cwd() });
  execAsync(`rm ${pdfFile}`); // cleanup
};

export default latex;
