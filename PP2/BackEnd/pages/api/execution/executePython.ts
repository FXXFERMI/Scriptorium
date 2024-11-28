import { exec } from 'child_process'; 
import fs from 'fs';
import path from 'path';
import os from 'os';
// import applyCors from '../../../utils/cors';


// THIS CODE IS INFLUENCED BY CODE GENERATED FROM CHAT GPT PROMPTS SUCH AS CHILD PROCESS LOGIC AND HOW TO CREATE TEMP FOLDERS
// AND CHECKING INSTALLATION OF PYTHON

async function checkPythonInstalled() {
  return new Promise((resolve, reject) => {
    exec('python --version', (error) => {
      if (error) {
        exec('python3 --version', (error) => {
          if (error) {
            return reject(new Error('Python is not installed on this system.'));
          }
          resolve('python3');
        });
      } else {
        resolve('python');
      }
    });
  });
}

async function executePythonCode(code: string, stdinInput: string) {
  const timestamp = Date.now();

  // Create a unique temporary folder for the Python execution
  const tempDir = path.join(os.tmpdir(), `python_${timestamp}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const filePath = path.join(tempDir, 'script.py'); 

  // Write the code to script.py
  fs.writeFileSync(filePath, code);

  const MAX_EXECUTION_TIME = 20000; // 20-second timeout

  const pythonCommand = await checkPythonInstalled();

  return new Promise((resolve, reject) => {
    const process = exec(
      `${pythonCommand} ${filePath}`,
      { timeout: MAX_EXECUTION_TIME },
      (error, stdout, stderr) => {

        fs.rmSync(tempDir, { recursive: true, force: true });

        if (error) {
          if (error.killed) {
            return resolve({
              error: 'Process timed out. Please optimize your code.',
              stdout,
              stderr
            });
          }
          return resolve({ error: stderr || error.message, stdout, stderr });
        }
        resolve({ stdout, stderr });
      }
    );

    process.on('error', (err) => {
      //console.error('Process error:', err);
      reject(new Error('Failed to execute code.'));
    });

    if (stdinInput) {
      process.stdin.write(stdinInput);
      process.stdin.end();
    }
  });
}

export default executePythonCode;
