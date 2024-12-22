import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import AdminLogin from './Components/AdminLogin';
import UserHomepage from './Components/UserHomepage';
import Speaking from './Components/Speaking';
import Reading from './Components/Reading';
import Listening from './Components/Lestening';
import Writing from './Components/Writing';
import Dashboard from './Components/Dashboard';
import AdminHomepage from './Components/AdminHomepage'; 
import AdminViewQuestions from './Components/AdminViewQuestions';

const userId = localStorage.getItem("userId");
function App() {
  return (
    <Router>
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* Nested routes under UserHomepage */}
        <Route path="/userhomepage" element={<UserHomepage />}>
          <Route path="speaking" element={<Speaking />} />
          <Route path="reading" element={<Reading/>} />
          <Route path="listening" element={<Listening/>} />
          <Route path="writing" element={<Writing />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        
        {/* Nested routes under AdminHomepage */}
        <Route path="/adminhomepage" element={<AdminHomepage />}>
          <Route path="admin_view_question" element={<AdminViewQuestions/>} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;











