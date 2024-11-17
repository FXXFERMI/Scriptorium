import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
// import applyCors from '../../../utils/cors';


// THIS CODE IS BASED ON CHAT GPT AND NOT OUR ORIGINAL THOUGHTS 

// THIS CODE IS INFLUECED BY CODE GENERATED FROM CHAT GPT PROMPS SUCH AS CHILD PROCESS LOGIC AND HOW TO CREATE TEMP FOLDERS

export async function executeCppCode(code: string, stdinInput: string) {
  let fileName, filePath;
  const timestamp = Date.now();
  const folderPath = path.join(os.tmpdir(), `CppCode_${timestamp}`);

  // Create a unique temporary folder
  fs.mkdirSync(folderPath, { recursive: true });

  // Define the C++ code filename
  fileName = 'program.cpp';
  filePath = path.join(folderPath, fileName);

  // Write the code to the C++ file
  fs.writeFileSync(filePath, code);

  const MAX_EXECUTION_TIME = 20000; 

  return new Promise((resolve, reject) => {
    const executablePath = path.join(folderPath, 'program');

    // Compile the C++ code using g++
    exec(`g++ ${filePath} -o ${executablePath}`, (compileErr, compileStdout, compileStderr) => {
      if (compileErr) {
        // Cleanup on compilation failure
        fs.rmSync(folderPath, { recursive: true, force: true });
        return resolve({ error: `Compilation Error: ${compileErr.message}`, stdout: compileStdout, stderr: compileStderr });
      }

      // Run the compiled binary
      const process= exec(
        executablePath,
        { timeout: MAX_EXECUTION_TIME },
        (runErr, stdout, stderr) => {
          // Clean up the folder after execution
          fs.rmSync(folderPath, { recursive: true, force: true });

          if (runErr) {
            if (runErr.killed) {
              return resolve({
                error: 'Process timed out. Please optimize your code.',
                stdout,
                stderr
              });
            }
            return resolve({ error: stderr || runErr.message, stdout, stderr });
          }

          resolve({ stdout, stderr });
        }
      );

      if (stdinInput) {
        process.stdin.write(stdinInput);
        process.stdin.end();
      }

      process.on('error', (err) => {
        console.error('Process error:', err);
        reject(new Error('Failed to execute code.'));
      });

    });
  });
}


export default  executeCppCode;