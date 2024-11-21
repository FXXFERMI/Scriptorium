/*import executeCCode from "./executeC";
import executeCppCode from "./executeCpp";
import executeJavaCode from "./executeJava";
import executeJavaScriptCode from "./executeJs";
import executePythonCode from "./executePython";
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply CORS
    await applyCors(req, res);
    
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {code, stdinInput, language } = req.body as {code: string, stdinInput: string, language: string};

  try {
    let output; 

    if(!code){
      return res.status(400).json({ message: "Code not provided" });
    }

    if(!language){
      return res.status(400).json({ message: "language not provided" });
    }

    if (language.toLowerCase() === "python") {
      output = await executePythonCode(code, stdinInput);
    } else if (language.toLowerCase() === "java") {
      output = await executeJavaCode(code, stdinInput);
    } else if (language.toLowerCase() === "c") {
      output = await executeCCode(code, stdinInput);
    } else if (language.toLowerCase() === "cpp") {
      output = await executeCppCode(code, stdinInput);
    } else if (language.toLowerCase() === "javascript") {
      output = await executeJavaScriptCode(code, stdinInput);
    } else {
      return res.status(400).json({ message: "Unsupported language" });
    }

    res.status(200).json({ output });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
*/
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await applyCors(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code, stdinInput, language } = req.body as { code: string, stdinInput: string, language: string };

  if (!code) {
    return res.status(400).json({ message: 'Code not provided' });
  }

  if (!language) {
    return res.status(400).json({ message: 'Language not provided' });
  }

  const timestamp = Date.now();
  const folderPath = path.join(os.tmpdir(), `Code_${timestamp}`);
  fs.mkdirSync(folderPath, { recursive: true });

  // Write the code to the file
  const filePath = path.join(folderPath, `program.${language === 'python' ? 'py' : 'txt'}`);
  fs.writeFileSync(filePath, code);

  // Write stdinInput to a separate file to be used in the container
  const inputFilePath = path.join(folderPath, 'input.txt');
  if (stdinInput) {
    fs.writeFileSync(inputFilePath, stdinInput);
  }

  try {
    // Run the docker command with interactive mode
    const dockerCommand = `docker run -i --rm -v ${folderPath}:/code code-exec-python python3 /code/program.py`;

    const child = exec(dockerCommand, (err, stdout, stderr) => {
      // Cleanup the temporary folder after execution
      fs.rmSync(folderPath, { recursive: true, force: true });

      if (err) {
        return res.status(500).json({ error: err.message, stderr });
      }

      res.status(200).json({ stdout, stderr });
    });

    // Write stdinInput to the Docker container's stdin
    if (stdinInput) {
      child.stdin.write(stdinInput);
      child.stdin.end();  // End the input
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
