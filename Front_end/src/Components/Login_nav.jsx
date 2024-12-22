import { Link } from 'react-router-dom';
function Login_nav() {
  return (
    <>
    <p className="text-center text-lg justify-start">
      <Link to="/" className="font-medium text-indigo-500 underline-offset-4 hover:underline">
        User Login
      </Link>
      <span className="mx-4">|</span> 
      <Link to="/adminlogin" className="font-medium text-indigo-500 underline-offset-4 hover:underline">
        Admin Login
      </Link>
    </p>
     </>
  );
}

export default Login_nav;

