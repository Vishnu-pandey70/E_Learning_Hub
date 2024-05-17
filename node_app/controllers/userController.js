const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Users = require('./User');
const Course = require('./Course');
const Lecture = require('./Lecture');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');

let genratedOTP = 'acbddd';
let optemail='dshdsuef@gmail.com'
let otpExpired = false;

exports.signup = async (req, res) => {
  const { username, password, email, mobile, role, otp, isClicked} = req.body;
  if (!username || !password || !email || !mobile || !role) {
    return res.status(400).send({ message: 'All fields are required.' });
  }
  if(!isClicked) return res.status(400).send({ message: 'Please Verify Email !!' });
  if(!otp) return res.status(400).send({ message: 'All fields are required.' });
  
  if (username.length < 3) {
    return res.status(400).send({ message: 'Username must be at least 3 characters long.' });
  }
  
  if (!/^[a-zA-Z\s]+$/.test(username)) {
    return res.status(400).send({ message: 'Username can only contain alphabetic characters ' });
  }
  
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).send({ message: 'Invalid email format.' });
  }
  
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password)) {
    return res.status(400).send({ message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.' });
  }

  if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
    return res.status(400).send({ message: 'Mobile number must be a 10-digit numeric value.' });
  }
  if(optemail!==email)  return res.status(400).send({ message: 'Email Mismatch !!' });
  if(genratedOTP!==otp) return res.status(400).send({ message: 'Wrong Verification Code !!' });
  if(otpExpired) return res.status(400).send({ message: 'Verification Code Expired !!' }); 
  
  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({ username, password: hashedPassword, email, mobile, role });
    genratedOTP = null;
    res.send({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).send({ message: 'Server error' });
  }
};

exports.search = async (req,res) => {
  try {
    const { q } = req.query; 
    const query = { title: { $regex: q, $options: "i" } };
    // console.log(query)
    const courses = await Course.find(query);
    // console.log(courses)

    return res.status(200).json(courses);
  } catch (error) {
      console.error('Error searching courses:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required.' });
  }

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: 'Password incorrect.' });
    }
    const tokenPayload = {
      userId: user._id, 
    };
    const token = jwt.sign(tokenPayload, 'SECRET_KEY', { expiresIn: '24h' });
    res.send({ message: 'Login successful.', token, userId: user._id });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send({ message: 'Server error' });
  }
};

