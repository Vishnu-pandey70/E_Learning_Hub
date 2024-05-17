import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPlayer from 'react-player';
import Progress from './Progress';
import NotFound from './NotFound';

function ShowContent() {
  const [courseContent, setCourseContent] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [value, setValue] = useState(0);
  const { courseId } = useParams();
  const [selectedContent, setSelectedContent] = useState('notes');
  const token =localStorage.getItem('token');
 
  
  const fetchCourseData = useCallback(async () => {
    try {
      const courseContentResponse = await axios.get(`http://localhost:5000/my-courses/${courseId}`);
      setCourseContent(courseContentResponse.data.lectureIds);
      setCourseName(courseContentResponse.data.title);
  
      // Select the first lecture
      if (courseContentResponse.data.lectureIds.length > 0) {
        setSelectedLecture(courseContentResponse.data.lectureIds[0]);
      }
  
      const completedCoursesResponse = await axios.get(`http://localhost:5000/completed-lectures`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (completedCoursesResponse.data && completedCoursesResponse.data.success === true && completedCoursesResponse.data.completedLectures) {
        const commonDocuments = findCommonDocuments(completedCoursesResponse.data.completedLectures, courseContentResponse.data.lectureIds);
        setCompleted(commonDocuments);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      handleFetchError(error, 'fetchDataError');
    }
  }, [courseId]);
  

  const findCommonDocuments = (array1, array2) => {
    const commonDocuments = [];
    array1.forEach(docA => {
      const foundDoc = array2.find(docB => docB._id === docA._id);
      if (foundDoc) {
        commonDocuments.push(foundDoc._id);
      }
    });
    return commonDocuments;
  };

  const handleLectureSelect = (lecture) => {
    setSelectedLecture(lecture);
    setSelectedContent('notes')
  };

  const showPdf = (url) => {
    window.open(`http://localhost:5000/files/${url}`, "_blank");
  };

  const handleOnPlay = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/add-course-progress`, {
        lectureId: selectedLecture._id
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data && response.data.success && response.data.success === true && response.data.lecture._id) {
        if (!completed.includes(response.data.lecture._id) && response.data.lecture._id !== undefined) {
          setCompleted(prevCompleted => [...prevCompleted, response.data.lecture._id]);
        }
      }
      handleProgress();
    } catch (error) {
      console.error('Error adding course progress:', error);
      handleFetchError(error, 'addCourseProgressError');
    }
  };

  const handleFetchError = (error, toastId) => {
    if (error.response) {
      const errorMessage = error.response.data.message;
      toast.error(errorMessage, { toastId });
    } else {
      toast.error('Failed to fetch data. Please try again later.', { toastId });
    }
  };

  const handleProgress = () => {
    const completedPercentage = (completed.length / courseContent.length) * 100;
    const curr = completedPercentage.toFixed(0)
    setValue(curr);
  };

  useEffect(() => {
    fetchCourseData();
  
  }, [fetchCourseData]);

  useEffect(() => {
    handleProgress();
    
  }, [completed, courseContent]);

  if(!token) return <NotFound />;

  return (
    <div className="container mt-3">

  <div className="container mt-4">
      <div className="row">
        <div className="col-lg-6 mb-4" style={{ height: '150px' }}>
          <div className="card d-flex justify-content-center align-items-center" style={{ background: 'linear-gradient(150deg, #2E3192 0%, #1BFFFF 100%)', color: '#fff', height: '100%' }}>
            <h3 className='fs-3'>{courseName}</h3>
          </div>
        </div>
        <div className="col-lg-6  mb-4">
          <div className="card" style={{ background: 'linear-gradient(135deg, #6769AB 0%,#1BFFFF  100%)', color: '#fff', height: '100%' }}>
            <div className="card-body">
              <h3>Progress</h3>
              <Progress value={value} />
            </div>
          </div>
        </div>
      </div>
    </div>



      <ToastContainer />
      <div className="row">
        <div className="col-sm-4">
          <h4>Lecture Titles</h4>
          <div className="lecture-list-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <div className="list-group">
              {courseContent && courseContent.map((lecture, index) => (
                <button
                  key={index}
                  className={`list-group-item list-group-item-action d-flex justify-content-between ${selectedLecture === lecture ? 'bg-#ba03fc active' : ''}`}
                  onClick={() => handleLectureSelect(lecture)} style={{ backgroundColor: selectedLecture === lecture ? '#ba24d1' : '' }}
                >
                  <span>{lecture.title}</span>
                  {completed.includes(lecture._id) ? (
                    <img src="https://www.shareicon.net/data/128x128/2015/09/29/648183_check_512x512.png" width={20} alt="icon.." />
                  ) : <span></span>}
                </button>

              ))}
            </div>


          </div>
        </div>
        <div className="col-sm-8">
          <h4>Video Player</h4>
          {selectedLecture && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{selectedLecture.title}</h5>
                <div className="embed-responsive embed-responsive-16by9" onClick={handleOnPlay}>
                  <ReactPlayer
                    url={selectedLecture.video.replace("https://youtu.be/", "https://www.youtube.com/embed/")}
                    onEnded={handleOnPlay}
                    controls={true}
                    width='100%'
                  />
                </div>
              </div>
            </div>
          )}
          <div className='my-5'>
              {selectedLecture && (
                <>
                  <nav className="nav nav-pills nav-fill">
                    <button className={`nav-item nav-link ${selectedContent === 'notes' ? 'active' : ''}`} onClick={() => setSelectedContent('notes')}>
                      Notes
                    </button>
                    <button className={`nav-item nav-link ${selectedContent === 'assignment' ? 'active' : ''}`} onClick={() => setSelectedContent('assignment')}>
                      Assignment
                    </button>
                    {/* style={{cursor: value!==100?'not-allowed' : ''}} */}
                    <button style={{cursor: value!=100?'not-allowed' : ''}} className={`nav-item nav-link ${selectedContent === 'certificate' ? 'active' : ''}`} onClick={() => value==100? setSelectedContent('certificate') : ''}>
                      Certificate {value!=100? <img src={'https://cdn-icons-png.flaticon.com/512/61/61457.png'} width={20}></img> : <></>}
                    </button>

                    
                  </nav>
                  {selectedContent === 'notes' && (
                    <div style={{ maxHeight: '500px', letterSpacing: '1px', fontSize: '1.2rem' }} className="card-body overflow-auto border border-secondary border-2 rounded p-3 mt-3">
                      <p>{selectedLecture.notes}</p>
                    </div>
                  )}
                  {selectedContent === 'assignment' && (
                    <>
                      <br />
                      {selectedLecture.assignment ? (
                        <button type="button" className="btn btn-warning" onClick={() => showPdf(selectedLecture.assignment)}>
                          Show Assignment
                        </button>
                      ) : (
                        <h4 className="text-danger">No File Attached !!</h4>
                      )}
                    </>
                  )}
                  {selectedContent === 'certificate' && (
                    <>
                      <br />
                      <Link to={`/certificate/${courseId}`}>
                        <button type="button" className="btn btn-success">
                          Get Your Certificate
                        </button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

        </div>
      </div>
    </div>
  );
}

export default ShowContent;
