import React, { useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import "./stt.scss"; 

const SpeechToText = ({ setComplaint }) => {
  const [text, setText] = useState("");
  const [recognizing, setRecognizing] = useState(false);

  const azureKey = "bb8caff5d0d94384b1b4f616ca9a104a";
  const azureRegion = "eastus";

  const startRecognition = () => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);
    speechConfig.speechRecognitionLanguage = "id-ID";

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    setRecognizing(true);

    recognizer.recognizeOnceAsync(
      (result) => {
        setText(result.text);
        setComplaint(result.text);
        setRecognizing(false);
      },
      (err) => {
        console.error("Recognition error: ", err);
        setRecognizing(false);
      }
    );
  };

  return (
    <div className="speech-to-text">
      <label className="input-label">Keluhan Customer</label>
      <div className="input-box">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Sistem Speech To Text Recognition"
          readOnly
        />
        <button
          className={`speech-button ${recognizing ? "recognizing" : ""}`}
          onClick={startRecognition}
          disabled={recognizing}
        >
          {recognizing ? "Recognizing..." : "🎤 Start Recognition"}
        </button>
      </div>
    </div>
  );
};

export default SpeechToText;
