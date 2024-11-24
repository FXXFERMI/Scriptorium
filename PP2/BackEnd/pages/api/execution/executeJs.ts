import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
// import applyCors from '../../../utils/cors';



// THIS CODE IS INFLUECED BY CODE GENERATED FROM CHAT GPT PROMPS SUCH AS CHILD PROCESS LOGIC AND HOW TO CREATE TEMP FOLDERS

async function executeJavaScriptCode(code: string, stdinInput: string) {
  let fileName, filePath;
  const timestamp = Date.now();
  const folderPath = path.join(os.tmpdir(), `JSCode_${timestamp}`);

  fs.mkdirSync(folderPath, { recursive: true });

  // Define the JavaScript code filename
  fileName = 'program.js';
  filePath = path.join(folderPath, fileName);


  // Write the JavaScript code to a file
  fs.writeFileSync(filePath, code);

  const MAX_EXECUTION_TIME = 20000;

  return new Promise((resolve, reject) => {
    const command = `node ${filePath}`;

    // Execute the JavaScript file using Node.js
    const child =  exec(command, { timeout: MAX_EXECUTION_TIME }, (err, stdout, stderr) => {
      // Clean up the folder after execution
      fs.rmSync(folderPath, { recursive: true, force: true });

      if (err) {
        if (err.killed) {
          return resolve({
            error: 'Process timed out. Please optimize your code.',
            stdout,
            stderr
          });
        }
        return resolve({ error: stderr || err.message, stdout, stderr });
      }
      resolve({ stdout, stderr });
    });

    if (stdinInput) {
      child.stdin.write(stdinInput);
      child.stdin.end();
    }

    child.on('error', (err) => {
      console.error('Process error:', err);
      reject(new Error('Failed to execute code.'));
    });

  });
}

export default executeJavaScriptCode;
