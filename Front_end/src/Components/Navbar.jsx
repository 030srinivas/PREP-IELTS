import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleLogout = () => {
    try {
      // Clear user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
    
      // Redirect to the login page
      navigate('/');
    } catch (err) {
      console.error('An error occurred during logout:', err);
    }
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="bg-gray-800 text-white md:hidden flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={toggleMobileNav} className="text-white">
          {/* 3-dot icon for mobile */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Sidebar (Shows or hides based on the mobile nav state) */}
      <aside
        className={`bg-gray-800 text-white w-64 pb-15 ${isMobileNavOpen ? "block" : "hidden"} md:block`}
      >
        <ul>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/userhomepage" className="block">Home</Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/userhomepage/speaking" className="block w-full text-left">Speaking</Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/userhomepage/reading" className="text-white hover:text-gray-300">Reading</Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/userhomepage/listening" className="text-white hover:text-gray-300">Listening</Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/userhomepage/writing" className="text-white hover:text-gray-300">Writing</Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700 gap-3">
            <Link to="/userhomepage/dashboard" className="text-white hover:text-gray-300">Dashboard</Link>
          </li>
        </ul>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;




