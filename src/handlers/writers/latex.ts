import { writeFile } from "fs/promises";
import { execAsync } from "./exec";
import { execSync } from "child_process";
import shortid from "shortid";

const cleanup = async (fileName: string) => {
  // cleanup : delete all build files except pdf
  execAsync(
    `find . -name "${fileName}*" ! -name "${fileName}.pdf" -maxdepth 1 -delete`
  );
};

export const compileLatex = async (
  fileName: string,
  runs = 2
): Promise<string> => {
  const texFile = `${fileName}.tex`;
  // running pdflatex at least twice is necessary to build table of contents
  try {
    for (let i = 1; i <= runs; i++) {
      console.log(`Compiling ${texFile}, run ${i}/${runs}`);
      execSync(`pdflatex ${texFile}`); // running asynchroneously doesn't throw on compile errors ...
    }
  } catch (error) {
    cleanup(fileName);
    throw error;
  }
  cleanup(fileName);
  return `${fileName}.pdf`;
};

export const writeAndCompileLatex = async (
  content: string,
  runs = 2
): Promise<string> => {
  const uid = shortid.generate();
  const fileName = `main-${uid}`;
  const texFile = `${fileName}.tex`;
  await writeFile(texFile, content);
  return compileLatex(fileName, runs);
};
