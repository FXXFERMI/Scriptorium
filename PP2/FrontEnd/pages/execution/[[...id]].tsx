import React, { useState, useEffect, use } from "react";
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view'; 
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { cookies } from "next/headers";
import { list } from "postcss";
import { List } from "postcss/lib/list";
import toast, { Toaster } from "react-hot-toast";

//https://www.tailwindtoolbox.com/icons
// if language changes -> create a new template redirect to execucation page with new id 
// if signed out user tries saving give them sign up prompt then show promp for saving stuff
// fix stdin
// add tags
// fork 
// handle java shit file names 
// handle all languages on code mirror 
// change backend to work in isolation
// responsive 

const CodeExecution: React.FC = () => {
    const [code, setCode] = useState<string>("");
    const [language, setLanguage] = useState<string>("Python");
    const [stdinInput, setStdinInput] = useState<string>(""); 
    const [output, setOutput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>("");
    const[explanation, setExplanation] = useState<string>("dsnsnfsdn");
    const[tags, setTags] = useState<string[]>(["Python", "fngn"]);
    const [title, setTitle] = useState<string>("ndsfnsd");
    const [IsLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [ctNameInput, setCtNameInput] = useState<boolean>(false);
    const [tempName, setTempName] = useState<string>("");
    const [lightMode, setLightMode] = useState<boolean>(false)

    const router = useRouter();
   

    useEffect(() => {
        const { id } = router.query; 
        !id && boilerPlate();
    }, [language]);


    useEffect(() => {
        setCodeTemplate();
        checkAuth(); 
      }, [router.query]);

    const setCodeTemplate = async () => {
        const { id } = router.query; 
        console.log("id", id)
        if(id){
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates/${id}`);
                console.log(response.data)
                setCode(response.data.code);
                setExplanation(response.data.explanation);
                setLanguage(response.data.language);
                setTags(response.data.tags);
                setTitle(response.data.title);
              } catch (err) {
                console.log('Failed to fetch the code template. Please try again.');
              } 
        }
    }

    const checkAuth = () => {
        const token = Cookies.get("accessToken");
        setIsLoggedIn(!!token);
    };

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
    
    
    const myTheme1 = EditorView.theme({
        "&": {
        backgroundColor: "#0A0A1E",
        }}, { dark: true });

    const myTheme2 = EditorView.theme({
        "&": {
        backgroundColor: "white",
        }}, { dark: false });

    const execute = async (): Promise<void> => {
        console.log("dsfjdfj",language)
        try {
            language.toLocaleLowerCase() === 'java' && boilerPlate();
            setLoading(true)
            fixInput(code)
           
            console.log(code, stdinInput, language)
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/execution/executeCode`,
                { code, stdinInput, language }
            );
            
            response.data.output.stderr.length > 1 ? setOutput(response.data.output.stderr) :
            setOutput(response.data.output.stdout);

            console.log(response.data.output)

        } catch (e) {
            console.log(e.response)
            setOutput(e.response)
            
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
            setStdinInput(value.replace(/\s+/g, '').replace(/,/g, '\n'));
        }
    }

    const handleSave = async () => {
        const { id } = router.query; 

        try {
           
            const token = Cookies.get("accessToken"); 
            if (!token) {
                alert("Access token is missing");
                return;
            }
            const jsonTags = JSON.stringify(tags);  
            const escapedJsonTags =  jsonTags.replace(/"/g, '\"');
            const updateData = {
                title,
                explanation,
                language,
                tags: escapedJsonTags,
                code
              };

            if (id){

                try{
                    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates/${id}`, updateData, 
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                            withCredentials: true,
                        },
                    );
                    toast.success('Updated successfully')
                } catch(error){
                    toast.error(error.response?.data || error.message)
                }
            
            }
            else{
                console.log(IsLoggedIn, updateData)
                try {
                    
                    const response2 = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates`, updateData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                            withCredentials: true,
                        },
                
                    );
                    console.log(response2.data)
                    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/execution/${response2.data.cid}`);
                    //redict to page NEXT_PUBLIC_BASE_URL/execution/{response2.id} 
                  } catch (error) {
                    console.error("Error creating template:", error.response?.data || error.message);
                    toast.error(error.response?.data || error.message);
                  }

            }
        
          } catch (error) {
            console.error('Error updating code template:', error.response ? error.response.data : error.message);
          }

    }

    const handleSettingTitle = () => {
        ctNameInput && setTitle(tempName)
        setCtNameInput(!ctNameInput)
        
    }


    return (
        
    <div className={`flex flex-col items-center space-y-4 w-full ${lightMode ? 'bg-custom-gray' : 'bg-black'} border border-gray-700`}>
        <div className="flex space-x-20 h-8 pt-2 items-center">
            <div className="flex space-x-1 items-center">
                {ctNameInput ? <input onChange={(e) => setTempName(e.target.value)}/> : <div>{title}</div>}
                <button onClick={() => handleSettingTitle()}>
                    <svg className="h-4 w-4 text-gray-400" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                </button>
            </div>
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
            <div className="flex mt-2">
                <div className="w-full">Standard input:  </div>
                <input
                    type="text"
                    onChange={(e) => handleStdIn(e.target.value)}
                    placeholder="Enter text"
                    className="w-full h-7 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>
        </div>
        <div className={`flex flex-row items-center space-x-4 w-full ${lightMode ? 'bg-custom-gray' : 'bg-custom-dark-blue'} border border-gray-700`}>
            <div className="w-[15%] max-w-[500px]">
                <div>hdfhdhf</div>
                <div>jdfjdfjdfj</div>
            </div>
            <div className="flex flex-col w-[43%] max-w-[1800px] border border-gray-700">
                <div className={`flex justify-between max-h-[70px] ${lightMode ? 'bg-custom-gray' : 'bg-black'} border border-gray-700`}>
                    <div className={`${lightMode ? 'bg-custom-gray' : 'bg-custom-dark-blue'} h-full p-2 border border-gray-600`}>{fileName}</div>
                    <div className="flex border border-gray-700">
                        <button className="pl-1 pr-1 h-full border border-gray-600" onClick={handleSave}>Save</button>
                        <button className="pl-1 pr-1 w-full border border-gray-600" onClick={execute}>Run</button>
                    </div>
                </div>
                <div className="flex flex-row space-x-2 border border-gray-600">
                    <CodeMirror
                        value={code}
                        height="86vh"
                        width="42.2vw"
                        extensions={[getLanguageMode()]}
                        onChange={(value) => setCode(value)}
                        theme={lightMode ? [myTheme2, vscodeLight] : [myTheme1, vscodeDark]}
                    />
                </div>
            </div>
            <div className="flex flex-col w-[41%] max-w-[900px] absolute top-12 right-0 mt-0.5">
                <div className={`flex justify-between max-h-[80px] ${lightMode ? 'bg-gray-200' : 'bg-black'}`}>
                    <div className={`${lightMode ? 'bg-custom-gray-300' : 'bg-custom-dark-blue'} p-2 border border-gray-600`}>Output</div>
                    <div className="flex space-x-2">
                        <button className="border border-gray-600 p-2">Fork?</button>
                    </div>
                </div>
                <div className="p-5 font-mono text-gray-500 ">
                    {loading ? <div>Compiling...</div> :<pre className="whitespace-pre-wrap break-words w-full">{output}</pre>}
                </div>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
            </div>
        </div>
    </div>

        
    );
};

export default CodeExecution;
