import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get('http://localhost:5000/courses');
        setCourses(response.data);
      }  catch (error) {
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
        } catch (error) {
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
    // console.log('Razorpay script loaded successfully');
  };

  const handleZeroPrice = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/razorpay/payment`, { courseId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setEnrolledCourses([...enrolledCourses, courseId]);
        toast.success('Course enrolled successfully!', { toastId: 'enrollSuccess' });
      } else {
        toast.error('Failed to enroll in the course. Please try again later.', { toastId: 'enrollError' });
      }
    } catch (error) {
      console.error('Error enrolling for free course:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, { toastId: 'enrollError' });
      } else {
        toast.error('Failed to enroll in the course. Please try again later.', { toastId: 'enrollError' });
      }
    }
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

  const [query, setQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/search?q=${query}`);
                setSearchResult(response.data);
            } catch (error) {
                console.error('Error searching:', error);
                setSearchResult([]);
            }
        };

        if (query !== '') {
            fetchData();
        } else {
            setSearchResult([]);
        }
    }, [query]);

    useEffect(() => {
        if (query === '') {
            setSearchResult([]);
        }
    }, [query]);

    return (
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-md-6">
            <h2 className="mt-3 ">
              {query === '' ? (
                <h2 className="mt-3 mb-2">All Courses</h2>
              ) : searchResult.length !== 0 ? (
                <h2 className="mt-3 mb-2">Found Courses ..</h2>
              ) : ''
              }
            </h2>
          </div>

          <div className="col-md-6 mt-3">
          <div className="w-100 mb-4 form-outline" style={{ minWidth: '200px', border: '1px solid #808080', borderRadius: '0.25rem' }}>
              <input
                type="search"
                value={query}
                onChange={handleSearch}
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Search Course ..."
              />
            </div>
          </div>
        </div>
        <ToastContainer />

        {query !== '' && searchResult.length === 0 && (
  <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
    <h3 className='text-danger'>No Course Found !!</h3>
  </div>
)}


      <div className="row row-cols-1 row-cols-md-3 g-4">
        {query==='' && courses.map((course) => (
        
          <div className="col" key={course._id}>
            <div className="card h-100">
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
                    <p className="card-price mb-0">
                      <button className="btn btn-warning">{course.price} ₹</button>
                    </p>
                  </div>
                </div>
                <div className="d-flex mt-3 justify-content-between">
                
                {enrolledCourses.includes(course._id) ? (
                  <button className="btn btn-success me-2" onClick={() => toast.error("Course Already Enrolled !!")}>Enrolled</button>
                ) : course.price === 0 ? (
                  <button className="btn btn-secondary me-2" onClick={() => handleZeroPrice(course._id)}>
                    Enroll for Free
                  </button>
                ) : (
                  <button className="btn btn-secondary me-2" onClick={() => handleEnrollCourse(course._id)}>
                    Enroll
                  </button>
                )}

                  <Link to={`/courses/${course._id}/feedback`}>
                    <button className="btn btn-primary">Explore</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        {query!=='' && searchResult.map((course) => (
        
        <div className="col" key={course._id}>
          <div className="card h-100">
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
                  <p className="card-price mb-0">
                    <button className="btn btn-warning">{course.price} ₹</button>
                  </p>
                </div>
              </div>
              <div className="d-flex mt-3 justify-content-between">
                {enrolledCourses.includes(course._id) ? (
                  <button className="btn btn-success me-2" onClick={()=>toast.error("Course Already Enrolled !!")}>Enrolled</button>
                ) : (
                  <button className="btn btn-secondary me-2" onClick={() => handleEnrollCourse(course._id)}>
                    Enroll
                  </button>
                )}
                <Link to={`/courses/${course._id}/feedback`}>
                  <button className="btn btn-primary">Explore</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

export default AllCourses;
