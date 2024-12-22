import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Reading = () => {
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState(10);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [scoreDetails, setScoreDetails] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const userId = localStorage.getItem("userId");

  const fetchQuizData = useCallback(() => {
    axios
      .get("http://localhost:5000/api/get-quiz")
      .then((response) => {
        setQuizData(response.data);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to fetch quiz data. Please try again later.");
        console.error(err);
      });
  }, []);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  useEffect(() => {
    if (!quizStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          alert("Time's up!");
          submitAnswers();
        }
        return prevTime - 1;
      });
    }, 1000);

    setTimerInterval(timer);

    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(selectedTimer * 60);
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const submitAnswers = () => {
    clearInterval(timerInterval);
    setTimeLeft(0);

    const payload = { userId, answers: selectedAnswers };

    axios
      .post("http://localhost:5000/api/submit-quiz", payload, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.data) {
          const { correct_answers, attempted_answers, percentage } = response.data;
          setScoreDetails({
            correct: correct_answers.split("/")[0],
            attempted: attempted_answers,
            percentage: parseFloat(percentage),
          });
        } else {
          alert("Unexpected response from the server.");
        }
      })
      .catch((err) => {
        console.error("Error submitting quiz:", err);
        alert("Network error: Unable to submit quiz.");
      });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-600 text-center mt-5 p-4 bg-red-100 rounded-lg shadow-lg"
      >
        {error}
      </motion.div>
    );
  }

  if (!quizData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-5 text-gray-600"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-lg">Loading quiz data...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-5 max-w-4xl mx-auto mb-5 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 rounded-xl shadow-lg"
    >
      <h2 className="text-4xl font-extrabold text-center text-white mb-8">Reading Section</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 p-6 border border-white rounded-lg bg-white bg-opacity-70 shadow-xl"
      >
        <h3 className="text-2xl font-semibold text-teal-800 mb-4">Passage</h3>
        <p className="text-gray-700 text-lg">{quizData.passage}</p>
      </motion.div>

      {!quizStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center space-y-4 mb-8"
        >
          <div className="w-full max-w-xs">
            <label className="block text-teal-700 font-medium mb-2">Select Timer</label>
            <select
              className="w-full p-3 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white text-teal-600"
              value={selectedTimer}
              onChange={(e) => setSelectedTimer(Number(e.target.value))}
            >
              <option value={10}>10 minutes</option>
              <option value={12}>12 minutes</option>
              <option value={20}>20 minutes</option>
            </select>
          </div>
          <button
            onClick={startQuiz}
            className="bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors duration-200"
          >
            Start Quiz
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-center mb-8 p-4 bg-teal-100 rounded-lg"
        >
          <span className="text-teal-700">Time Left: </span>
          <span className="text-teal-800">{formatTime(timeLeft)}</span>
        </motion.div>
      )}

      {quizStarted && quizData.questions && quizData.questions.length > 0 && (
        <motion.div
          key={quizData.questions[currentQuestionIndex].question_id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-6 border border-teal-200 rounded-lg bg-white shadow-xl"
        >
          <h4 className="text-xl font-semibold text-teal-800 mb-4">
            Question {currentQuestionIndex + 1}
          </h4>
          <p className="text-teal-700 mb-6">{quizData.questions[currentQuestionIndex].question}</p>
          <ul className="space-y-4">
            {quizData.questions[currentQuestionIndex].options.map((option, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-teal-50 transition-colors duration-200 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${quizData.questions[currentQuestionIndex].question_id}`}
                    className="w-5 h-5 text-teal-600 border-teal-300 focus:ring-2 focus:ring-teal-500"
                    checked={selectedAnswers[quizData.questions[currentQuestionIndex].question_id] === option}
                    onChange={() =>
                      handleAnswerSelect(quizData.questions[currentQuestionIndex].question_id, option)
                    }
                  />
                  <span className="text-teal-700">{option}</span>
                </label>
              </motion.li>
            ))}
          </ul>

          {/* Next Question Button */}
          {currentQuestionIndex < quizData.questions.length - 1 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end mt-6"
            >
              <button
                onClick={handleNextQuestion}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors duration-200"
              >
                Next Question
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-between items-center space-x-6 mt-8"
            >
              <button
                onClick={submitAnswers}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
              >
                Submit Quiz
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {scoreDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 bg-indigo-100 p-5 rounded-lg shadow-lg"
        >
          <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Your Score</h3>
          <p className="text-lg text-indigo-600">
            Correct Answers: {scoreDetails.correct}/{scoreDetails.attempted}
          </p>
          <p className="text-lg text-indigo-600">Percentage: {scoreDetails.percentage}%</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Reading;