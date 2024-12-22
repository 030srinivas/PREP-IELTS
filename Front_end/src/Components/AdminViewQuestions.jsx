import { useState, useEffect } from "react";

const AdminViewQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch the list of questions from the backend
  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/admin-view-questions");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch questions");

      setQuestions(data.questions);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">View Questions</h2>
      {message && <p className="text-center text-red-500">{message}</p>}
      <div className="bg-white shadow-lg rounded-lg p-4">
        {questions.length === 0 ? (
          <p className="text-center text-gray-700">No questions available.</p>
        ) : (
          <ul>
            {questions.map((question) => (
              <li key={question.question_id} className="border-b p-4">
                <div>
                  <p className="font-bold">Passage:</p>
                  <p>{question.passage}</p>
                  <p className="mt-2 font-semibold">Question:</p>
                  <p>{question.question}</p>
                  <p className="mt-2 font-semibold">Options:</p>
                  <ul>
                    <li className="ml-4">1. {question.option1}</li>
                    <li className="ml-4">2. {question.option2}</li>
                    <li className="ml-4">3. {question.option3}</li>
                    <li className="ml-4">4. {question.option4}</li>
                  </ul>
                  <p className="mt-2 font-semibold text-green-500">
                    Correct Answer: {question.answer}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminViewQuestions;






