import { useState } from "react";
import { useNavigate } from "react-router-dom"; // To handle navigation

const Speaking = () => {
  const [voiceCommand, setVoiceCommand] = useState(""); // User's spoken input
  const [responseText, setResponseText] = useState(""); // Backend's text response
  const [fluencyScore, setFluencyScore] = useState(null); // Fluency score state
  const [loading, setLoading] = useState(false); // Loading state for processing
  const [recognizing, setRecognizing] = useState(false); // Speech recognition status

  const navigate = useNavigate(); // To redirect the user to the homepage

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support speech recognition.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Single session for capturing voice input
    recognition.interimResults = false; // Only process final results
    recognition.lang = "en-US"; // Language for recognition
  
    recognition.onstart = () => {
      setRecognizing(true);
      setResponseText(""); // Clear previous response
    };
  
    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript; 
      console.log(transcript); // Capture the voice input
  
      // You can modify the transcript to add logic for fillers like "ahh", "uhhh"
      // Here you might want to add placeholders, or replace the filler words:
      const cleanedTranscript = transcript.replace(/(ahh|uhhh|umm|like|you know)/gi, "[filler]");
      
      setVoiceCommand(cleanedTranscript); // Save the cleaned or modified transcript
      setRecognizing(false);
  
      // Send the cleaned voice input to the backend for processing
      sendVoiceInputToBackend(cleanedTranscript);
    };
  
    recognition.onerror = (event) => {
      alert(`Error occurred: ${event.error}`);
      setRecognizing(false);
    };

    recognition.onend = () => {
      setRecognizing(false);
    };

    recognition.start();
  };

  const sendVoiceInputToBackend = async (input) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/ielts_conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: input }),
      });
console.log(input)
      const data = await response.json();

      if (response.ok) {
        const fullResponse = data.ai_response;
        setResponseText(fullResponse);

        // Convert response to speech
        speakText(fullResponse);
      } else {
        const errorResponse = "Error processing your input. Please try again.";
        setResponseText(errorResponse);

        // Convert error message to speech
        speakText(errorResponse);
      }
    } catch (error) {
      const errorMessage = "An error occurred while communicating with the backend.";
      setResponseText(errorMessage);

      // Convert error message to speech
      speakText(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1; // Adjust rate if needed (default is 1)
    utterance.pitch = 1; // Adjust pitch if needed (default is 1)
    synth.speak(utterance);
  };

  const handleAutoSubmit = () => {
    // Perform any final submission logic here
    alert("Time is up! Submitting your response...");
    navigate("/userhomepage"); // Navigate back to the home page
  };

  // Fetch fluency score from the backend
  const fetchFluencyScore = async () => {
    setLoading(true);
    try {
      // Retrieve user_id from local storage
      const userId = localStorage.getItem("userId");
  
      if (!userId) {
        throw new Error("User ID not found in local storage.");
      }
  
      // Append user_id as a query parameter
      const response = await fetch(`http://127.0.0.1:5000/get_fluency_score/${userId}`, {
        method: "GET",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setFluencyScore(data.fluency_score);
      } else {
        setFluencyScore("Error fetching fluency score");
      }
    } catch (error) {
      setFluencyScore("An error occurred while fetching the fluency score.");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Voice Assistant</h2>

      {/* Microphone Button */}
      <div className="relative">
        <button
          className={`w-24 h-24 bg-white text-blue-500 rounded-full flex items-center justify-center shadow-lg transition-transform ${
            recognizing ? "scale-105" : ""
          }`}
          onClick={startVoiceRecognition}
          disabled={recognizing || loading}
        >
          {recognizing ? (
            <div className="w-8 h-8 rounded-full bg-blue-500 animate-pulse"></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v3m0-3a6 6 0 006-6V9a6 6 0 00-12 0v3a6 6 0 006 6zm0 0v3m0-3H6m6 0h6"
              />
            </svg>
          )}
        </button>

        {/* Soundwave Effect */}
        {recognizing && (
          <div className="absolute -inset-2 w-28 h-28 rounded-full border-4 border-blue-300 animate-ping"></div>
        )}
      </div>

      {/* Voice Command and Response Section */}
      <div className="mt-8 w-full max-w-md">
        {voiceCommand && (
          <p className="text-gray-100 italic text-center mb-2">
            <strong>User:</strong> {voiceCommand}
          </p>
        )}
        <div className="bg-white text-black rounded-lg p-4 mt-4">
          {loading ? (
            <p className="text-center text-lg">Processing...</p>
          ) : (
            <>
              <p className="text-center">{responseText}</p>
              {fluencyScore && (
                <p className="mt-2 text-center">
                  Average Fluency Score: {fluencyScore}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-8 w-full flex justify-center gap-4">
        <button
          className="bg-blue-500 text-white rounded-lg px-6 py-3"
          onClick={fetchFluencyScore}
          disabled={loading}
        >
          Show Fluency Score
        </button>

        <button
          className="bg-green-500 text-white rounded-lg px-6 py-3"
          onClick={handleAutoSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Speaking;































