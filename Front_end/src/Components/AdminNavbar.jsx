import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleLogout = () => {
    // Clear any authentication state here (if applicable)
    // Example: localStorage.removeItem("adminToken");

    // Navigate back to the Admin Login page
    navigate('/adminlogin');
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="bg-gray-800 text-white md:hidden flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={toggleMobileNav} className="text-white">
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

      <aside
        className={`bg-gray-800 text-white w-64 pb-15 ${isMobileNavOpen ? "block" : "hidden"} md:block`}
      >
        <ul>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/adminhomepage" className="block">Home</Link>
          </li>
          <li className="py-2 px-4 hover:bg-gray-700">
            <Link to="/adminhomepage/admin_view_question" className="block">View Questions</Link>
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

export default AdminNavbar;
