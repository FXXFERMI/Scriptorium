import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
// import applyCors from '../../../utils/cors';



// THIS CODE IS INFLUECED BY CODE GENERATED FROM CHAT GPT PROMPS SUCH AS CHILD PROCESS LOGIC AND HOW TO CREATE TEMP FOLDERS

async function executeCCode(code,  stdinInput) {
  let fileName, filePath;
  const timestamp = Date.now();
  const folderPath = path.join(os.tmpdir(), `CCode_${timestamp}`);

  fs.mkdirSync(folderPath, { recursive: true });

  // Define the C code filename
  fileName = 'program.c';
  filePath = path.join(folderPath, fileName);

  // Write code to the C file
  fs.writeFileSync(filePath, code);

  const MAX_EXECUTION_TIME = 20000;

  return new Promise((resolve, reject) => {
    const executablePath = path.join(folderPath, 'program');

    // Compile the C code
    exec(`gcc ${filePath} -o ${executablePath}`, (compileErr) => {
      if (compileErr) {
        // Cleanup on compilation failure
        fs.rmSync(folderPath, { recursive: true, force: true });
        return resolve({error: `Compilation Error: ${compileErr.message}`});
      }

      // Run the compiled binary
      const child = exec(
        executablePath,
        { timeout: MAX_EXECUTION_TIME },
        (runErr, stdout, stderr) => {
          // Clean up the folder after execution
          fs.rmSync(folderPath, { recursive: true, force: true });

          if (runErr) {
            if (runErr.killed) {
              return resolve(
                {error: 'Process timed out. Please optimize your code.'}
              );
            }
            return resolve({error: stderr || runErr.message});
          }

          resolve(stdout);
        }
      );

      if (stdinInput) {
        child.stdin.write(stdinInput);
        child.stdin.end();
      }
  
      child.on('error', (err) => {
        console.error('Process error:', err);
        reject(new Error('Failed to execute code.'));
      });
  
    });
  });
}

export default executeCCode;

