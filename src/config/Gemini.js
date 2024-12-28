
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,//AIzaSyB87pJhEmNlSq8MaZm2TA22ncwvwKg5lfQ
  }from "@google/generative-ai";

   const MODEL_NAME ="gemini-pro";//1.0-
  const API_KEY = "AIzaSyB87pJhEmNlSq8MaZm2TA22ncwvwKg5lfQ";

  async function runChat(prompt){
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
   // model: "gemini-2.0-flash-exp",

  
  const generationConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 2048,

  };
  const  safteySettings =[
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.HARM_BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.HARM_BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category:HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold:HarmBlockThreshold.HARM_BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat=model.startChat({
      generationConfig,
      safteySettings,
      history:[

      ],
  });

  const result =await chat.sendMessage(prompt);
  const response=result.response;
  console.log(response.text());
  return response.text();
}

export default runChat;