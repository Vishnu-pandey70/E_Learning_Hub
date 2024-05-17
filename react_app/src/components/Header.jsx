import { Link, useNavigate,useLocation } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './logo.png';

function Header() {
    const [showOver, setShowOver] = useState(false);
    const [dropshowOver, setdropShowOver] = useState(false);
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();

    

    const fetchData = async () => {
        try {
            if (token) {
                const decodedToken = jwtDecode(token);
                const response = await axios.get(`http://localhost:5000/user/${decodedToken.userId}`, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                });
                setUserData(response.data.user);
                setShowOver(false);
                setdropShowOver(false);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            if (error.response) {
              const errorMessage = error.response.data.message;
              toast.error(errorMessage, { toastId: 'fetchUserError' });
            } else {
              toast.error('Failed to fetch user data. Please try again later.', { toastId: 'fetchUserError' });
            }
        }
    };

    useEffect(() => {
        // if (token) {
        //     const decodedToken = jwtDecode(token);
        //     if (decodedToken.exp * 1000 < Date.now()) {
        //       localStorage.removeItem('token');
        //       return;
        //     }
        //   }
        fetchData();
        setdropShowOver(false);
    }, [location]);

    useEffect(() => {
        if (token) {
            // Check if token is expired
            const decodedToken = jwtDecode(token);
            // console.log(decodedToken.exp)
            if (decodedToken.exp * 1000 < Date.now()) {
              // Token expired, remove from localStorage
              localStorage.removeItem('token');
              return;
            }
          }
        

        fetchData();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserData(null);
        setShowOver(false);
        setdropShowOver(false);
        navigate('/login');
    }

    const handleEditProfile = () => {
        const userId = jwtDecode(token).userId;
        if (userId) {
            navigate(`/edit-profile/${userId}`);
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <ToastContainer />
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Logo" width="40" height="40" />
                    {/* E-Learning Hub */}
                </Link>
                <Link className="navbar-brand text-center" to="/">HOME</Link>
                <button className="navbar-toggler" type="button" onClick={() => setShowOver(!showOver)}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={"collapse navbar-collapse justify-content-between" + (showOver ? " show" : "")}>
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link text-center" to="/courses">Courses</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-center" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-center" to="/contact">Contact</Link>
                        </li>
                    </ul>
                    <div className="d-flex">
                    {userData && (
    <div className="dropdown me-5 ">
        <button className="btn btn-outline-light dropdown-toggle" type="button" onClick={() => setdropShowOver(!dropshowOver)}>
            <FaUser className="me-2" />
            {userData.username && userData.username.length > 5 ?
    (userData.username.includes(' ') ?
        `${userData.username.split(' ')[0].charAt(0)}${userData.username.split(' ')[1].charAt(0)}` :
        userData.username
    ) :
    userData.username
} 
        </button>
        <div className={"dropdown-menu dropdown-menu-end " + (dropshowOver ? " show" : "")}>
            {!!token && userData.role === 'admin' && (
                <>
                    <Link to="/add-course" className="dropdown-item">Add Course</Link>
                    <Link to="/created-courses" className="dropdown-item">My Added Courses</Link>
                </>
            )}
            {!!token && (
                <>
                    <button className="dropdown-item" onClick={handleEditProfile}>Edit Profile</button>
                    <Link to="/my-courses" className="dropdown-item">My Courses</Link>
                </>
            )}
            {!token ?
                <Link to="/login" className="dropdown-item text-dark">Login</Link> :
                        <button className='dropdown-item' onClick={handleLogout}>Logout</button>}
                </div>
            </div>
        )}

                        {!userData && (
                            <Link to="/login" className="btn btn-outline-light ms-5">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
