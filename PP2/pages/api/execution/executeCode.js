import executeCCode from "./executeC";
import executeCppCode from "./executeCpp";
import executeJavaCode from "./executeJava";
import executeJavaScriptCode from "./executeJs";
import executePythonCode from "./executePython";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {code, stdinInput, language } = req.body;

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
