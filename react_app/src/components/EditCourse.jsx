import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotFound from './NotFound';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isAdmin, setIsAdmin] = useState(false);
  const[iscourseaddbyyou ,setcourseaddbyyou]=useState(false);
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
          if (userRole === 'admin') {
            fetchCourse();
          }
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
    lectureIds: [{ title: '', video: '', notes: '', assignment: '' }]
  });

    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/edit-course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const course = response.data.course;
        setCourseData(course);
        setcourseaddbyyou(true);
      } catch (error) {
        const errorMessage = error.response.data.message;
        if(iscourseaddbyyou)
        toast.error('Failed to fetch course: ' + errorMessage, { toastId: 'fetchingError' });
        
      }
    };


  const handleEditCourse = async () => {
    // write code here t
    const lectureIDS = [];
    for (const lectureData of courseData.lectureIds) {
      console.log(lectureData)
      if (lectureData._id) {
        try {
          const response = await axios.post(`http://localhost:5000/update-lecture/${lectureData._id}`, lectureData, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.data.message === "Lecture updated successfully") {
            lectureIDS.push(lectureData._id);
          } else {
            toast.error("Error updating lecture");
            return;
          }
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
      else{
        try {
          
          const response = await axios.post('http://localhost:5000/add-lecture', lectureData, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          // console.log(response.data.lecture)
          lectureIDS.push(response.data.lecture._id);
        } catch (error) {
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
    }
    // console.log(lectureIDS)
    try {
      const updatedCourseData = {
        ...courseData,
        price: courseData.price || "0",
        lectureIds: lectureIDS 
      };
      // console.log(updatedCourseData);
      await axios.put(`http://localhost:5000/edit-course/${courseId}`, updatedCourseData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Course updated successfully!', { toastId: 'updateSuccess' });
      setTimeout(() => navigate('/created-courses'), 800);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error('Failed to update course: ' + errorMessage, { toastId: 'updateError' });
      } else if (error.request) {
        toast.error('Failed to update course: No response from server', { toastId: 'updateError' });
      } else {
        toast.error('Failed to update course: ' + error.message, { toastId: 'updateError' });
      }
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedLectures = [...courseData.lectureIds];
    updatedLectures[index] = { ...updatedLectures[index], [name]: value };
    setCourseData({ ...courseData, lectureIds: updatedLectures });
  };

  const handleAddLecture = () => {  
    setCourseData({
      ...courseData,
      lectureIds: [...courseData.lectureIds, { title: '', video: '', notes: '', assignment: '' }],
    });
  };

  const handleDeleteLecture = (index) => {
    const updatedLectures = [...courseData.lectureIds];
    updatedLectures.splice(index, 1);
    setCourseData({ ...courseData, lectureIds: updatedLectures });
  };

  // Function to view PDF
  const showPdf = (url) => {
    window.open(`http://localhost:5000/files/${url}`, "_blank");
  };

  // Function to handle file upload
  const handleFileUpload = async (e, index) => {
    const formData = new FormData();
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
        const updatedLectures = [...courseData.lectureIds];
        updatedLectures[index] = { ...updatedLectures[index], assignment: filename };
        setCourseData({ ...courseData, lectureIds: updatedLectures });
        toast.success("Uploaded Successfully!!!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  if (!isAdmin || !iscourseaddbyyou) {
    return <NotFound />;
  }
  
  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="text-center mb-0">Edit Course</h2>
        </div>
        <div className="card-body">
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label  fw-bold">Title</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" name="title" value={courseData.title} onChange={(e) => setCourseData({ ...courseData, title: e.target.value })} />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label fw-bold">Description</label>
            <div className="col-sm-10">
              <textarea className="form-control" name="description" value={courseData.description} onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}></textarea>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label fw-bold">Price</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" name="price" value={courseData.price} onChange={(e) => setCourseData({ ...courseData, price: e.target.value })} min={0}/>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label fw-bold">Mentor</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" name="mentor" value={courseData.mentor} onChange={(e) => setCourseData({ ...courseData, mentor: e.target.value })} />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label fw-bold">Image URL</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" name="image" value={courseData.image} onChange={(e) => setCourseData({ ...courseData, image: e.target.value })} />
            </div>
          </div>
  
          <h3 className="text-center">Lectures</h3>
          {courseData && courseData.lectureIds && courseData.lectureIds.map((lecture, index) => (
            <div key={index} className="mb-3">
              <div className="border border-secondary rounded-4 p-3 mb-3">

              <div className="d-flex justify-content-between mt-3 mx-auto">
                <h4 className="text-center">Lecture {index + 1}</h4>
                <button className="btn btn-danger mb-2" onClick={() => handleDeleteLecture(index)}>Delete</button>
              </div>
              <div className="mb-2 row">
                <label className="col-sm-2 col-form-label fw-bold">Title</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" name="title" value={lecture.title} onChange={(e) => handleInputChange(e, index)} />
                </div>
              </div>
              <div className="mb-2 row">
                <label className="col-sm-2 col-form-label fw-bold">Video</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" name="video" value={lecture.video} onChange={(e) => handleInputChange(e, index)} />
                </div>
              </div>
              <div className="mb-2 row">
                <label className="col-sm-2 col-form-label fw-bold">Notes</label>
                <div className="col-sm-10">
                  <textarea type="text" className="form-control" name="notes" value={lecture.notes} onChange={(e) => handleInputChange(e, index)} ></textarea>
                </div>
              </div>
              <div className="mb-2 row">
                <label className="col-sm-2 col-form-label fw-bold">Assignment</label>
                <div className="col-sm-6">
                  <input type="text" className="form-control" value={lecture.assignment} readOnly />
                </div>
                <div className="col-sm-4">
                  {
                    lecture.assignment ? <button className="btn btn-primary" onClick={() => showPdf(lecture.assignment)}>View PDF</button> : <button className="btn btn-warning">No Pdf Found</button>
                  }
                </div>
   
              </div>
  
              <div className="mb-2 row">
                <label className="col-sm-2 col-form-label fw-bold">Upload New PDF</label>
                <div className="col-sm-10">
                  <input type="file" className="form-control" accept=".pdf" onChange={(e) => handleFileUpload(e, index)} />
                </div>
              </div>
            </div>
            </div>
          ))}
          <div className="d-flex justify-content-between mt-3 mx-auto" style={{ maxWidth: "800px" }}>
            <button className="btn btn-primary" onClick={handleAddLecture}>Add Lecture</button>
            <button className="btn btn-primary" onClick={handleEditCourse}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default EditCourse;