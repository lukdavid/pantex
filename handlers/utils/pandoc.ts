import { execAsync } from "./exec";

export const runPandoc = async (inputPath: string, outputPath: string) => {
  console.log(`Converting ${inputPath} to ${outputPath}`);
  return execAsync(`pandoc ${inputPath} -o ${outputPath}`);
};
