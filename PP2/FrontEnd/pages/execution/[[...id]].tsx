import React, { useState, useEffect } from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";
import { cpp } from "@codemirror/lang-cpp";

import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";
import Cookies from "js-cookie";
import Chip from "@mui/material/Chip";
import { useRouter } from "next/router";
import { cookies } from "next/headers";
import { list } from "postcss";
import { List } from "postcss/lib/list";
import toast, { Toaster } from "react-hot-toast";
import Header from "../../components/Header";
import api from "../../utils/axiosInstance";
import Link from "next/link";
import { TitleOutlined } from "@mui/icons-material";

//https://www.tailwindtoolbox.com/icons
// responsive
// http://localhost:3000/blogs/blog?id=1
// http://localhost:3000/blogs/blog?id=1

export interface blogType {
  bid: number;
  title: string;
}

const CodeExecution: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("Python");
  const [stdinInput, setStdinInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("dsnsnfsdn");
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("untitled");
  const [IsLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [ctNameInput, setCtNameInput] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>("");
  const [lightMode, setLightMode] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>("");
  const [blogs, setBlogs] = useState<blogType[]>([]);
  const [languageChange, setLanguageChange] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showTags, setShowTags] = useState(false); // State to control dropdown visibility

  const router = useRouter();

  useEffect(() => {
    const { id } = router.query;
    !id && boilerPlate();
    languageChange && handleTransfter();
  }, [language]);

  const handleTransfter = () => {
    handleNewCodeTemplate();
    setLanguageChange(false);
  };
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    switch (value) {
      case "python":
        setCode(
          `#Online Python code editor \n#Write Python here to execute \nprint("Hello, World!")`
        );
        setFileName("program.py");
        break;
      case "c":
        setCode(
          ` //Online C code editor \n//Write C here to execute \n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}`
        );
        setFileName("program.c");
        break;
      case "cpp":
        setCode(
          ` //Online C++ code editor \n//Write C++ here to execute \n#include <iostream>\n\nint main() {\n    // cout is used to print in C++\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`
        );
        setFileName("program.cpp");
        break;
      case "java":
        setCode(
          `public class Main {\n    public static void main(String[] args) {\n        // System.out.println is used to print in Java\n        System.out.println("Hello, World!");\n    }\n}`
        );
        setFileName("program.java");
        break;
      case "javascript":
        setFileName("program.js");
        setCode(
          `//Online JavaScript code editor \n//Write JavaScript here to execute \n console.log("Hello, World!");`
        );
        break;
      case "elixir":
        setCode(
          `# Online Elixir code editor \n# Write Elixir here to execute \nIO.puts "Hello, World!"`
        );
        setFileName("program.ex");
        break;
      case "go":
        setCode(
          `// Online Go code editor \n// Write Go here to execute \npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`
        );
        setFileName("main.go");
        break;
      case "php":
        setCode(
          `<?php\n// Online PHP code editor \n// Write PHP here to execute \necho "Hello, World!";\n?>`
        );
        setFileName("program.php");
        break;
      case "ruby":
        setCode(
          `# Online Ruby code editor \n# Write Ruby here to execute \nputs "Hello, World!"`
        );
        setFileName("program.rb");
        break;
      case "rust":
        setCode(
          `// Online Rust code editor \n// Write Rust here to execute \nfn main() {\n    println!("Hello, World!");\n}`
        );
        setFileName("main.rs");
        break;
      default:
        setFileName("script.py");
        setLanguage("python");
    }
    setLanguageChange(true);
  };

  useEffect(() => {
    setCodeTemplate();
    checkAuth();
  }, [router.query]);

  const setCodeTemplate = async () => {
    const { id } = router.query;
    if (id) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates/${id}`
        );
        // console.log(response.data, "code temp");
        setCode(response.data.code);
        setExplanation(response.data.explanation);
        setLanguage(response.data.language);
        setBlogs(response.data.blogs);
        response.data.tags &&
          setTags(
            response.data.tags.map(
              (tag: { tagId: number; name: string }) => tag.name
            )
          );
        setTitle(response.data.title);

        switch (language) {
          case "python":
            setFileName("program.py");
            break;
          case "c":
            setFileName("program.c");
            break;
          case "cpp":
            setFileName("program.cpp");
            break;
          case "java":
            setFileName("program.java");
            break;
          case "javascript":
            setFileName("program.js");
            break;
          case "elixir":
            setFileName("program.ex");
            break;
          case "go":
            setFileName("main.go");
            break;
          case "php":
            setFileName("program.php");
            break;
          case "ruby":
            setFileName("program.rb");
            break;
          case "rust":
            setFileName("main.rs");
            break;
          default:
            setFileName("script.py");
        }
      } catch (err) {
        // console.log(err);
        toast.error("Failed to fetch the code template. Please try again.");
        router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/execution`);
      }
    }
  };

  const checkAuth = () => {
    const token = Cookies.get("accessToken");
    setIsLoggedIn(!!token);
  };

  const boilerPlate = () => {
    // console.log("boiler plate ");
    switch (language) {
      case "python":
        setCode(
          `#Online code editor. Use the sidebar on the left to choose a language. \n#You are currently using Python. \n#Write Python here to execute \nprint("Hello, World!")`
        );
        setFileName("program.py");
        setFileName("program.py");
        break;
      case "c":
        setCode(
          ` //Online code editor. Use the sidebar on the left to choose a language. \n//You are currently using C. \n//Write C here to execute \n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}`
        );
        setFileName("program.c");
        break;
      case "cpp":
        setCode(
          ` //Online code editor. Use the sidebar on the left to choose a language. \n//You are currently using C++. \n//Write C++ here to execute \n#include <iostream>\n\nint main() {\n    // cout is used to print in C++\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`
        );
        setFileName("program.cpp");
        break;
      case "java":
        setCode(
          `public class Main {\n    public static void main(String[] args) {\n        // System.out.println is used to print in Java\n        System.out.println("Hello, World!");\n    }\n}`
        );
        setFileName("program.java");
        setFileName("program.java");
        break;
      case "javascript":
        setFileName("program.js");
        setCode(
          `//Online code editor. Use the sidebar on the left to choose a language. \n//You are currently using JavaScript. \n//Write JavaScript here to execute \n console.log("Hello, World!");`
        );
        break;
      case "elixir":
        setCode(
          `# Online code editor. Use the sidebar on the left to choose a language. \n# You are currently using Elixir. \n# Write Elixir here to execute \nIO.puts "Hello, World!"`
        );
        setFileName("program.ex");
        break;
      case "go":
        setCode(
          `// Online code editor. Use the sidebar on the left to choose a language. \n// You are currently using Go.  \n// Write Go here to execute \npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`
        );
        setFileName("main.go");
        break;
      case "php":
        setCode(
          `<?php\n// Online code editor. Use the sidebar on the left to choose a language. \n// You are currently using PHP.  \n// Write PHP here to execute \necho "Hello, World!";\n?>`
        );
        setFileName("program.php");
        break;
      case "ruby":
        setCode(
          `# Online code editor. Use the sidebar on the left to choose a language. \n# You are currently using Ruby.  \n# Write Ruby here to execute \nputs "Hello, World!"`
        );
        setFileName("program.rb");
        break;
      case "rust":
        setCode(
          `// Online code editor. Use the sidebar on the left to choose a language. \n// You are currently using Elixir.  \n// Write Rust here to execute \nfn main() {\n    println!("Hello, World!");\n}`
        );
        setFileName("main.rs");
        setCode(
          `//Online JavaScript code editor \n//Write JavaScript here to execute \n console.log("Hello, World!");`
        );
        break;
      case "elixir":
        setCode(
          `# Online Elixir code editor \n# Write Elixir here to execute \nIO.puts "Hello, World!"`
        );
        setFileName("program.ex");
        break;
      case "go":
        setCode(
          `// Online Go code editor \n// Write Go here to execute \npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`
        );
        setFileName("main.go");
        break;
      case "php":
        setCode(
          `<?php\n// Online PHP code editor \n// Write PHP here to execute \necho "Hello, World!";\n?>`
        );
        setFileName("program.php");
        break;
      case "ruby":
        setCode(
          `# Online Ruby code editor \n# Write Ruby here to execute \nputs "Hello, World!"`
        );
        setFileName("program.rb");
        break;
      case "rust":
        setCode(
          `// Online Rust code editor \n// Write Rust here to execute \nfn main() {\n    println!("Hello, World!");\n}`
        );
        setFileName("main.rs");
        break;
      default:
        setFileName("script.py");
        setLanguage("python");
    }
  };

  const getLanguageMode = () => {
    switch (language) {
      case "python":
        return python();
      case "javascript":
        return javascript();
      case "java":
        return java();
      case "go":
        return go();
      case "php":
        return php();
      case "c":
        return cpp();
      case "cpp":
        return cpp();
      case "rust":
        return rust();
      case "go":
        return go();
      case "php":
        return php();
      case "c":
        return cpp();
      case "cpp":
        return cpp();
      case "rust":
        return rust();
      default:
        return python();
    }
  };

  const myTheme1 = EditorView.theme(
    {
      "&": {
        backgroundColor: "#0A0A1E",
      },
    },
    { dark: true }
  );

  const myTheme2 = EditorView.theme(
    {
      "&": {
        backgroundColor: "white",
      },
    },
    { dark: false }
  );

  const fixInput = (value: string | undefined) => {
    if (value) {
      const escapedCode = value.replace(/["`]/g, '"');
      setCode(escapedCode);
    }
  };

  const execute = async (): Promise<void> => {
    try {
      setLoading(true);
      fixInput(code);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/execution/executeCode`,
        { code, stdinInput, language }
      );

      //   console.log(response.data, "bjfdsjeshejkrejrwersjwehh");

      if (response.data.error) {
        setOutput(response.data.error);
      } else if (response.data.stderr.length > 1) {
        setOutput(response.data.stderr);
      } else if (response.data.stdout.length > 1) {
        setOutput(response.data.stdout);
      }
    } catch (e) {
      //   console.log(e.response);
      setOutput(e.response);
    } finally {
      setLoading(false);
    }
  };

  const handleStdIn = (value: string | undefined) => {
    if (value) {
      setStdinInput(value);
    }
  };

  const handleNewCodeTemplate = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Please login to save code!");
      return;
    }

    try {
      const updateData = {
        title,
        explanation,
        language,
        tags,
        code,
      };

      const response2 = await api.post(`/api/CodeTemplates`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      //   console.log("Step4", response2.data);
      toast.success("new template created!");
      router.push(
        `${process.env.NEXT_PUBLIC_BASE_URL}/execution/${response2.data.cid}`
      );
    } catch (error) {
      //console.error("Error creating template:", error.response?.data || error.message);
      toast.error(error.response?.data || error.message);
    }
  };
  const handleSave = async () => {
    const { id } = router.query;

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("Please login to save code!");
        return;
      }
      const updateData = {
        title,
        explanation,
        language,
        tags,
        code,
      };

      if (id) {
        try {
          const response = await api.put(
            `/api/CodeTemplates/${id}`,
            updateData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          //   console.log(response.data);
          //   console.log("response", response.data);
          toast.success("Updated successfully");
        } catch (error) {
          toast.error(error.response?.data || error.message);
        }
      } else {
        handleNewCodeTemplate();
      }
    } catch (error) {
      toast.error(
        "Error updating code template:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleTagDelete = (index) => {
    setTags(tags.filter((_, idx) => idx !== index));
  };

  const handleSettingTitle = () => {
    setCtNameInput(!ctNameInput);
  };

  const handleFork = async () => {
    const { id } = router.query;

    if (!id) toast.error("please select an existing code template to fork");
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("Please login to save code!");
        return;
      }

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/CodeTemplates/fork`,
        { cid: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Template forked successfully:", response.data);
      router.push(
        `${process.env.NEXT_PUBLIC_BASE_URL}/execution/${response.data.template.cid}`
      );
    } catch (error) {
      toast.error(
        "Error forking template:",
        error.response?.data || error.message
      );
    }
  };

  const toggleTagDisplay = () => {
    setShowTags((prev) => !prev); // Toggle the display of the tags box
  };

  return (
    <>
      <Header />
      {/* <div className="mt-20 w-full"> */}
      {/* <div className={`flex mt-[15rem] md:mt-[10rem] lg:mt-[10rem] flex flex-col  items-center space-y-4 w-full ${lightMode ? 'bg-custom-gray' : 'bg-black'} border border-gray-700`}> */}
      <div
        className={`flex mt-[15rem] md:mt-[10rem] lg:mt-[10rem] flex flex-col  items-center space-y-4 w-full ${
          lightMode ? "bg-custom-gray" : "bg-black"
        }`}
      >
        <div className="flex ml-10 flex-row items-center space-x-10 flex-wrap">
          <div
            className={`flex ${
              !lightMode ? "text-white" : "text-black"
            } space-x-1 items-center ${!lightMode && "bg-black"}`}
          >
            {ctNameInput ? (
              <input
                className="mt-2 text-black w-30"
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <div>{title}</div>
            )}
            <button onClick={() => handleSettingTitle()}>
              <svg
                className="h-4 w-4 text-gray-400"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </button>
          </div>

          <div
            className={`relative flex max-w-[30%] max-h-10   space-x-1 pl-2 ${
              !lightMode ? "text-white" : "text-black"
            }`}
          >
            <div className="mt-1.5">tags:</div>
            <input
              placeholder="Enter a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="pl-1 mt-2 text-black rounded max-w-[130px] max-h-[22px] "
            />
            {/* className="pl-1 mt-2 text-black border rounded max-w-[130px] max-h-[22px] " /> */}
            <button
              onClick={() => {
                setTags((prevTags) => [...prevTags, tagInput]);
                setTagInput("");
              }}
            >
              <svg
                className="h-6 w-6 text-amber-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />{" "}
                <line x1="12" y1="8" x2="12" y2="16" />{" "}
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
            {/* Button to toggle visibility of the tags display box */}
            <button
              onClick={toggleTagDisplay}
              className="text-sm text-blue-500 underline "
            >
              {showTags ? "Hide Tags" : "Show Tags"}
            </button>
            {/* Dropdown to Display Tags */}
            {showTags && (
              <div
                className="absolute mt-2 p-4 border border-gray-300 rounded-md bg-gray-100 w-64"
                style={{
                  top: "100%", // Position the dropdown directly below the button
                  left: 0, // Align the dropdown with the left edge of the container
                  zIndex: 10, // Ensure the dropdown appears above other content
                }}
              >
                <h3 className="font-semibold text-gray-700">Tags</h3>
                <div className="flex flex-wrap space-x-2 mt-2">
                  {tags &&
                    tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        variant="outlined"
                        onDelete={() => handleTagDelete(index)}
                        sx={{
                          color: "black",
                          mt: 1,
                          "& .MuiChip-deleteIcon": {
                            color: "gray",
                          },
                        }}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2 ">
            <div className={`${!lightMode ? "text-white" : "text-black"}`}>
              Choose Language:{" "}
            </div>
            <select
              className="max-w-xs py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-grey-500"
              // className="max-w-xs py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-grey-500"
              id="language"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
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

          <div className="flex space-x-2">
            <div className={`${!lightMode ? "text-white" : "text-black"}`}>
              Explanation:{" "}
            </div>
            <input
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Enter explanation...."
              className="p-1 rounded focus:outline-none focus:ring focus:ring-blue-500"
              // className="p-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
        </div>
        <div
          className={`flex flex-col lg:flex-row relative w-full ${
            lightMode ? "bg-custom-gray" : "bg-grey-500"
          } `}
        >
          {/* <div className={`flex flex-col lg:flex-row relative w-full ${lightMode ? 'bg-custom-gray' : 'bg-custom-dark-blue'} `}> */}
          {/* <div className={`flex flex-col lg:flex-row relative w-full ${lightMode ? 'bg-custom-gray' : 'bg-custom-dark-blue'} border border-gray-700`}> */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div
              className={`flex justify-between w-full h-15 ${
                lightMode ? "bg-custom-gray" : "bg-black"
              }`}
            >
              {/* <div className={`flex justify-between w-full h-15 ${lightMode ? 'bg-custom-gray' : 'bg-black'} border border-gray-700`}> */}
              <div
                className={`${!lightMode ? "text-white" : "text-black"} ${
                  lightMode ? "bg-custom-gray" : "bg-custom-dark-blue"
                } h-full p-2`}
              >
                {fileName}
              </div>
              {/* <div className={`${!lightMode ? 'text-white': 'text-black'} ${lightMode ? 'bg-custom-gray' : 'bg-custom-dark-blue'} h-full p-2 border border-gray-600`}>{fileName}</div> */}
              <div className="flex">
                {/* <div className="flex border border-gray-700"> */}
                <button
                  className={`${
                    !lightMode ? "text-white" : "text-black"
                  } pl-1 pr-1 h-full `}
                  onClick={handleSave}
                >
                  Save
                </button>
                {/* <button className={`${!lightMode ? 'text-white': 'text-black'} pl-1 pr-1 h-full border border-gray-600`} onClick={handleSave}>Save</button> */}
                <button
                  className={`${
                    !lightMode ? "text-white" : "text-black"
                  } pl-1 pr-1 w-full`}
                  onClick={execute}
                >
                  Run
                </button>
                {/* <button className={`${!lightMode ? 'text-white': 'text-black'} pl-1 pr-1 w-full border border-gray-600`} onClick={execute}>Run</button> */}
              </div>
            </div>

            <CodeMirror
              value={code}
              extensions={[getLanguageMode()]}
              onChange={(value) => setCode(value)}
              theme={
                lightMode ? [myTheme2, vscodeLight] : [myTheme1, vscodeDark]
              }
            />
          </div>
          <div className="min-h-[500px] w-full lg:w-1/2 flex flex-col mt-6 lg:mt-0">
            <div
              className={`flex justify-between max-h-[80px] ${
                lightMode ? "bg-gray-200" : "bg-black"
              }`}
            >
              <div
                className={`${!lightMode ? "text-white" : "text-black"} ${
                  lightMode ? "bg-custom-gray-300" : "bg-custom-dark-blue"
                } p-2 `}
              >
                Output
              </div>
              {/* <div className={`${!lightMode ? 'text-white': 'text-black'} ${lightMode ? 'bg-custom-gray-300' : 'bg-custom-dark-blue'} p-2 border `}>Output</div> */}
              <div className="flex">
                <button
                  onClick={() => handleFork()}
                  className={`${
                    !lightMode ? "text-white" : "text-black"
                  } pl-10 pr-10`}
                >
                  Fork
                </button>
                {/* <button  onClick={() => handleFork()} className={`${!lightMode ? 'text-white': 'text-black'} border border-gray-600 pl-10 pr-10`}>Fork</button> */}
                <div className="relative">
                  <button
                    className={`${
                      !lightMode ? "text-white" : "text-black"
                    } pl-4 h-full pr-4`}
                    // className={`${!lightMode ? 'text-white' : 'text-black'} border border-gray-600 pl-4 h-full pr-4`}
                    onClick={() => setIsDropdownVisible((prev) => !prev)}
                  >
                    StdInput
                  </button>

                  {isDropdownVisible && (
                    <div className="w-[200%] absolute right-5 mt-2 p-2 rounded shadow-lg bg-white z-10">
                      {/* <div className="w-[200%] absolute right-5 mt-2 p-2 border border-gray-300 rounded shadow-lg bg-white z-10"> */}
                      <div className="text-black w-full mb-3">
                        Standard input:
                      </div>
                      <textarea
                        onChange={(e) => handleStdIn(e.target.value)}
                        rows={3}
                        placeholder="Enter standard input each on 1 line...."
                        className="w-[100%] p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        // className="w-[100%] p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-5  h-80 font-mono text-gray-500 overflow-y-scroll ">
              {/* <div className="p-5  h-80 font-mono text-gray-500 border border-gray-700 overflow-y-scroll "> */}
              {loading ? (
                <div>Compiling...</div>
              ) : (
                <pre className="whitespace-pre-wrap break-words w-full">
                  {output}
                </pre>
              )}
            </div>

            <div
              className={`p-2 font-mono ${
                !lightMode ? "text-white" : "text-black"
              } w-20`}
            >
              {" "}
              BLOGS{" "}
            </div>
            {/* <div className={`p-2 font-mono ${!lightMode ? 'text-white': 'text-black'} border border-gray-700 w-20`}>  BLOGS </div> */}
            <div
              className={`p-5 font-mono ${
                !lightMode ? "text-white" : "text-black"
              } min-h-[40%] overflow-y-scroll border border-gray-700`}
            >
              {/* <div className={`p-5 font-mono ${!lightMode ? 'text-white': 'text-black'} min-h-[40%] overflow-y-scroll border border-gray-700`}> */}
              <ul className="space-y-4 h-[100%]">
                {blogs.map((blog, index) => (
                  <li
                    key={blog.bid}
                    className={`flex items-center justify-between p-4 ${
                      !lightMode ? "text-white" : "text-black"
                    } hover:bg-gray-700 rounded-lg transition duration-300 ease-in-out`}
                  >
                    <Link href={`/blogs/blog?id=${blog.bid}`}>
                      {blog.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Toaster
              position="bottom-right"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: "#333",
                  color: "#fff",
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
