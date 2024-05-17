// ForgotPassword.js
import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [giveOTP,setGiveOTP] = useState('false')
  const [newPassword, setNewPassword] = useState('');

  const handleSendOTP = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { email });
      if (response.data.success) {
        toast.success('OTP sent successfully!', { toastId: 'otpSent' });
        setGiveOTP(true);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error.response) {
        toast.error(error.response.data.message, { toastId: 'otpError' });
      } else {
        toast.error('Failed to send OTP. Please try again.', { toastId: 'otpError' });
      }
    }
  };
  
  const handleResetPassword = async () => {
    try {
      const response = await axios.post('http://localhost:5000/forgotpassword', { email, otp, newPassword });
      if (response.data.success) {
        toast.success('Password reset successfully!', { toastId: 'passwordReset' });
        setTimeout(() => navigate('/login'), 800);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error.response) {
        toast.error(error.response.data.message, { toastId: 'passwordResetError' });
      } else {
        toast.error('Failed to reset password. Please try again.', { toastId: 'passwordResetError' });
      }
    }
  };
  

  return (
    <div className="container py-5">
   
      <div className="row justify-content-center">
      <div className="col-md-6 d-none d-md-block" style={{ background: `url('https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1095.jpg?w=740&t=st=1715008855~exp=1715009455~hmac=ae4aab3bd84893dac4231097524aa80ddeecc41416fd6f020b5451f5c3afc030')`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
        </div>

      <div className="col-md-6">
      <h2 className="text-center mb-4">Forgot Password</h2>
      <div className="mb-3">
        <label htmlFor="email">Email</label>
        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={handleSendOTP}>Send OTP</button>
      </div>
      {giveOTP===true && (
        <div className="mb-3">
          <label htmlFor="otp">OTP</label>
          <input type="text" className="form-control" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
        </div>
      )}
      {giveOTP===true && (
        <div className="mb-3">
          <label htmlFor="newPassword">New Password</label>
          <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
      )}
      {giveOTP===true && (
        <div className="mb-3">
          <button className="btn btn-primary" onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
      <ToastContainer />
    </div>
    </div>
    </div>
  );
}

export default ForgotPassword;
