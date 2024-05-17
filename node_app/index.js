const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const userController = require('./controllers/userController');
const authMiddleware = require('./middleware/authMiddleware');
// const seed = require("./seed")
const multer = require('multer');
// const PdfDetail = require('./controllers/PdfDetail');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const Users = require('./controllers/User');
const Course = require('./controllers/Course');

const app = express();
const port = 5000;

app.use("/files", express.static("files"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

// seed()

mongoose.connect('mongodb://127.0.0.1:27017/E-Learning-Hub', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./files");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uuidv4()+".pdf");
    },
  });

  const upload = multer({storage : storage})

  app.post("/upload-files", upload.single("file"), async (req, res) => {
    try {
      // console.log(req.file);
      const title = req.body.title;
      const fileName = req.file.filename;
      // await PdfDetail.create({ title: title, pdf: fileName });
      res.send({ status: "ok", "filename" : fileName });
    } catch (error) {
      // console.error("Error uploading file:", error);
      res.status(500).json({ status: "error", message: "Failed to upload file" });
    }
  });
  


// Routes
app.post('/signup', userController.signup);
app.post('/login', userController.login);
app.get('/search', userController.search);
app.get('/user/:userId', authMiddleware.verifyToken, userController.getUserById);
app.put('/user/:userId', authMiddleware.verifyToken, userController.editProfile);

app.post('/add-course',authMiddleware.verifyToken, userController.addCourse);
app.post('/send-otp',userController.sendOtp);
app.post('/forgotpassword', userController.resetPassword);

app.get('/certificate/:courseId',authMiddleware.verifyToken, userController.getCertificate);
app.post('/add-lecture',authMiddleware.verifyToken, userController.addLecture);
app.post('/update-lecture/:lectureId',authMiddleware.verifyToken, userController.updateLecture);

app.get('/courses', userController.getAllCourses);
// app.post('/enroll-course/:courseId', authMiddleware.verifyToken, userController.enrollCourse);
app.get('/my-courses', authMiddleware.verifyToken, userController.getMyCourses);
app.get('/created-courses', authMiddleware.verifyToken, userController.getcreatedCourses);
app.post('/add-course-progress', authMiddleware.verifyToken, userController.addCourseProgress);
app.get('/completed-lectures',authMiddleware.verifyToken, userController.getCompletedLectures);

app.get('/my-courses/:courseId', userController.getCourseContent);
app.get('/single-course/:courseId', userController.getSingleCourse);

app.get('/courses/:courseId/feedback',userController.showFeedback);
app.post('/my-courses/:courseId/feedback', authMiddleware.verifyToken, userController.saveFeedback);


app.get('/edit-course/:courseId', authMiddleware.verifyToken, userController.getCreatedcourseById);

app.put('/edit-course/:courseId', authMiddleware.verifyToken, userController.editCourse);

app.delete('/delete-course/:courseId',authMiddleware.verifyToken, userController.deleteCourse);




const razorpay = new Razorpay({
  key_id: process.env.key,
	key_secret: process.env.key_secret
});


app.post('/razorpay/payment',authMiddleware.verifyToken, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.userId;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const amount = course.price * 100; // Converting to paise (Indian currency)
    console.log(typeof amount);
    console.log(amount);

    if (amount === 0) {
      try {
        const user = await Users.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        if (user.courses.includes(courseId)) {
          return res.status(400).json({ message: 'You are already enrolled in this course.' });
        }
        user.courses.push(courseId);
        await user.save();
    
        return res.status(200).json({ message: 'Course enrolled successfully.' });
      } catch (error) {
        console.error('Error enrolling course:', error);
        return res.status(500).json({ message: 'Failed to enroll course. Please try again later.' });
      }
    }


    const options = {
      amount: amount,
      currency: 'INR',
      receipt: 'ankitdwivedi36307@gmail.com',
      payment_capture: 1,
    };

    razorpay.orders.create(options, async (err, order) => {
      if (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({ success: false, msg: 'Something went wrong!' });
      }
      
      res.status(200).send({
        success: true,
        msg: 'Order Created',
        order_id: order.id,
        amount: amount,
        key_id: process.env.key,
        course_name: course.title,
        description: course.description,
        contact: user.mobile,
        name: user.username,
        email: user.email
      });
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ success: false, msg: 'Failed to create payment. Please try again later.' });
  }
});

app.post('/razorpay/payment/success', authMiddleware.verifyToken, async (req, res) => {
  const { courseId, orderId, paymentId } = req.body;
  const userId = req.user.userId;

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    // console.log(payment);

    if (payment.status === 'captured') {
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.courses.includes(courseId)) {
        return res.status(400).json({ message: 'You are already enrolled in this course.' });
      }
      user.courses.push(courseId);
      await user.save();
  
      res.json({ message: 'Course enrolled successfully.' });
    } 
  } catch (error) {
    console.error('Error handling payment success:', error);
    res.status(500).json({ message: 'Failed to process payment. Please try again later.' });
  }
});


