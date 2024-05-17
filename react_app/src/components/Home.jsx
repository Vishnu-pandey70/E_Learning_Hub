import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import './Home.css' 
const Home = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
  
    useEffect(() => {
      async function fetchCourses() {
        try {
          const response = await axios.get('http://localhost:5000/courses');
          setCourses(response.data);
        } 
        catch (error) {
          if (error.response) {
            const errorMessage = error.response.data.message;
            toast.error(errorMessage, { toastId: 'fetchCoursesError' });
          } else {
            toast.error('Failed to fetch courses', { toastId: 'fetchCoursesError' });
          }
        }
      }
  
      fetchCourses();
  
      const token = localStorage.getItem('token');
      if (token) {
        async function fetchEnrolledCourses() {
          try {
            const response = await axios.get('http://localhost:5000/my-courses', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setEnrolledCourses(response.data.map((course) => course._id));
          }
          catch (error) {
            if (error.response) {
              const errorMessage = error.response.data.message;
              toast.error(errorMessage, { toastId: 'fetchCoursesError' });
            } else {
              toast.error('Failed to fetch enroll courses. Please try again later.', { toastId: 'fetchCoursesError' });
            }
          }
        }
  
        fetchEnrolledCourses();
      }
    }, []);
  
    useEffect(() => {
      loadRazorpayScript();
    }, []);
  
    // Load Razorpay
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => handleRazorpayLoaded();
      document.body.appendChild(script);
    };
  
    const handleRazorpayLoaded = () => {
      console.log('Razorpay script loaded successfully');
    };
  
    const handleEnrollCourse = async (courseId) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:5000/razorpay/payment`, { courseId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const { amount, order_id, key_id, course_name, description, contact, name, email } = response.data;
  
        const options = {
          key: key_id,
          amount: amount,
          currency: 'INR',
          name: course_name,
          description: description,
          image: '/your_logo.png',
          order_id: order_id,
          handler: async function (response) {
            try {
              const paymentId = response.razorpay_payment_id;
              await axios.post(
                `http://localhost:5000/razorpay/payment/success`,
                { courseId, order_id, paymentId },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
  
              setEnrolledCourses([...enrolledCourses, courseId]);
              toast.success('Course enrolled successfully!', { toastId: 'enrollSuccess' });
            } catch (error) {
              console.error('Error handling payment success:', error);
              toast.error('Failed to enroll in the course. Please try again later.', { toastId: 'enrollError' });
            }
          },
          prefill: {
            name: name,
            email: email,
            contact: contact,
          },
          notes: {
            address: 'Your address',
          },
          theme: {
            color: '#F37254',
          },
        };
  
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error('Error enrolling course:', error);
        if (error.response) {
          toast.error(error.response.data.message, { toastId: 'fetchCoursesError' });
        } else {
          toast.error('Failed to enroll in the course. Please try again later.', { toastId: 'fetchCoursesError' });
        }
      }
    };
    const calculateAverageRating = (feedbacks) => {
      if (feedbacks.length === 0) return 0;
  
      const totalRating = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
      return totalRating / feedbacks.length;
    };


  return (

    <div className=" container-fluid ">
  <ToastContainer />
      <div className="row m-0 row justify-content-center" style={{ backgroundColor: '#f5f2eb' }}>
        <div className="col-md-5 d-flex align-items-center justify-content-center">
          <div className="p-5">
            <h1 className="text-center">Welcome to </h1> <h1 className=' text-center text-danger'> E- Learning HUB</h1>
            <p className=" mt-4">The Best Platform for 360° & 100% Skill Development.
Our cutting-edge technology, coupled with our dedication to student success, sets us apart in the industry</p>
            {/* <button className="btn btn-primary d-block mx-auto mt-4">Learn More</button> */}
            <Link className='btn btn-primary d-block mx-auto mt-4' style={{width : '200px'}} to="/about">Learn More</Link>
          </div>
        </div>
        <div className="col-md-7 d-flex align-items-center justify-content-center mt-4">
          <div>
            <img src="https://codegnan.com/wp-content/uploads/2023/05/Girl.webp" alt="First Placeholder" className="img-fluid mr-3" />
            <img src="https://codegnan.com/wp-content/uploads/2023/05/Boy.webp" alt="Second Placeholder" className="img-fluid mx-4" />
          </div>
        </div>
      </div>

    
      <div className="row mt-5 row justify-content-center">
        <div className="col-12">
          <h4 className="text-center text-danger">SPECIALITY</h4>
          <h1 className="text-center ">One Stop Online <span className='text-success'>Skill Development</span> Solution</h1>
          <p className="text-center">Our 4 Pillers for your Growth</p>
        </div>
      </div>

    
      <div className="row    justify-content-center">
        <div className="col-md-3 mb-4" >
          <div className="card  cardsh  text-center " style={{ backgroundColor: '#e8f7f5' }}>
            <img src="https://elevatifier.com/images/10%20(2).png" alt="Image 1"className=" rounded-circle mx-auto mt-3 img-thumbnail" style={{width: '80px', height: '80px', objectFit: 'cover'}} />
            <div className="card-body">
              <h5 className="card-title">Open to All</h5>
              <p className="card-text">Anyone from any domain can apply</p>
              <div className="bg-success text-white p-1 text-center mt-3">
                Globally
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card  cardsh  text-center" style={{ backgroundColor: '#fdecef' }}>
            <img src="https://elevatifier.com/images/9%20(2).png" alt="Image 1" className="rounded-circle mx-auto mt-3 img-thumbnail" style={{width: '80px', height: '80px', objectFit: 'cover'}}/>
            <div className="card-body">
              <h5 className="card-title">Certification</h5>
              <p className="card-text">Get a Certificate for your resume & portfolio</p>
              <div className="bg-danger text-white p-1 text-center mt-3">
              Downloadable
              </div>
            </div>
          </div>
        </div>


          <div className="col-md-3 mb-3">
            <div className="card  cardsh  text-center"  style={{ backgroundColor: '#eceffc' }}>
              <img src="https://elevatifier.com/images/8%20(2).png" alt="Image 1"className="rounded-circle mx-auto mt-3 img-thumbnail" style={{width: '80px', height: '80px', objectFit: 'cover'}}/>
              <div className="card-body">
                <h5 className="card-title">Life Time Access</h5>
                <p className="card-text">Nonstop learning from anywhere anytime</p>
                <div className="bg-primary text-white p-1 text-center mt-3">
                24 x 7 x 365
                </div>
              </div>
            </div>
          </div>
      
        
        <div className="col-md-3 mb-3">
          <div className="card  cardsh  text-center" style={{ backgroundColor: '#fef7e8' }}>
            <img src="https://elevatifier.com/images/7%20(2).png" alt="Image 1" className="rounded-circle mx-auto mt-3 img-thumbnail" style={{width: '80px', height: '80px', objectFit: 'cover'}} />
            <div className="card-body">
              <h5 className="card-title">Affordable Price</h5>
              <p className="card-text">Cheapest price to give learning to everone</p>
              <div className="bg-warning text-white p-1 text-center mt-3">
              From ₹49
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <div className="row  mt-4 justify-content-center">
        <div className="col-md-7 ">
        <div class="image-container1">
    <img src="https://elevatifier.com/assets/images/about-banner.jpg" alt="Section 3 Image" class="img-fluid" />
  </div>
            </div>
        <div className="col-md-5 d-flex align-items-center">
          <div>
            <h1>Best Resources at</h1>
            <h1 className='text-danger'>Cheapest Price Ever</h1>  
            <h1>for Everyone!</h1>
            <p>Elevatifier offers innovative edutech solutions, personalized learning experiences, and future-focused curriculum to empower students and teachers worldwide.</p>
            <blockquote>
              <p>&#10004; Future-focused curriculum</p>
              <p>&#10004; Tailored to your needs</p>
              <p>&#10004; Expert instructor guidance</p>
            </blockquote>
          </div>
        </div>
      </div>

      <div className="container  justify-content-center">
      <div className="text-center mb-5">
        <h4 className="mt-3 mb-4 text-danger">POPULAR COURSES</h4>
        <h1>Pick A <span className='text-success'>Course TO Get</span> Started</h1>
      </div>
      <div className="row row-cols-1 row-cols-md-4 g-4">
      {courses.filter(course => course.price > 0).slice(0, 4).map((course) => (
          <div className="col-md-3" key={course._id}>
            <div className="card  cardsh  h-100">
            <div className="image-container" style={{ height: '200px', overflow: 'hidden' }}>
                <img src={course.image} className="card-img-top" alt={course.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text flex-grow-1">{course.description}</p>
                <div className="d-flex align-items-center justify-content-between mt-auto">
                <div className="rating me-3">
                    {[...Array(Math.round(calculateAverageRating(course.feedbacks)))].map((_, index) => (
                      <span key={index} style={{color:'#fca503' , fontSize:'1.3rem'}}>★</span>
                    ))}
                  </div>
                  <div className="price-box">
                    <p className="card-price mb-0"><button className="btn btn-warning">{course.price} ₹</button></p>
                  </div>
                </div>
                            <div className="d-flex mt-3 justify-content-between">
                      {enrolledCourses.includes(course._id) ? (
                    <button className="btn btn-success me-2">Enrolled</button>
                  ) : (
                    <button className="btn btn-secondary me-2" onClick={() => handleEnrollCourse(course._id)}>
                      Enroll
                    </button>
                  )}
                  <Link to={`/courses/${course._id}/feedback`}><button className="btn btn-primary">Explore</button></Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>


    <div className="container mt-5  justify-content-center">
      <div className="row justify-content-center mt-4">
        <div className="col-md-10">
          <div className="img-containersh">
          <img src="https://elevatifier.com/assets/images/video-banner.jpg" alt="Large Image" className="img-fluid rounded-start rounded-end rounded-bottom" />
          </div>
        </div>
      </div>
    </div>


    <div className="container mt-5 justify-content-center">
      <div className="row justify-content-center">
        <div className="col-md-3 text-center mb-3">
          <div className="text-white p-3 rounded rounded-hoversh bg-highlightsh" style={{backgroundColor:'#BCEBB3'}}>
            <h3 className="text-success text-highlightsh">100+</h3>
            <p className="text-success text-highlightsh">OFFLINE STUDENTS</p>
          </div>
        </div>
        <div className="col-md-3 text-center mb-3">
          <div className="text-white p-3 rounded rounded-hoversh bg-highlightsh" style={{ backgroundColor:'#F6AF96'}}>
            <h3 className="text-danger text-highlightsh">5★</h3>
            <p className="text-danger text-highlightsh">STAR RATING</p>
          </div>
        </div>
        <div className="col-md-3 text-center mb-3">
          <div className="text-white p-3 rounded rounded-hoversh bg-highlightsh" style={{ backgroundColor:'skyblue'}}>
            <h3 className="text-primary text-highlightsh">100%</h3>
            <p className="text-primary text-highlightsh">SATISFACTION RATE</p>
          </div>
        </div>
        <div className="col-md-3 text-center">
          <div className="text-white p-3 rounded rounded-hoversh bg-highlightsh" style={{ backgroundColor:'#F1F1B1'}}>
            <h3 className="text-warning text-highlightsh">360°</h3>
            <p className="text-warning text-highlightsh">TOPICS COVERAGE</p>
          </div>
        </div>
      </div>
    </div>


    <footer className="bg-dark text-white py-4 mt-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p>Email: contact@webister.com</p>
            <p>Phone: +1234567890</p>
          </div>
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <ul className="list-inline">
              <li className="list-inline-item"><a href="#" className="text-white"><FaFacebook /></a></li>
              <li className="list-inline-item"><a href="#" className="text-white"><FaTwitter /></a></li>
              <li className="list-inline-item"><a href="#" className="text-white"><FaInstagram /></a></li>
              <li className="list-inline-item"><a href="#" className="text-white"><FaLinkedin /></a></li>
              <li className="list-inline-item"><a href="#" className="text-white"><FaWhatsapp /></a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Subscribe to Our Newsletter</h5>
            <form>
              <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder="Enter email" aria-label="Email" aria-describedby="basic-addon2" />
                <button className="btn btn-light" type="button">Subscribe</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Home;
