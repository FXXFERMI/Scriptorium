import React, { useState, useEffect } from "react";
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view'; 
import MuiSwitch from '../../components/MuiSwitch';
const CodeExecution: React.FC = () => {
    const [code, setCode] = useState<string>("");
    const [language, setLanguage] = useState<string>("python");
    const [stdinInput, setStdinInput] = useState<string>("1\n2"); 
    const [output, setOutput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>("");

    useEffect(() => {
        boilerPlate();
    }, [language]);


    const boilerPlate = () => {
        switch (language) {
            case 'python':
              setCode(`#Online Python code editor \n#Write Python here to execute \nprint("Hello, World!")`);
              setFileName('script.py');
              break;
            case 'c':
              setCode(` //Online C code editor \n//Write C here to execute \n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}`);
              setFileName('program.c')
              break;
            case 'cpp':
              setCode(` //Online C++ code editor \n//Write C++ here to execute \n#include <iostream>\n\nint main() {\n    // cout is used to print in C++\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`);
              setFileName('program.cpp');
              break;
            case 'java':
              setCode(`public class Main {\n    public static void main(String[] args) {\n        // System.out.println is used to print in Java\n        System.out.println("Hello, World!");\n    }\n}`);
              
              const classNameMatch = code.match(/public class (\w+)/);
              const className = classNameMatch ? classNameMatch[1] : 'Main.java'; 
              setFileName(className)
              break;
            case 'javascript':
              setFileName('program.js');
              setCode(`console.log("Hello, World!");`);
              break;
            default:
              setFileName('script.py');
              setCode('print("Hello, World!")');
          }
    }
    

    const getLanguageMode = () => {
        switch (language) {
          case 'python':
            return python();
          case 'javascript':
            return javascript();
          case 'java':
            return java();
          default:
            return python();
        }
      };
    
    
    const myTheme = EditorView.theme({
        "&": {
        backgroundColor: "#0A0A1E",
        }}, { dark: true });

    const execute = async (): Promise<void> => {
        try {
            language.toLocaleLowerCase() === 'java' && boilerPlate();
            setLoading(true)
            fixInput(code)
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/execution/executeCode`,
                { code, stdinInput, language }
            );
            response.data.output.error ? setOutput(response.data.output.error) : setOutput(response.data.output);

        } catch (e) {

            setOutput(e.response.data)
            
        } finally{
            setLoading(false)
        }
    };

    const fixInput = (value: string | undefined) => {
        if (value) {
            const escapedCode = value.replace(/["`]/g, "\"");
            setCode(escapedCode);
        }
    };

    const handleStdIn = (value: string | undefined) => {
        if (value){
            setStdinInput(value);
        }
    }


    return (
        
        <div className="flex flex-col items-center space-y-4 w-full bg-black border border-gray-700 ">
            <div className="flex space-x-20 h-8 pt-2 items-center">
                <div>
                    <label htmlFor="language">Choose Language: </label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="python">Python</option>
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="javascript">JavaScript</option>
                    </select>
                </div>
                <div>
                    {MuiSwitch()}
                </div>
                <div className="flex  mt-2">
                    <div className="w-full">Standard input:  </div>
                    <input type="text" onChange={(e) => handleStdIn(e.target.value)} placeholder="Enter text" className="w-full h-7 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500" />
                </div>
                
            </div>
            <div className="flex flex-row items-center space-x-4 w-full bg-custom-dark-blue border border-gray-700 ">
                <div className="w-[15%] max-w-[500px] ">
                    <div>hdfhdhf</div>
                    <div>jdfjdfjdfj</div>
                </div>
                <div className="flex flex-col w-[43%] max-w-[1800px] border border-gray-700">
                    <div className="flex justify-between max-h-[70px] bg-black border border-gray-700">
                        <div className="bg-custom-dark-blue h-full p-2 border border-gray-600 ">{fileName}</div>
                        <div className="flex border border-gray-700">
                            <button className="pl-1 pr-1 h-full border border-gray-600">Save</button>
                            <button  className="pl-1 pr-1 w-full border border-gray-600" onClick={execute}>Run</button>
                        </div>
                    </div>
                    <div className="flex flex-row space-x-2 border border-gray-600">
                        <CodeMirror
                            value={code}
                            height="86vh"
                            width="42.2vw"
                            extensions={[getLanguageMode()]}
                            onChange={(value) => setCode(value)} 
                            theme={[myTheme, vscodeDark]}

                        />
                    </div>
                </div>

                <div className="flex flex-col w-[41%] max-w-[900px] absolute top-12 right-0 mt-0.5">
                    <div className="flex justify-between max-h-[80px] bg-black">
                        <div className="bg-custom-dark-blue p-2 border border-gray-600">Output</div>
                        <div className="flex space-x-2">
                            <button className="border border-gray-600 p-2">logic later</button>
                        </div>
                    </div>
                    <div className=" p-5 font-mono text-gray-500">
                        {loading ? <div>Compiling...</div> :
                        <div className="break-words " >{output}</div>}
                    </div>
                </div>
            </div>

        </div>
        
    );
};

export default CodeExecution;
