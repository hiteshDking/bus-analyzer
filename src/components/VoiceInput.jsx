import { useState, useRef } from 'react';

const VoiceInput = ({ onTextCaptured, isListening, setIsListening }) => {
  const recognitionRef = useRef(null);

  const startListening = () => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("❌ Your browser doesn't support voice input. Please use Chrome, Edge, or Safari.");
      return;
    }

    // Create recognition instance
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Can change to other languages
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      console.log("🎤 Recognized:", spokenText);
      onTextCaptured(spokenText);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      
      // User-friendly error messages
      if (event.error === 'not-allowed') {
        alert("❌ Microphone access denied. Please allow microphone access and try again.");
      } else if (event.error === 'network') {
        alert("🌐 Network error. Please check your connection.");
      } else {
        alert(`❌ Error: ${event.error}. Please try again.`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`mic-button ${isListening ? 'listening' : ''}`}
      title={isListening ? "Stop listening" : "Speak your question"}
    >
      {isListening ? '🔴 Listening...' : '🎤 Speak'}
    </button>
  );
};

export default VoiceInput;