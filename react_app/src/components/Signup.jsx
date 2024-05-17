import React, { useState,} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('student'); 
  const [giveOTP,setGiveOTP] = useState('false')
  const [otp,setOtp] = useState('');
  const [loader,setLoader] = useState(false)
  const [isClicked,setIsClicked] = useState(false)



  const handleSignup = async () => {
    try {
      const data = { username, password, email, mobile, role, otp,isClicked };
      await axios.post('http://localhost:5000/signup', data);
      toast.success('User registered successfully!', { toastId: 'signupSuccess' });
      setTimeout(() => navigate('/login'), 800);
      // setGiveOTP(false)
    } catch (error) {
      console.log('Error signing up:', error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage, { toastId: 'signupError' });
      } else {
        // console.log(error)
        toast.error('Failed to register user. Please try again later.', { toastId: 'signupError' });
      }
    }
  };



  const sendEmail = async () => {
    // Assuming your backend route to send OTP is '/send-otp'
    setLoader(true)
    setIsClicked(true)
    await axios.post('http://localhost:5000/send-otp',{email})
      .then(response => {
        toast.success('OTP Sent Successfully')
        setGiveOTP(true)

      })
      .catch(error => {
        toast.error(error.response.data.message)
      });
      setLoader(false)
  };

  // console.log(giveOTP)
  

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-md-6 bg-primary d-flex justify-content-center align-items-center">
          <img
            src="https://www.svgrepo.com/show/301692/login.svg"
            alt="Logo"
            className="img-fluid mx-auto d-block"
            style={{ width: '150px' }}
          />
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="p-4 shadow rounded bg-light">
            <h1 className="h3 mb-3 text-center">Create a new account</h1>
            <div className="mb-2">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" placeholder="Name" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              
              {
                loader===false? <div className='d-flex justify-content-end'>
                    <button className="btn btn-secondary mt-2 position-relative end-0" onClick={sendEmail}>Send OTP</button>
                  </div> : <div className='d-flex justify-content-end'>
                    <button className="btn btn-secondary mt-2 position-relative end-0">Sending..</button>
                  </div>
              }
              
            </div>

            {
             giveOTP===true &&  <div className="mb-2">
                <label htmlFor="otp" className="form-label">OTP</label>
                <input type="otp" className="form-control" id="otp" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)}  required />
              </div>
            }

            <div className="mb-2">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="form-label">Mobile</label>
              <input type="number" className="form-control" id="mobile" placeholder="Contact number" value={mobile} onChange={(e) => setMobile(e.target.value)}  required />
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select className="form-select" id="role" value={role} onChange={(e) => setRole(e.target.value)}> 
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="mb-3">
              <button className="w-100 btn btn-primary" onClick={handleSignup} >Create account</button>
            </div>
            <div className="text-center">
              <p>Or <Link to="/login">login to your account</Link></p>
            </div>
  </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
