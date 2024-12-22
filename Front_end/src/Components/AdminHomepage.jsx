import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminHomepage = () => {
  const [showHomepage, setShowHomepage] = useState(true);
  const [passage, setPassage] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [message, setMessage] = useState("");
  // const navigate = useNavigate();
  const location = useLocation();
  const currentDate = new Date().toLocaleDateString();

  // Simulating admin ID (use real ID in production)
  const adminId = 1; // Replace with a dynamic admin ID if needed.

  useEffect(() => {
    if (location.pathname !== "/adminhomepage") {
      setShowHomepage(false);
    } else {
      setShowHomepage(true);
    }
  }, [location]);

  const handlePassageChange = (e) => {
    setPassage(e.target.value);
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleOptionChange = (e, index) => {
    const newOptions = [...options];
    newOptions[index].text = e.target.value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        passage,
        admin_id: adminId,
        question,
        option1: options[0]?.text || "",
        option2: options[1]?.text || "",
        option3: options[2]?.text || "",
        option4: options[3]?.text || "",
        answer: options.find((opt) => opt.isCorrect)?.text || "",
      };
  
      const response = await fetch("http://127.0.0.1:5000/admin/add-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || "Failed to add question");
  
      setMessage("Question added successfully! Add another question for the same passage or clear the passage.");
      setQuestion(""); 
      setOptions([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]); 
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };
  
  const handleClearPassage = () => {
    setPassage(""); 
    setMessage(""); 
  };
  

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: `url('https://t3.ftcdn.net/jpg/09/16/59/70/240_F_916597079_45yl3e1VfCl4EhsOm4Z7bnvwFyXsWgoa.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <header className="bg-black text-white text-center py-4">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </header>

      <div className="flex flex-1">
        <AdminNavbar />

        <main className="flex-1 p-6 bg-white bg-opacity-80 rounded-md">
          {showHomepage && (
            <>
              <div className="min-w-full bg-transparent border-r-1 border-gray-200 shadow-md rounded-2xl backdrop-filter backdrop-blur-md bg-white12/30 p-7">
                <h2 className="text-center text-2xl font-semibold mb-4">Welcome, Admin!</h2>
                <p className="text-center text-gray-700">Current Date: {currentDate}</p>
              </div>

              <div className="mt-6">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold mb-4">Add Passage, Question, and Options</h3>

                  {/* Passage Input */}
                  <textarea
                    value={passage}
                    onChange={handlePassageChange}
                    className="w-full p-4 border border-gray-300 rounded-md"
                    placeholder="Enter passage content here..."
                    rows="5"
                  />

                  {/* Question Input */}
                  <textarea
                    value={question}
                    onChange={handleQuestionChange}
                    className="w-full p-4 border border-gray-300 rounded-md mt-4"
                    placeholder="Enter question content here..."
                    rows="3"
                  />

                  {/* Options Section */}
                  <div className="mt-4">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center mb-3">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => handleOptionChange(e, index)}
                          className="w-full p-3 border border-gray-300 rounded-md"
                          placeholder={`Option ${index + 1}`}
                        />
                        <input
                          type="radio"
                          checked={option.isCorrect}
                          onChange={() => handleCorrectChange(index)}
                          className="ml-2"
                        />
                        <span className="ml-2">Correct Option</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex mt-4 space-x-4">
  <button
    type="submit"
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Submit
  </button>
  <button
    type="button"
    onClick={handleClearPassage}
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
  >
    Clear Passage
  </button>
</div>


                  {message && <p className="mt-4 text-center text-green-500">{message}</p>}
                </form>
              </div>
            </>
          )}

          <div className="m-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHomepage;





