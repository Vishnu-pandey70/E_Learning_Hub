import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import NotFound from './NotFound';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddCourse() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const response = await axios.get(`http://localhost:5000/user/${decodedToken.userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const userRole = response.data.user.role;
          setIsAdmin(userRole === 'admin');
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    checkUserRole();
  }, []);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: 0,
    mentor: '',
    image: '',
    lectures: [],
    lectureIds : []
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedLectures = [...courseData.lectures];
    updatedLectures[index] = { ...updatedLectures[index], [name]: value };
    setCourseData({ ...courseData, lectures: updatedLectures });
  };

  const handleFile = async (e, index) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", courseData.lectures[index].title);
    formData.append("file", e.target.files[0]);

    try {
      const result = await axios.post(
        "http://localhost:5000/upload-files",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (result.data.status === "ok") {
        const filename = result.data.filename;
        const updatedLectures = [...courseData.lectures];
        updatedLectures[index] = { ...updatedLectures[index], assignment: filename };
        setCourseData({ ...courseData, lectures: updatedLectures });
        toast.success('File uploaded successfully!', { toastId: 'file-upload-success' });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error('Error uploading file', { toastId: 'file-upload-error' });
    }
  };

  const handleAddLecture = () => {
    setCourseData({
      ...courseData,
      lectures: [
        ...courseData.lectures,
        { title: '', video: '', notes: '', assignment: '' }
      ],
    });
  };

  const handleDeleteLecture = (index) => {
    const updatedLectures = [...courseData.lectures];
    updatedLectures.splice(index, 1);
    setCourseData({ ...courseData, lectures: updatedLectures });
  };

  const handleAddCourse = async () => {
    try {
      const token = localStorage.getItem('token');

      const lectureIds = [];
    for (const lectureData of courseData.lectures) {
      // console.log(courseData.lectures)
      try {
        const response = await axios.post('http://localhost:5000/add-lecture', lectureData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        lectureIds.push(response.data.lecture._id);
      } 
      catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        return;
      }
          else{
        toast.error("Some Error Occured !!")
        return;
          }
      }
    }
    
    // Add the course with the lecture IDs

    const courseDataWithLectureIds = {
      ...courseData,
      price: courseData.price || "0",
      lectureIds: lectureIds
    };

      await axios.post('http://localhost:5000/add-course', courseDataWithLectureIds, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(courseDataWithLectureIds)
      toast.success('Course Added Successfully', { toastId: 'server-success' });
      setTimeout(() => navigate('/created-courses'), 800);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message, { toastId: 'server-error' });
      } else if (error.request) {
        console.error('No response received from server:', error.request);
        toast.error('No response received from server', { toastId: 'server-error' });
      } else {
        toast.error('Error while setting up the request', { toastId: 'server-error' });
        console.error('Error while setting up the request:', error.message);
      }
    }
  };

  if (!isAdmin) {
    return <NotFound />;
  }

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="text-center mb-0">ADD COURSE</h2>
        </div>
        <div className="card-body">
          <form>
            <div className="mb-3 row">
              <label htmlFor="title" className="col-sm-2 col-form-label fw-bold">Title</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" id="title" name="title" value={courseData.title} onChange={(e) => setCourseData({ ...courseData, title: e.target.value })} />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="description" className="col-sm-2 col-form-label fw-bold">Description</label>
              <div className="col-sm-10">
                <textarea className="form-control" id="description" name="description" value={courseData.description} onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}></textarea>
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="price" className="col-sm-2 col-form-label fw-bold">Price</label>
              <div className="col-sm-10">
                <input type="number" className="form-control" id="price" name="price" value={courseData.price} onChange={(e) => setCourseData({ ...courseData, price: e.target.value })} min={0}/>
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="mentor" className="col-sm-2 col-form-label fw-bold">Mentor</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" id="mentor" name="mentor" value={courseData.mentor} onChange={(e) => setCourseData({ ...courseData, mentor: e.target.value })} />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="image" className="col-sm-2 col-form-label fw-bold">Image URL</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" id="image" name="image" value={courseData.image} onChange={(e) => setCourseData({ ...courseData, image: e.target.value })} />
              </div>
            </div>
            <div className="mb-3">
              <h3 className="text-center mb-4">Lectures</h3>
              {courseData.lectures.map((lecture, index) => (
                <div key={index} className="border border-secondary rounded-4 p-3 mb-3">
                   <div className="d-flex justify-content-between mt-3 mx-auto">
                <h4 className="text-center">Lecture {index + 1}</h4>
                <button className="btn btn-danger mb-2" onClick={() => handleDeleteLecture(index)}>Delete</button>
              </div>
                  <div className="mb-3 row">
                    <label htmlFor={`lecture-title-${index}`} className="col-sm-2 col-form-label fw-bold">Title</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control " id={`lecture-title-${index}`} name="title" value={lecture.title} onChange={(e) => handleInputChange(e, index)}  />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label htmlFor={`lecture-video-${index}`} className="col-sm-2 col-form-label fw-bold">Video</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" id={`lecture-video-${index}`} name="video" value={lecture.video} onChange={(e) => handleInputChange(e, index)} />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label htmlFor={`lecture-notes-${index}`} className="col-sm-2 col-form-label fw-bold">Notes</label>
                    <div className="col-sm-10">
                      <textarea className="form-control" id={`lecture-notes-${index}`} name="notes" value={lecture.notes} onChange={(e) => handleInputChange(e, index)} > </textarea>

                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label htmlFor={`lecture-file-${index}`} className="col-sm-2 col-form-label fw-bold">Assignment</label>
                    <div className="col-sm-10">
                      <input type="file" className="form-control" id={`lecture-file-${index}`} accept=".pdf" name="file" onChange={(e) => handleFile(e, index)} />
                    </div>
                  </div>
                 
                </div>
              ))}
              <div className="text-center mb-4">
                <button type="button" className="btn btn-secondary" onClick={handleAddLecture}>Add Lecture</button>
              </div>
            </div>
            <div className="text-center">
              <button type="button" className="btn btn-primary me-3 btn-lg" onClick={handleAddCourse}>Add Course</button>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
}

export default AddCourse;