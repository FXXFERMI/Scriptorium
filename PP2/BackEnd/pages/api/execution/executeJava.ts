import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
// import applyCors from '../../../utils/cors';

// THIS CODE IS INFLUECED BY CODE GENERATED FROM CHAT GPT PROMPS SUCH AS CHILD PROCESS LOGIC AND HOW TO CREATE TEMP FOLDERS

async function executeJavaCode(code: string, stdinInput: string) {
  const timestamp = Date.now();
  const folderPath = path.join(os.tmpdir(), `JavaCode_${timestamp}`);
  fs.mkdirSync(folderPath, { recursive: true });

  const classNameMatch = code.match(/public class (\w+)/);
  const className = classNameMatch ? classNameMatch[1] : 'Main'; 

  const filePath = path.join(folderPath, `${className}.java`);
  fs.writeFileSync(filePath, code);

  const MAX_EXECUTION_TIME = 20000;

  return new Promise((resolve, reject) => {
    const command = `javac ${filePath} && java -cp ${folderPath} ${className}`;

    const child = exec(command, { timeout: MAX_EXECUTION_TIME }, (err, stdout, stderr) => {
      fs.rmSync(folderPath, { recursive: true, force: true });

      if (err) {
        if (err.killed) {
          return resolve({error: 'Process timed out. Please optimize your code.'});
        }
        return resolve({error: stderr || err.message});
      }

      resolve(stdout);
    });

    if (stdinInput) {
      child.stdin.write(stdinInput);
      child.stdin.end();
    }
  });
}

export default executeJavaCode;
