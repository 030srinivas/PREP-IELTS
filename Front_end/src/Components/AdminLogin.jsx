import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login_nav from './Login_nav';
import logo from '../assets/img1.jpg';

function AdminLogin() {
  const navigate = useNavigate();
  
  // State to capture form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async () => {
    try {
      // Send login request to the server
      const response = await fetch('http://127.0.0.1:5000/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to the Admin Homepage after successful login
        navigate('/adminhomepage', { state: { adminId: data.admin_id } });
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      {/* Mobile Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0 md:hidden"
        style={{ backgroundImage: `url(${logo})` }}
      ></div>

      {/* Login Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-start bg-black bg-opacity-60 md:bg-opacity-90 p-4 z-10">
        <div className="mb-4 md:mb-8">
          <Login_nav />
        </div>

        <div className="flex flex-grow items-center justify-center">
          <main className="flex w-full max-w-md items-center justify-center bg-transparent text-white px-4 py-8 rounded-lg shadow-lg backdrop-blur-md">
            <section className="flex w-full flex-col space-y-6 md:space-y-10">
              <div className="text-center text-3xl md:text-4xl font-bold">Admin Log In</div>

              {/* Email Input */}
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Password Input */}
              <div className="w-full">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-center">{error}</p>}

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className="w-full transform rounded-md bg-indigo-600 py-3 font-bold text-white transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                LOG IN
              </button>

              {/* Forgot Password */}
              <a
                href="#"
                className="transform text-center font-semibold text-gray-500 duration-300 hover:text-gray-300"
              >
                FORGOT PASSWORD?
              </a>
            </section>
          </main>
        </div>
      </div>

      {/* Desktop Background Image */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        <img src={logo} alt="Logo" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

export default AdminLogin;




