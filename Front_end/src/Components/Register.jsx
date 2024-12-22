import React, { useState } from 'react'; // Ensure React is imported
import { useNavigate } from 'react-router-dom'; // Ensure react-router-dom is installed

const Register = () => {
  const navigate = useNavigate();

  // State variables for form inputs and messages
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Form validation before submitting
  const validateForm = () => {
    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return false;
    }
    return true;
  };

  const handleRegisterClick = async () => {
    // Ensure the form is valid
    if (!validateForm()) return;
  
    setIsLoading(true); // Start loading
    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the JSON object as required by the backend
        body: JSON.stringify({
          name: username,  // Map 'username' input to 'name' key
          email: email,
          password: password,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setSuccess('User registered successfully!'); // Display success message
        setError('');
        // Reset the form
        setUsername('');
        setEmail('');
        setPassword('');
        navigate('/');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
        setSuccess('');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setSuccess('');
    } finally {
      setIsLoading(false); 
    }
  };
  
  

  return (
    <div className="flex h-screen w-screen p-0">
      <div className="flex w-full h-full p-0">
        <div className="w-full flex items-center justify-center">
          <main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
            <section className="flex w-[30rem] flex-col space-y-10">
              <div className="text-center text-4xl font-medium">Create Account</div>

              {/* Username Input */}
              <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
                />
              </div>

              {/* Email Input */}
              <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
                />
              </div>

              {/* Password Input */}
              <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
                />
              </div>

              {/* Error and Success Messages */}
              {error && <p className="text-red-500 text-center">{error}</p>}
              {success && <p className="text-green-500 text-center">{success}</p>}

              {/* Register Button */}
              <button
                className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
                onClick={handleRegisterClick}
              >
                {isLoading ? 'Loading...' : 'REGISTER'}
              </button>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Register;


