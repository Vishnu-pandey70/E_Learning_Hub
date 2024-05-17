import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = { email, password };
      const response = await axios.post('http://localhost:5000/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('Logged in successfully!', { toastId: 'loginSuccess' });
        setTimeout(() => navigate('/'), 800);
        
      }
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage, { toastId: 'loginError' });
      } else {
        toast.error('Invalid email or password. Please try again.', { toastId: 'loginError' });
      }
    }
  };
  

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="row w-100">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
        <div className="p-4 shadow rounded bg-white" style={{ minWidth: '300px', minHeight: '400px' }}>
            <h1 className="h3 mb-3 text-center">Login to your account</h1>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  />
            </div>
            <div className="mb-3">
              <button className="w-100 btn btn-primary" onClick={handleLogin}>Login</button>
            </div>
            <div className="text-center">
              <p>Don't have an account? <Link to="/signup">Signup</Link></p>
              <p><Link to="/forgotpassword">Forgot Password?</Link></p> {/* Added Forgot Password link */}
            </div>
          </div>
        </div>
          <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
            <img
              src="https://www.svgrepo.com/show/301692/login.svg"
              alt="Logo"
              className="img-fluid"
              style={{ maxWidth: '80%', height: 'auto' }}
            />
          </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;