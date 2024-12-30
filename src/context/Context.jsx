// eslint-disable-next-line no-unused-vars
import React, { createContext, useState } from "react";
import runChat from "../config/Gemini"; 

// eslint-disable-next-line react-refresh/only-export-components
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const delayPara = (index, formattedResponse) => {
    setTimeout(() => {
      setResultData(formattedResponse);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let response = " ";
    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }

    // Process response to split it into an array of words or sentences
    let newResponse = " ";
    let responseArray = response.split("**");

    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }

    let newResponse2 = newResponse.split("*").join("</br>");
    setResultData(newResponse2);

    // Trigger dark mode if the result contains "code"
    if (response.includes("code")) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }

    // Handle typing effect without overwriting resultData multiple times
    let newResponseArray = newResponse2.split(" ");
    let formattedResponse = "";

    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      formattedResponse += nextWord + " ";
      delayPara(i, formattedResponse);
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    isDarkMode, // Provide dark mode state in context
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;

