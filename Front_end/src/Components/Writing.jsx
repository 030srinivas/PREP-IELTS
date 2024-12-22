import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Writing = () => {
  const userId = localStorage.getItem("userId");

  const topics = [
    "Some people think that schools should focus more on practical skills. To what extent do you agree or disagree?",
    "Online education is replacing traditional classroom learning. Discuss the advantages and disadvantages.",
    "University education should be free for everyone. Do you agree or disagree?",
    "Modern technology is making people less sociable. To what extent do you agree or disagree?",
    "The use of artificial intelligence is increasing in workplaces. Is this a positive or negative development?",
    "Children spend too much time using smartphones. Discuss the causes and effects of this trend.",
    "Governments should invest more in renewable energy sources to combat climate change. Do you agree or disagree?",
    "Plastic pollution has become a global issue. What are the causes, and how can this problem be solved?",
    "Some people believe individuals cannot contribute significantly to environmental conservation. Do you agree or disagree?",
    "Globalization has positive effects on economic growth but negative effects on cultural identity. Discuss both views and give your opinion.",
    "Multinational companies bring economic benefits to developing countries. To what extent do you agree or disagree?",
    "The rise of international tourism has negative environmental impacts. What are the solutions to this problem?",
    "The government should ban junk food advertisements to improve public health. Do you agree or disagree?",
    "The demand for healthcare services is increasing as people live longer. Who should bear the costs: individuals or governments?",
    "More people are adopting sedentary lifestyles due to urbanization. What are the causes, and how can this be addressed?",
    "Some people believe job satisfaction is more important than a high salary. Do you agree or disagree?",
    "The concept of remote working is becoming more popular. Discuss the advantages and disadvantages.",
    "In some countries, the retirement age is increasing. Is this a positive or negative trend?",
    "Social media platforms influence how people think and behave. To what extent do you agree or disagree?",
    "In many societies, traditional gender roles are changing. Discuss the causes and effects of this development.",
  ];

  const [selectedTopic, setSelectedTopic] = useState(
    topics[Math.floor(Math.random() * topics.length)]
  );
  const [userText, setUserText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeSelected, setTimeSelected] = useState(false);

  // Function to count words in the user's text
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  };

  // Start the timer based on the selected time limit (in minutes)
  const handleTimeSelect = (time) => {
    if (!timeSelected) {
      setTimeLimit(time);
      setTimeRemaining(time * 60); // convert minutes to seconds
      setTimerActive(true);
      setTimeSelected(true);
    }
  };

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmit(); // Automatically submit when time is over
    }

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [timerActive, timeRemaining]);

  const handleSubmit = async () => {
    if (!userText.trim()) {
      setError("Please enter some text before submitting.");
      return;
    }

    const wordCount = countWords(userText);
    if (wordCount < 75) {
      setError("Your response must be at least 75 words.");
      return;
    }

    if (!userId) {
      setError("User ID is missing.");
      return;
    }

    setError("");
    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/evaluate_writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay: userText, topic: selectedTopic, user_id: userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setAnalysis(data);
      } else {
        setError(data.error || "Failed to analyze the text. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while communicating with the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-w-full bg-gradient-to-r from-teal-400 to-indigo-600 p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-3xl font-bold text-center text-white mb-6">Writing Section</h2>
      <p className="text-white mb-6">{selectedTopic}</p>

      {/* Time selection */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => handleTimeSelect(10)}
          className={`bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all duration-200 ${
            timeSelected ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={timeSelected}
        >
          10 Min
        </button>
        <button
          onClick={() => handleTimeSelect(20)}
          className={`bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all duration-200 ${
            timeSelected ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={timeSelected}
        >
          20 Min
        </button>
        <button
          onClick={() => handleTimeSelect(30)}
          className={`bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all duration-200 ${
            timeSelected ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={timeSelected}
        >
          30 Min
        </button>
      </div>

      {/* Display remaining time */}
      {timerActive && (
        <div className="text-center mb-6 text-white">
          <p>
            Time remaining: {Math.floor(timeRemaining / 60)}:{("0" + (timeRemaining % 60)).slice(-2)}
          </p>
        </div>
      )}

      <textarea
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        placeholder="Write your essay here..."
        rows="10"
        className="w-full p-4 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        disabled={timeRemaining === 0}
      ></textarea>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all duration-200"
          disabled={loading || timeRemaining === 0}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {analysis && (
        <div className="mt-6 bg-gray-100 border rounded-md p-6">
          <h3 className="font-bold text-lg">Analysis Results:</h3>
          <p><strong>Relevance Score:</strong> {analysis["Relevance Score"]}%</p>
          <p><strong>Grammar Score:</strong> {analysis["Grammar Score"]}%</p>
          <p><strong>Coherence Score:</strong> {analysis["Coherence Score"]}%</p>

          {/* Check if Grammar Errors is an array before calling map */}
          {analysis["Grammar Errors"] && Array.isArray(analysis["Grammar Errors"]) && (
            <>
              <h4 className="font-bold text-md mt-4">Grammar Errors:</h4>
              <ul className="list-disc pl-6">
                {analysis["Grammar Errors"].map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Writing;






