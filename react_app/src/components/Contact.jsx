import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  const [state, setState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { name, email, subject, message } = state;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Please provide a value in each input field");
    } else {
      // firebaseDB.child("contacts").push(state);
      setState({ name: "", email: "", subject: "", message: "" });
      toast.success("Form Submitted Successfully");
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <section className="contact-section" style={{ background: "#f8f9fa" }}>
      <div className="container mt-5">
        <ToastContainer position="top-center" />
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="row g-0 rounded">
              <div className="col-md-6 p-4" style={{ background: "linear-gradient(135deg, rgba(127, 39, 156, 1) 0%, rgba(46, 39, 157, 1) 110%)" }}>
                <h3 className="mb-4" style={{ color: "white" }}>Send us a <span style={{ color: "#d62196" }}>message</span></h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      name="name"
                      value={name}
                      onChange={handleInputChange}
                      style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.2)" }}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                      style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.2)" }}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Subject"
                      name="subject"
                      value={subject}
                      onChange={handleInputChange}
                      style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.2)" }}
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows="6"
                      placeholder="Message"
                      name="message"
                      value={message}
                      onChange={handleInputChange}
                      style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.2)" }}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-light btn-lg"
                      style={{ background: "#d62196", border: "none" }}
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-md-6 d-flex align-items-stretch p-4" style={{ background: "#f1f1f1", borderRadius: "15px" }}>
  <div className="info-wrap w-100 ">
    <h3 style={{ color: "#d62196", borderBottom: "2px solid #d62196", paddingBottom: "10px" }}>Contact us</h3>
    <p className="mb-4" style={{ color: "#333" }}>We're open for any suggestion or just to have a chat</p>
    <div className="dbox w-100 d-flex align-items-start mb-3">
     
      <div className="text pl-3">
        <p><span className="fw-bold">Address:</span> West 21th Street, Suite 721 New Delhi 110001</p>
      </div>
    </div>
    <div className="dbox w-100 d-flex align-items-center mb-3">
     
      <div className="text pl-3 ">
        <p><span className="fw-bold">Phone : </span><a href="tel://123456789" style={{ color: "#d62196", textDecoration: "none" }}>+1235 2355 98</a></p>
      </div>
    </div>
    <div className="dbox w-100 d-flex align-items-center mb-3">
     
      <div className="text pl-3">
        <p><span className="fw-bold">Email : </span><a href="mailto:info@yoursite.com" style={{ color: "#d62196", textDecoration: "none" }}>elearninghub7905@gmail.com</a></p>
      </div>
    </div>
    <div className="dbox w-100 d-flex align-items-center">
     
      <div className="text pl-3">
        <p><span className="fw-bold">Website : </span><a href="#" style={{ color: "#d62196", textDecoration: "none" }}>E-Learnig-Hub.com</a></p>
      </div>
    </div>
  </div>
</div>



            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
