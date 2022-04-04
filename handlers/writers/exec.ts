import { exec } from "child_process";
import { promisify } from "util";

export const execAsync = promisify(exec);

export function execPromise(command: string) {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(stdout.trim());
    });
  });
}
