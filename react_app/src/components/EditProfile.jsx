import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from './NotFound';

function EditProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [iscurruser, setcurruser] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data.user;
        setUsername(userData.username);
        setEmail(userData.email);
        setMobile(userData.mobile);
        setcurruser(true);
      } catch (error) {
        const errorMessage = error.response.data.message;
        if (errorMessage==="Unauthorized user") {
          setcurruser(false);
          return;
      }
        else{
        console.error("Error fetching user data:", error);
        toast.error(errorMessage);
        setUsername("");
        setEmail("");
        setMobile("");
        }
      }
    };
    fetchUserData();
  }, [userId]);

  const handleUpdateProfile = async () => {
    try {


      if (!username || !email || !mobile) {
        toast.error("Please fill in all fields.", { toastId: "updateError" });
        return;
      }

      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobile)) {
        toast.error("Mobile number must be a 10-digit numeric value.", { toastId: "updateError" });
        return;
      }
      
      const url = `http://localhost:5000/user/${userId}`;
      const data = { username,  mobile, email };

      const response = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message) {
        toast.success(response.data.message, { toastId: "updateSuccess" });
        setTimeout(() => navigate("/"), 800);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage, { toastId: "updateError" });
      } else {
        toast.error("Failed to update user profile. Please try again later.", {
          toastId: "updateError",
        });
      }
    }
  };
  if (!iscurruser || !token) {
    return <NotFound />;
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 d-none d-md-block" style={{ background: `url('https://www.ps3g.com/wp-content/uploads/2020/06/Remote_Working-01.png')`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
        </div>

        <div className="col-md-6 col-sm-12">
          <div className="row justify-content-center align-items-center vh-100">
            <div className="col-md-8 mt-5">
              <div className="p-4 shadow rounded" style={{ backgroundColor: "#f0f0f0" }}>
                <h3 className="h3 mb-3 text-center">EDIT PROFILE</h3>
                <form>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      id="username"
                      className="form-control"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mobile" className="form-label">
                      Mobile
                    </label>
                    <input
                      id="mobile"
                      className="form-control"
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input style={{cursor: 'not-allowed'}}
                      id="email"
                      className="form-control"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                  </div>
                  
                  <div className="mb-3 d-grid">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleUpdateProfile}
                    >
                      Update Profile
                    </button>
                  </div>
                  <div className="text-center mt-3">
                    <Link to="/" className="btn btn-secondary">
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditProfile;
