import { RequestHandler } from "express";
import { execAsync } from "./utils/exec";
import process from "process";
import { compileLatex } from "./utils/latex";

const latex: RequestHandler = async (req, res) => {
  const { content } = req.body;
  if (!content || typeof content !== "string") {
    res.status(400);
    res.send();
  }

  const pdfFile = await compileLatex(content);

  res.sendFile(pdfFile, { root: process.cwd() });
  execAsync(`rm ${pdfFile}`); // cleanup
};

export default latex;
