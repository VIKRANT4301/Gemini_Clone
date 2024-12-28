

/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from 'react';
import './main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

// Set up Speech Recognition if supported .It is type of API checking for voice
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    resultData,
    loading,
    setInput,
    input,
  } = useContext(Context);

  // State to hold the uploaded image and  To track the listening state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'en-US'; // Set language
      recognitionInstance.continuous = false; // Stop after one result
      recognitionInstance.interimResults = false; // Do not show interim results
      recognitionInstance.maxAlternatives = 1; // Only consider one alternative

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // Get the transcript of the speech
        setInput(transcript); // Update input field with transcript
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error('Speech Recognition API is not supported in this browser');
    }
  }, [setInput]);

  // Handle the image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result); // Set the uploaded image (base64 data)
      };
      reader.readAsDataURL(file); // Convert the image to base64 format
    }
  };

  // Handle mic button click (start/stop listening)
  const handleMicClick = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop(); // Stop listening when mic is clicked again
        setIsListening(false);
      } else {
        recognition.start(); // Start listening when mic is clicked
        setIsListening(true);
      }
    }
  };
  const handleSubmit = () => {
    onSent(input);  // Trigger onSent when the form is submitted
  };

  // Trigger sending of prompt (with or without image)
  const handleImageSend = () => {
    if (uploadedImage) {
      // If there's an uploaded image, send it along with the prompt
      onSent("Image uploaded with prompt", uploadedImage);
    } else {
      // If no image, just send the prompt
      onSent(input);
    }
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="User Icon" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Vikrant</span>
              </p>
              <p>How can I help you today?</p>
            </div>

            <div className="cards">
              <div className="card" onClick={() => onSent("Suggest best Movie to Watch today")}>
                <p>Suggest best Movie to Watch today</p>
                <img src={assets.compass_icon} alt="Compass Icon" />
              </div>

              <div className="card" onClick={() => onSent("Suggest places for one day trip")}>
                <p>Suggest places for one day trip</p>
                <img src={assets.bulb_icon} alt="Bulb Icon" />
              </div>

              <div className="card" onClick={() => onSent("Give best recipe for making pizza")}>
                <p>Give best recipe for making pizza</p>
                <img src={assets.message_icon} alt="Message Icon" />
              </div>

              <div className="card" onClick={() => onSent("What today Generation doing on...")}>
                <p>What today Generation doing on...</p>
                <img src={assets.code_icon} alt="Code Icon" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                // Display result data (can include image or text)
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>

            {/* Show uploaded image if available */}
            {uploadedImage && (
              <div className="uploaded-image-preview">
                <p>Uploaded Image:</p>
                <img src={uploadedImage} alt="Uploaded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>


              {/* Image Upload Icon and Input */}
              <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                <img src={assets.gallery_icon} alt="Gallery Icon" />
              </label>
              <input
                type="file"
                id="imageUpload"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
                accept="image/*"
              />

              {/* Mic Icon for Speech Recognition */}
              <img
                src={isListening ? assets.mic_active_icon  : assets.mic_icon}
                alt=" "
                onClick={handleMicClick} // Start/Stop listening when clicked
                style={{ cursor: 'pointer' }}
              />

              {input || uploadedImage ? (
                <img
                  onClick={handleImageSend} // Trigger sending with the image or prompt
                  src={assets.send_icon}
                  alt="Send Icon"
                  style={{ cursor: 'pointer' }}
                />
              ) : null}
            </div>
          </div>

          <p className="bottom-info">Gemini may give Inaccurate result</p>
        </div>
      </div>
    </div>
  );
};

export default Main;