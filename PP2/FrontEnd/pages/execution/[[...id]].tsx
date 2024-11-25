import React, { useState, useEffect} from "react";
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { php } from '@codemirror/lang-php';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { cpp } from '@codemirror/lang-cpp';


import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
import Cookies from 'js-cookie';
import Chip from '@mui/material/Chip';
import { useRouter } from 'next/router';
import { cookies } from "next/headers";
import { list } from "postcss";
import { List } from "postcss/lib/list";
import toast, { Toaster } from "react-hot-toast";
import Header from "../../components/Header"

//https://www.tailwindtoolbox.com/icons
// fork 
// responsive 
// add more languages  (code Mirror only)
// http://localhost:3000/blogs/blog?id=1

const CodeExecution: React.FC = () => {
    const [code, setCode] = useState<string>("");
    const [language, setLanguage] = useState<string>("Python");
    const [stdinInput, setStdinInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>("");
    const [explanation, setExplanation] = useState<string>("dsnsnfsdn");
    const [tags, setTags] = useState<string[]>(["Python"]);
    const [title, setTitle] = useState<string>("enter title");
    const [IsLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [ctNameInput, setCtNameInput] = useState<boolean>(false);
    const [tempName, setTempName] = useState<string>("");
    const [lightMode, setLightMode] = useState<boolean>(false);
    const [forked, SetForked] = useState<boolean>(false);
    const [tagInput, setTagInput] = useState<string>("");
    const [blogs, setBlogs] = useState<string>("");

    const router = useRouter();


    useEffect(() => {
        const { id } = router.query;
        !id && boilerPlate();
    }, [language]);


    useEffect(() => {
        setCodeTemplate();
        checkAuth();
        console.log("dbfbdf")
    }, []);

    const setCodeTemplate = async () => {
        const { id } = router.query;
        if (id) {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates/${id}`);
                console.log(response.data)
                setCode(response.data.code);
                setExplanation(response.data.explanation);
                setLanguage(response.data.language);
                
                setTags(response.data.tags.map((tag: { tagId: number; name: string }) => tag.name));
                setTitle(response.data.title);
                switch(language){
                    case 'python':
                        setFileName('program.py');
                        break;
                    case 'c':
                        setFileName('program.c')
                        break;
                    case 'cpp':
                        setFileName('program.cpp');
                        break;
                    case 'java':
                        setFileName('program.java');
                        break;
                    case 'javascript':
                        setFileName('program.js');
                        break;
                    case 'elixir':
                        setFileName('program.ex');
                        break;
                    case 'go':
                        setFileName('main.go');
                        break;
                    case 'php':
                        setFileName('program.php');
                        break;
                    case 'ruby':
                        setFileName('program.rb');
                        break;
                    case 'rust':
                        setFileName('main.rs');
                        break;
                    default:
                        setFileName('script.py');
                }
                
            } catch (err) {
                toast.error('Failed to fetch the code template. Please try again.');
                router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/execution`);
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
                setFileName('program.py');
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
                setFileName('program.java');
                break;
            case 'javascript':
                setFileName('program.js');
                setCode(`//Online JavaScript code editor \n//Write JavaScript here to execute \n console.log("Hello, World!");`);
                break;
            case 'elixir':
                setCode(`# Online Elixir code editor \n# Write Elixir here to execute \nIO.puts "Hello, World!"`);
                setFileName('program.ex');
                break;
            case 'go':
                setCode(`// Online Go code editor \n// Write Go here to execute \npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`);
                setFileName('main.go');
                break;
            case 'php':
                setCode(`<?php\n// Online PHP code editor \n// Write PHP here to execute \necho "Hello, World!";\n?>`);
                setFileName('program.php');
                break;
            case 'ruby':
                setCode(`# Online Ruby code editor \n# Write Ruby here to execute \nputs "Hello, World!"`);
                setFileName('program.rb');
                break;
            case 'rust':
                setCode(`// Online Rust code editor \n// Write Rust here to execute \nfn main() {\n    println!("Hello, World!");\n}`);
                setFileName('main.rs');
                break;
            default:
                setFileName('script.py');
                setLanguage('python')
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
            case 'go':
                return go();
            case 'php':
                return php();
            case 'c':
                return cpp();
            case 'cpp':
                return cpp();
            case 'rust':
                return rust();
            default:
                return python();
        }
    };


    const myTheme1 = EditorView.theme({
        "&": {
            backgroundColor: "#0A0A1E",
        }
    }, { dark: true });

    const myTheme2 = EditorView.theme({
        "&": {
            backgroundColor: "white",
        }
    }, { dark: false });

    const execute = async (): Promise<void> => {
        try {
            language.toLocaleLowerCase() === 'java' && boilerPlate();
            setLoading(true)
            fixInput(code)

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/execution/executeCode`,
                { code, stdinInput, language }
            );

            console.log(response.data)
            if(response.data.error){
                setOutput(response.data.error);
            }
            else if (response.data.stderr.length > 1) {
                setOutput(response.data.stderr)
            }
            else if (response.data.stdout.length > 1) {
                setOutput(response.data.stdout)
            }

            console.log(response.data, 'bhhh')

        } catch (e) {
            console.log(e.response)
            setOutput(e.response)

        } finally {
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
        if (value) {
            setStdinInput(value);
        }
    }

    const handleSave = async () => {
        const { id } = router.query;

        try {

            const token = Cookies.get("accessToken");
            if (!token) {
                toast.error('Please login to save code!')
                return;
            }
            const updateData = {
                title,
                explanation,
                language,
                tags,
                code
            };

            if (id) {
                try {
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
                } catch (error) {
                    toast.error(error.response?.data || error.message)
                }

            }
            else {
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


        <>
            <Header /> 
            {/* <div className="mt-20 w-full"> */}
                <div className={`flex mt-20 flex-col items-center space-y-4 w-full ${lightMode ? 'bg-custom-gray' : 'bg-black'} border border-gray-700`}>
                    <div className={`flex flex-row items-center space-x-4 w-full ${lightMode ? 'bg-custom-gray' : 'bg-custom-dark-blue'} border border-gray-700`}>
                        <div className=" h-[650px] w-[15%] max-w-[500px] overflow-y-scroll overflow-x-hidden">
                            <div className="pl-10 mb-10 flex h-[45px] w-[300px] text-white space-x-1 items-center bg-black">
                                {ctNameInput ? <input className="text-black max-w-[140px]" onChange={(e) => setTempName(e.target.value)} /> : <div>{title}</div>}
                                <button onClick={() => handleSettingTitle()}>
                                    <svg className="h-4 w-4 text-gray-400" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                    </svg>
                                </button>
                            </div>

                            {}

                            <div className="flex flex-wrap space-x-1 pl-2 mb-5 text-white">
                                <div className="mt-2">tags: 
                                </div>
                                <input placeholder="Enter a tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} 
                                className="pl-1 mt-3 text-black border rounded max-w-[130px] max-h-[22px] " />
                                <button className="mt-2" onClick={() => setTags((prevTags) => [...prevTags, tagInput])}>
                                    <svg className="h-6 w-6 text-amber-500"  viewBox="0 0 24 24"  fill="none"  
                                    stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />  <line x1="12" y1="8" x2="12" 
                                    y2="16" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>
                                </button>
                                {tags && tags.map((tag, index) => {
                                return (
                                    <Chip
                                        key={index} 
                                        label={tag}
                                        variant="outlined"
                                        onDelete={() =>
                                            setTags(tags.filter((tag2, index2) => index2 !== index))
                                          }
                                        sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        mt: 1,
                                        '& .MuiChip-deleteIcon': {
                                            color: 'gray',
                                        },
                                    }}
                                  />
                                );
                            })}</div>
                            
                            <div className="pl-2 mb-5 pr-2">
                                <label className="text-white" htmlFor="language">Choose Language: </label>
                                <select
                                    className="mt-3 w-full max-w-xs py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    id="language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    >
                                    <option value="python">Python</option>
                                    <option value="c">C</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="elixir">Elixir</option>
                                    <option value="php">PHP</option>
                                    <option value="ruby">Ruby</option>
                                    <option value="rust">Rust</option>
                                    <option value="go">go</option>
                                </select>
                            </div>

                            <div className="pl-2  pr-2">
                                <div className="text-white w-full  mb-3">Standard input: </div>
                                <textarea
                                    onChange={(e) => handleStdIn(e.target.value)}
                                    rows={3}
                                    placeholder="Enter standard input each on 1 line...."
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                                />
                            </div>
                   
                        </div>
                        <div className="flex flex-col w-[43%] max-w-[1800px] border border-gray-700">
                            <div className={`flex justify-between max-h-[70px] ${lightMode ? 'bg-custom-gray' : 'bg-black'} border border-gray-700`}>
                                <div className={`text-white ${lightMode ? 'bg-custom-gray' : 'bg-custom-dark-blue'} h-full p-2 border border-gray-600`}>{fileName}</div>
                                <div className="flex border border-gray-700">
                                    <button className="text-white pl-1 pr-1 h-full border border-gray-600" onClick={handleSave}>Save</button>
                                    <button className="text-white pl-1 pr-1 w-full border border-gray-600" onClick={execute}>Run</button>
                                </div>
                            </div>
                            <div className="flex flex-row space-x-2 border border-gray-600">
                                <CodeMirror
                                    value={code}
                                    height="82vh"
                                    width="42.2vw"
                                    extensions={[getLanguageMode()]}
                                    onChange={(value) => setCode(value)}
                                    theme={lightMode ? [myTheme2, vscodeLight] : [myTheme1, vscodeDark]}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-[41%] max-w-[900px] absolute h-[642px] right-0">
                            <div className={`flex justify-between max-h-[80px] ${lightMode ? 'bg-gray-200' : 'bg-black'}`}>
                                <div className={`text-white ${lightMode ? 'bg-custom-gray-300' : 'bg-custom-dark-blue'} p-2 border border-gray-600`}>Output</div>
                                <div className="flex space-x-2">
                                    <button className="text-white border border-gray-600 pl-4 pr-4">Fork</button>
                                </div>
                            </div>
                            <div className="p-5 font-mono text-gray-500 ">
                                {loading ? <div>Compiling...</div> : <pre className="whitespace-pre-wrap break-words w-full">{output}</pre>}
                            </div>
                            <Toaster
                                position="bottom-right"
                                reverseOrder={false}
                                toastOptions={{
                                    style: {
                                        background: '#333',
                                        color: '#fff',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </>


    );
};

export default CodeExecution;
