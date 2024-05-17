// MyCourses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyCourses() {
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    async function fetchMyCourses() {
      try {
        const response = await axios.get('http://localhost:5000/my-courses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log("Response->",response)
        setMyCourses(response.data);
      } 
      catch (error) {
        console.error('Error fetching my courses:', error);
        if (error.response) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage, { toastId: 'fetchCoursesError' });
        } else {
          toast.error('Failed to fetch your courses. Please try again later.', { toastId: 'fetchCoursesError' });
        }
      }
    };


    fetchMyCourses();
  }, []);

  return (
    <div className="container">
      <ToastContainer />
      <h2 className="mt-3 mb-4">MY Courses</h2>
      {myCourses.length === 0 ? (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
          <h3 className='text-danger'>No Course Available !!</h3>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {myCourses.map((course) => (
            <div className="col" key={course._id}>
              <div className="card h-100">
              <div className="image-container" style={{ height: '200px', overflow: 'hidden' }}>
                <img src={course.image} className="card-img-top" alt={course.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <div className="d-flex align-items-center justify-content-between mt-auto">
                    {/* <div className="rating me-3">
                      {[...Array(Math.round(course.rating))].map((_, index) => (
                        <span key={index}>★</span>
                      ))}
                    </div> */}
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-success me-2">
                      <Link to={`/my-courses/${course._id}`} style={{ color: 'white', textDecoration: 'none' }}>Start</Link>
                    </button>
                    <Link to={`/my-courses/${course._id}/feedback`}>
                      <button className="btn btn-primary">Explore</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}

export default MyCourses;