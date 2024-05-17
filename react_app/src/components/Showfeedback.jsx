import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ShowFeedback() {
  const { courseId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const courseResponse = await axios.get(`http://localhost:5000/single-course/${courseId}`);
        setCourse(courseResponse.data);

        const feedbackResponse = await axios.get(`http://localhost:5000/courses/${courseId}/feedback`);
        const sortedFeedbacks = feedbackResponse.data.feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFeedbacks(sortedFeedbacks);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage, { toastId: 'fetchDataError' });
        } else {
          toast.error('Failed to fetch data. Please try again later.', { toastId: 'fetchDataError' });
        }
      }
    };
    fetchData();
  }, [courseId]);

  return (
    <div className="container py-4">
      <ToastContainer />
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{course && course.title}</h5>
              <div className="image-container" style={{ height: '350px', overflow: 'hidden' }}>
                <img src={course && course.image} className="card-img-top" alt={course && course.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              </div>
              <p className="card-text">{course && course.description}</p>
              <p className="card-text"><strong>Mentor:</strong> {course && course.mentor}</p>
              <p className="card-text"><strong>Total Lectures:</strong> {course && course.lectureIds.length}</p>
              <p className="card-text"><strong>Price:</strong> {course && course.price ? `$${course.price}` : 'Free'}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Feedbacks</h5>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <ul className="list-group list-group-flush">
                  {feedbacks.map((feed, index) => (
                    <li key={index} className="list-group-item">
                      <div>
                        <p><strong>User:</strong> {feed.user.username}</p>
                        <p><strong>Time:</strong> {new Date(feed.createdAt).toLocaleString()}</p>
                        <p><strong>Rating:</strong> {[...Array(Math.round(feed.rating))].map((_, index) => (
    <span key={index} style={{color:'#fca503', fontSize:'1.3rem'}}>★</span>
))}</p>
                        <p><strong>Comment:</strong> {feed.feedback}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowFeedback;
