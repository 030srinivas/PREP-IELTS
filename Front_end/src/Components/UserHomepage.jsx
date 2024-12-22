import { Outlet, useLocation } from "react-router-dom";  // Make sure Outlet is imported
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSpring, animated } from '@react-spring/web';
import axios from "axios";
import Navbar from "./Navbar";

const UserHomepage = () => {
  const [showHomepage, setShowHomepage] = useState(true);
  const [dailyScores, setDailyScores] = useState({
    speaking_score: 0,
    listening_score: 0,
    reading_score: 0,
    writing_score: 0,
  });

  const location = useLocation();
  const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in 'YYYY-MM-DD' format
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    setShowHomepage(location.pathname === "/userhomepage");

    // Fetching the scores based on the current date
    const fetchScores = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
        const response = await axios.get(`/api/daily-progress/${userId}`, {
          params: { date: currentDate }, // Passing the current date as a query parameter
        });
        setDailyScores(response.data);
      } catch (error) {
        console.error("Failed to fetch daily scores:", error);
      }
    };

    fetchScores();
  }, [location, currentDate]);

  const fadeIn = useSpring({
    opacity: showHomepage ? 1 : 0,
    transform: showHomepage ? "translateY(0)" : "translateY(50px)",
  });

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-100 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/04/71/39/33/360_F_471393300_v8e5ES3Y2ziBfZ9y9nHXJOwbLuAzvIoH.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <motion.header
        className="bg-black text-white text-center py-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl font-semibold">AI-ENHANCED IELTS PREPARATION</h1>
      </motion.header>

      <div className="flex flex-1">
        <Navbar />

        <main className="flex-1 p-6">
          {showHomepage && (
            <animated.div style={fadeIn}>
              <motion.div
                className="min-w-full bg-transparent border-r-1 border-gray-200 shadow-md rounded-2xl backdrop-filter backdrop-blur-md bg-white/30 p-7"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-center text-2xl font-semibold mb-4">Welcome, {userName}!</h2>
                <p className="text-center text-gray-700">Current Date: {currentDate}</p>

                {/* <div className="mt-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">Your Progress Today:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white shadow-lg rounded-md p-4">
                      <p className="font-medium">Speaking Score:</p>
                      <p className="text-lg text-blue-600">{dailyScores.speaking_score}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-md p-4">
                      <p className="font-medium">Listening Score:</p>
                      <p className="text-lg text-green-600">{dailyScores.listening_score}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-md p-4">
                      <p className="font-medium">Reading Score:</p>
                      <p className="text-lg text-purple-600">{dailyScores.reading_score}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-md p-4">
                      <p className="font-medium">Writing Score:</p>
                      <p className="text-lg text-red-600">{dailyScores.writing_score}</p>
                    </div>
                  </div>
                </div> */}
              </motion.div>
            </animated.div>
          )}

          <div className="m-6">
            <Outlet /> {/* This renders the child components */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserHomepage;











