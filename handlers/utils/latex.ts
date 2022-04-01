import { writeFile } from "fs/promises";
import { execAsync } from "./exec";
import shortid from "shortid";

export const compileLatex = async (
  content: string,
  runs = 2
): Promise<string> => {
  const uid = shortid.generate();
  const fileName = `main-${uid}`;
  const texFile = `${fileName}.tex`;
  await writeFile(texFile, content);
  // running pdflatex at least twice is necessary to build table of contents
  for (let i = 1; i <= runs; i++) {
    console.log(`Compiling ${texFile}, run ${i}/${runs}`);
    await execAsync(`pdflatex ${texFile}`);
  }
  // cleanup
  await execAsync(
    `rm ${fileName}.t* ${fileName}.log ${fileName}.aux ${fileName}.out`
  );
  return `${fileName}.pdf`;
};
