import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserEnrollCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/courses/enrollments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });

        setCourses(response.data.courses); 
        setLoading(false); 
      } catch (err) {
        console.error(err.response ? err.response.data : err.message); 
        setError('Error fetching course details. Please try again.'); 
        setLoading(false); 
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  console.log(courses);
  return (
    <div className="admin-courses">
      <h1>Course Enrollments</h1>
      {courses.length === 0 ? (
        <div>No courses available.</div>
      ) : (
        courses.map((course, index) => (
          <div key={index} className="course-card">
            <h2>{index+1}. {course.courseTitle}</h2>
            <p><strong>Description:</strong> {course.courseDescription}</p>
            <p><strong>Price:</strong> ₹{course.coursePrice}</p>
            <p><strong>Mentor:</strong> {course.mentor}</p>
            <p><strong>Enrolled Users:</strong> {course.enrolledUsersCount}</p>

            {course.enrolledUsersCount > 0 ? (
              <div className="enrolled-users">
                <h4>Enrolled Users:</h4>
                <ul>
                  {course.enrolledUsers.map((user, index) => (
                    <li key={index}>
                      <p><strong>Username:</strong> {user.username}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Mobile:</strong> {user.mobile}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No users enrolled in this course yet.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserEnrollCourse;
