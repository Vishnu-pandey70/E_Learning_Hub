
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Feedback.css'; // Import your CSS file

function Feedback() {
  const { courseId } = useParams();
  const [rating, setRating] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userFeedbacks, setUserFeedbacks] = useState([]); 
  async function fetchData() {
    try {
      const courseResponse = await axios.get(`http://localhost:5000/single-course/${courseId}`);
      setCourse(courseResponse.data);

      const feedbackResponse = await axios.get(`http://localhost:5000/courses/${courseId}/feedback`);
      const sortedFeedbacks = feedbackResponse.data.feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUserFeedbacks(sortedFeedbacks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage, { toastId: 'fetchError' });
      } else {
        toast.error('Failed to fetch data. Please try again later.', { toastId: 'fetchError' });
      }
    }
  }

  useEffect(() => {

    fetchData();
  }, [courseId]);

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };
 

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/my-courses/${courseId}/feedback`, { rating, feedback }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Feedback submitted successfully!', { toastId: 'feedbackSuccess' });
      setRating(1);
      setFeedback('');
      fetchData();
    
    } catch (error) {
      console.error('Error submitting feedback:', error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error('Error submitting feedback: ' + errorMessage, { toastId: 'feedbackError' });
      } else {
        toast.error('Failed to submit feedback. Please try again later.', { toastId: 'feedbackError' });
      }
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <div className="row">
        <div className="col-md-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="course-details">
              <h3 className="heading bg-primary text-white p-2">Course Details</h3>
              <h4>{course.title}</h4>
              <div className="image-container">
                <img src={course.image} alt={course.title} />
              </div>
              <p><strong>Description:</strong> {course.description}</p>
              <p><strong>Mentor:</strong> {course.mentor}</p>
              <p><strong>Total Lectures:</strong> {course.lectureIds.length}</p>
              <div className="feedbacks">
                <hr />
                <h5 className="bg-primary text-white p-2">Feedbacks</h5>
                <ul>
                  {userFeedbacks.map((feed, index) => (
                    <li key={index}>
                      <p><strong>User:</strong> {feed.user.username}</p>
                      <p><strong>Time:</strong> {new Date(feed.createdAt).toLocaleString()}</p>
                      <p><strong>Rating:</strong> {[...Array(Math.round(feed.rating))].map((_, index) => (
                        <span key={index} className="star">&#9733;</span>
                      ))}</p>
                      <p><strong>Comment:</strong> {feed.feedback}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <p><strong>Created At:</strong> {new Date(course.createdAt).toLocaleString()}</p>
              <p><strong>Last Updated At:</strong> {new Date(course.updatedAt).toLocaleString()}</p>
            </div>
          )}
        </div>
        <div className="col-md-6">
          <div className="feedback-form">
            <h3 className="bg-primary text-white p-2">Rate and Provide Feedback</h3>
            <div className="mb-3">
              <label htmlFor="rating" className="form-label">Rating:</label>
              <select id="rating" className="form-select" value={rating} onChange={handleRatingChange}>
                <option value="1">★</option>
                <option value="2">★★</option>
                <option value="3">★★★</option>
                <option value="4">★★★★</option>
                <option value="5">★★★★★</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="feedback" className="form-label">Feedback:</label>
              <textarea id="feedback" className="form-control" value={feedback} onChange={handleFeedbackChange}></textarea>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;