const sendMail = async (otp,email) => {

  // console.log("OTP  _>",otp)
  
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'elearninghub7905@gmail.com',
      pass: 'wjke qsrd kact dcrc'
    }
  });
  
  let mailOptions = {
    from: '"E Learning Hub" elearninghub7905@gmail.com',
    to: email,
    subject: 'E-Mail Verification For E-Learning Hub',
    html: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
        </head>

        <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; text-align: center; padding: 20px;">

          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

            <h2 style="color: #007bff;">OTP Verification</h2>

            <p style="color: #495057;">Dear User,</p>

            <p style="color: #495057;">Your OTP for verification is: <strong style="color: #007bff;">${otp}</strong></p>

            <p style="color: #495057;">This OTP is valid for 10 minutes only. Please do not share it with anyone.</p>

            <p style="color: #495057;">Thank you for using our service!</p>

            <hr style="border: 1px solid #007bff;">

            <p style="color: #868e96; font-size: 12px;">This email is autogenerated. Please do not reply.</p>

          </div>

        </body>

        </html>
      `
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      // console.log(error);
      optemail = email
      otpExpired = false
    } else {
      // console.log('Email sent: ');
      // console.log(info)
    }
  });
}


exports.sendOtp = async (req,res) => {
  const {email} = req.body;
  // console.log(email)
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).send({ message: 'Invalid Email Format.' });
  }
  try {
    function generateOTP() {
      const digits = '0123456789';
      let OTP = '';
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      return OTP;
    }
    const genOtp = generateOTP();
    sendMail(genOtp,email)
    genratedOTP = genOtp
    otpExpired = false
    setTimeout(()=>{
      otpExpired = true;
      // genratedOTP = generateOTP()
    },2 * 60 * 1000)
    optemail=email
    // console.log(genratedOTP)
    return res.status(200).json({ success : true, message: 'Verification Code Sent Successfully'});
  } catch (error) {
    // console.error('Error sending OTP:', error);
    return res.status(500).json({ success : false, message: 'Failed to send OTP' });
  }
}

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).send({ message: 'All fields are required.' });
  }
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(newPassword)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.' });
    }

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    if(optemail!==email)  return res.status(400).send({ message: 'Email not match on that otp sent !!' });
  
    if(genratedOTP!==otp) return res.status(400).send({ message: 'Wrong Verification Code !!' });
    if(otpExpired) return res.status(400).send({ message: 'Verification Code Expired !!' }); 
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ success : true, message: 'Password Reset successfully.'});
  } 
  catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ success : false, message: 'Failed To Reset Password' });
  }
};




exports.getUserById = async (req, res) => {
  const userId = req.params.userId;
  const usertokenId = req.user.userId;
  if (userId !== usertokenId) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }
  
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.editProfile = async (req, res) => {
  const userId = req.params.userId;
  const usertokenId = req.user.userId;
  const { username, mobile, email } = req.body;

  // Validation checks
  if (!username || !mobile || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
  }

  if (!/^[a-zA-Z\s]+$/.test(username)) {
    return res.status(400).send({ message: 'Username can only contain alphabetic characters ' });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  
  if (userId !== usertokenId) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }

  try {
    // Check if the email already exists for another user
    const existingUserWithEmail = await Users.findOne({ email });
    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
      return res.status(400).json({ message: 'Email is already in use by another user.' });
    }

    const updatedUser = await Users.findByIdAndUpdate(userId, { username, mobile, email }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error editing profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Error getting all courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyCourses = async (req, res) => {
  const userId = req.user.userId;
  // console.log("userid",userId)
  try {
    const user = await Users.findById(userId).populate('courses');
    res.json(user.courses);
  } catch (error) {
    console.error('Error getting user courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getcreatedCourses = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await Users.findById(userId).populate('createdcourse');
    res.json(user.createdcourse);
  } catch (error) {
    console.error('Error getting user courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getCourseContent = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId).populate('lectureIds');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error getting course content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSingleCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error getting course content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addLecture = async (req, res) => {
  const { title, video, notes, assignment } = req.body;
  // console.log(req.body);

  if (!title || !video || !notes|| !assignment) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const lecture = await Lecture.create({ title, video, notes, assignment });

    res.status(201).json({ message: 'Lecture added successfully.', lecture });
  } catch (error) {
    console.error('Error adding lecture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLecture = async (req, res) => {
  const { lectureId } = req.params;
  const { title, video, notes, assignment } = req.body;

  // if (!title || !video || !notes|| !assignment) {
  //   return res.status(400).json({ message: 'All fields are required.' });
  // }

  try {
    if (!lectureId) {
      return res.status(400).json({ message: 'Lecture ID is required for updating a lecture.' });
    }
    const lecture = await Lecture.findByIdAndUpdate(lectureId, { title, video, notes, assignment }, { new: true });
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found.' });
    }

    res.status(200).json({ message: 'Lecture updated successfully', lecture });
  } catch (error) {
    console.error('Error updating lecture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.addCourseProgress = async (req, res) => {
  const { lectureId } = req.body;

  if (!lectureId) {
    return res.status(400).json({ message: 'Lecture ID is required.' });
  }

  const userId = req.user.userId;

  try {
    await Users.findByIdAndUpdate(userId, { $addToSet: { completedLectures: lectureId } });
    const updatedLecture = await Lecture.findById(lectureId);
    res.status(201).json({ success: true, lecture: updatedLecture, message: 'Course progress added successfully.' });
  } catch (error) {
    console.error('Error adding course progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCompletedLectures = async (req,res) => {
  try {
    const userId = req.user.userId;
    const user = await Users.findById(userId).populate('completedLectures');

    // Extract the completed lectures from the user object
    const completedLectures = user.completedLectures;

    res.json({ success: true, completedLectures });
  } catch (error) {
    console.error('Error fetching completed lectures:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch completed lectures' });
  }
}


exports.addCourse = async (req, res) => {
  const { title, description, price, mentor, image, lectureIds } = req.body;
  const userId = req.user.userId;

  if (!title || !description || !price || !mentor || !image || !lectureIds) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const course = await Course.create({ title, description, price, mentor, image, lectureIds });
    const user = await Users.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Not Admin' });
    }

    user.createdcourse.push(course._id);
    await user.save();

    res.status(201).json({ message: 'Course added successfully.', course });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCertificate = async(req,res) => {
  const userId = req.user.userId;
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId).populate('lectureIds')
    const user = await Users.findById(userId).populate('completedLectures')
    // console.log(course,"   AND   ",user)
    // console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const courseExists = user.courses.includes(courseId);
    if(!courseExists || !Course) return res.status(404).json({ message: 'Course not found' });

    const findCommonDocuments = (array1, array2) => {
      // console.log("1-> ",array1)
      // console.log("2-> ",array2)
      const commonDocuments = [];
      if(!array1 || !array2) return commonDocuments;
      array1.forEach(docA => {
        // console.log('tis sis',docA._id.toString())
        const foundDoc = array2.find(docB => docB._id.toString() === docA._id.toString());
        if (foundDoc) {
          commonDocuments.push(foundDoc._id);
        }
      });
      return commonDocuments;
    };
    // console.log("fjsdfjkfk",user.completedLectures, course.lectureIds)
    const commonDocuments = findCommonDocuments(user.completedLectures, course.lectureIds);
    // console.log("CMN",commonDocuments.length,course.lectureIds.length)
    const progress = commonDocuments.length/course.lectureIds.length;
    if(progress!=1) return res.status(404).json({ message: 'Certificate Not Found' });
        
    // console.log(course.title)
    return res.status(201).json({ success : true, message : 'You are Elligible.', "username" : user.username, "coursename" : course.title});
  } catch (error) {
    console.error('Error adding course:', error);
    return res.status(500).json({ message: 'Server error' });
  }


}



exports.saveFeedback = async (req, res) => {
  const { courseId } = req.params;
  const { rating, feedback } = req.body;
  const userId = req.user.userId;
  if (!feedback || feedback.length < 5) {
    return res.status(400).json({ message: 'Feedback must not be empty and must contain at least 5 characters.' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existingFeedbackIndex = course.feedbacks.findIndex(fb => fb.user.toString() === userId);
    const currentDate = new Date();
    if (existingFeedbackIndex !== -1) {
      course.feedbacks[existingFeedbackIndex].rating = rating;
      course.feedbacks[existingFeedbackIndex].feedback = feedback;
      course.feedbacks[existingFeedbackIndex].createdAt = currentDate;
    } else {
      course.feedbacks.push({
        user: userId,
        rating,
        feedback
      });
    }

    await course.save();

    res.json({ message: 'Feedback saved successfully', course });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.showFeedback = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId).populate('feedbacks.user');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const feedbacks = course.feedbacks;
    res.json({ feedbacks });
  } catch (error) {
    console.error('Error fetching ratings and comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




exports.getCreatedcourseById = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.userId; 
  try {
    const course = await Course.findById(courseId).populate('lectureIds');
    // console.log(course)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userCreatedCourseIds = user.createdcourse.map(course => course.toString());
    if (!userCreatedCourseIds.includes(courseId)) {
      return res.status(403).json({ message: 'You are not authorized to access this course' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.editCourse = async (req, res) => {
  const { courseId } = req.params; 

  const { title, description, price, mentor, image, lectureIds } = req.body;
  console.log(price);
  console.log(typeof price);
  const userId = req.user.userId; 

  if (!title || !description || !price || !mentor || !image || !lectureIds) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  
  try {
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userCreatedCourse = user.createdcourse.map(course => course.toString());
    if (!userCreatedCourse.includes(courseId)) {
      return res.status(403).json({ message: 'You are not authorized to edit this course' });
    }
    const updatedCourse = await Course.findByIdAndUpdate(courseId, { title, description, price, mentor, image, lectureIds }, { new: true });

    res.send({ message: 'Course updated successfully.', course: updatedCourse });
  } 
  
  catch (error) {
    console.error('Error updating course:', error);
    res.status(500).send({ message: 'Server error' });
  }
};

exports.deleteCourse=async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.userId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if(user.role!=='admin'){
      return res.status(404).json({ message: 'Not Admin' });
    }

    await Course.findByIdAndDelete(courseId);
    res.json({ message: 'Course deleted successfully' });
  } 
  catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

