import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from "./components/Signup";
import AddCourse from "./components/AddCourse";
import Course from './components/Course'; 
import EditProfile from "./components/EditProfile";
import MyCourses from "./components/MyCourse";
import ShowContent from "./components/ShowContent";
import NotFound from "./components/NotFound";
import ShowFeedback from "./components/Showfeedback";
import Feedback from "./components/Feedback";
import Createdcourse from "./components/Createdcourse";
import EditCourse from "./components/EditCourse";
import Certificate from "./components/Certificate";
import Contact from "./components/Contact";
import ForgotPassword from "./components/Forgotpassword";


function App() {
   
    return (
        <Router>
            <Header/>
            
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About />}/>
                <Route path="/contact" element={<Contact />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup/>} /> 
                <Route path="/add-course" element={<AddCourse/>} /> 
 
            
                <Route path="/courses" element={<Course/>} />  
                <Route path="/my-courses" element={<MyCourses/>} /> 
                <Route path="/edit-profile/:userId" element={<EditProfile />} />
                <Route path="/my-courses/:courseId" element={<ShowContent/>} />
                <Route path="/courses/:courseId/feedback" element={<ShowFeedback/>} />
                <Route path="/my-courses/:courseId/feedback" element={<Feedback/>} />

                <Route path ="/created-courses" element ={<Createdcourse/>}/>

                <Route path="/edit-course/:courseId" element={<EditCourse/>} />
                <Route path="/certificate/:courseId" element={<Certificate/>} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
