import { readFile, writeFile } from "fs/promises";
import renderTemplate from "./renderTemplate";

/**
 * A function to preprocess a texfile, wrapping it in a template and applying given functions.
 * @param fileName
 * @param templateId
 * @param preprocessor a function to preprocess the tex input (string)
 * @returns
 */
const preprocessTex = async (
  fileName: string,
  templateId: string,
  preprocessor?: (s: string) => string
): Promise<void> => {
  const content = (await readFile(fileName)).toString();
  let main = await renderTemplate(templateId, content, {});
  if (preprocessor) {
    main = preprocessor(main);
  }

  return writeFile(fileName, main);
};

export default preprocessTex;
