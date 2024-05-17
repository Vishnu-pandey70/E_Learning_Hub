// MyCourses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import NotFound from './NotFound';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Createdcourse() {
  const [createdCourses, setCreatedCourses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userResponse = await axios.get(`http://localhost:5000/user/${decodedToken.userId}` , {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const userRole = userResponse.data.user.role;
          setIsAdmin(userRole === 'admin');

          const coursesResponse = await axios.get('http://localhost:5000/created-courses', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCreatedCourses(coursesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/delete-course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update the courses list after deletion
      setCreatedCourses(createdCourses.filter(course => course._id !== courseId));
      toast.success('Course deleted successfully!', { toastId: 'deleteSuccess' });
    } catch (error) {
      console.error('Error deleting course:', error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage, { toastId: 'deleteError' });
      } else if (error.request) {
        toast.error('Network error. Please check your internet connection.', { toastId: 'deleteError' });
      } else {
  
        toast.error('Failed to delete the course. Please try again later.', { toastId: 'deleteError' });
      }
    }
  };

  if (!isAdmin) {
    return <NotFound />;
  }

  return (
    <div className="container">
      <ToastContainer />
      <h2 className="mt-3 mb-4">My Added Courses</h2>
      {
          createdCourses.length==0 ? <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
          <h3 className='text-danger'>No Course Found !!</h3>
        </div> : <></>
        }
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {createdCourses.map((course) => (
          <div className="col" key={course._id}>
            <div className="card h-100">
            <div className="image-container" style={{ height: '200px', overflow: 'hidden' }}>
                <img src={course.image} className="card-img-top" alt={course.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <div className="d-flex align-items-center justify-content-between mt-auto">
    
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <button className="btn btn-success me-2">
                    <Link to={`/my-courses/${course._id}`} style={{ color: 'white', textDecoration: 'none' }}>Start</Link>
                  </button>
                  <Link to={`/edit-course/${course._id}`}>
                    <button className="btn btn-primary me-2">Edit Course</button>
                  </Link>
                  <button className="btn btn-danger" onClick={() => handleDeleteCourse(course._id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Createdcourse;
