import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const About = () => {
  return (
    <div className="mx-3 mt-3">
      <div className="row">
  <div className="col text-center">
    <h1 className="display-6 fw-bold">Welcome To E-Learning Hub</h1>
    <p className="lead">
      Empowering learners worldwide with high-quality online education resources. 
      Our mission is to make learning accessible, engaging, and effective for everyone, 
      regardless of their location or background.
    </p>
  </div>
</div>

      <div className="row mt-5">
        <div className="col">
          <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-interval="1000">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100" style={{ height: '400px', objectFit: 'cover' }} alt="Slide 1" />
              </div>
              <div className="carousel-item">
                <img src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b25saW5lJTIwY291cnNlc3xlbnwwfHwwfHx8MA%3D%3D" className="d-block w-100" style={{ height: '400px', objectFit: 'cover' }} alt="Slide 2" />
              </div>
              <div className="carousel-item">
                <img src="https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b25saW5lJTIwY291cnNlc3xlbnwwfHwwfHx8MA%3D%3D" className="d-block w-100" style={{ height: '400px', objectFit: 'cover' }} alt="Slide 3" />
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <div className="row mt-5">
        <div className="col-md-6">
          <img src="https://bootstrapbrain.com/demo/components/abouts/about-2/assets/img/about-img-1.webp" className="img-fluid" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
        </div>
        <div className="col-md-6">
  <div className="card bg-light shadow">
    <div className="card-body">
      <h2 className="card-title mb-4 text-danger text-center">Why Choose Us?</h2>
      <p className="card-text mb-4">
        We are committed to providing an exceptional learning experience through our comprehensive course offerings, expert instructors, and innovative teaching methods. Here are some reasons to choose Webister E-Learning Hub:
      </p>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">&#10004;<i className="bi bi-check2 me-2 text-primary"></i>High-quality course content</li>
        <li className="list-group-item">&#10004;<i className="bi bi-check2 me-2 text-primary"></i>Flexible learning schedules</li>
        <li className="list-group-item">&#10004;<i className="bi bi-check2 me-2 text-primary"></i>Interactive and engaging learning environment</li>
        <li className="list-group-item">&#10004;<i className="bi bi-check2 me-2 text-primary"></i>Experienced and knowledgeable instructors</li>
        <li className="list-group-item">&#10004;<i className="bi bi-check2 me-2 text-primary"></i>Affordable pricing options</li>
      </ul>
    </div>
  </div>
</div>

      </div>
      <footer className="bg-dark text-white py-4 mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>Contact Us</h5>
              <p>Email: contact@webister.com</p>
              <p>Phone: +1234567890</p>
            </div>
            <div className="col-md-4">
              <h5>Follow Us</h5>
              <ul className="list-inline">
                <li className="list-inline-item"><a href="#" className="text-white"><FaFacebook /></a></li>
                <li className="list-inline-item"><a href="#" className="text-white"><FaTwitter /></a></li>
                <li className="list-inline-item"><a href="#" className="text-white"><FaInstagram /></a></li>
                <li className="list-inline-item"><a href="#" className="text-white"><FaLinkedin /></a></li>
                <li className="list-inline-item"><a href="#" className="text-white"><FaWhatsapp /></a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Subscribe to Our Newsletter</h5>
              <form>
                <div className="input-group mb-3">
                  <input type="email" className="form-control" placeholder="Enter email" aria-label="Email" aria-describedby="basic-addon2" />
                  <button className="btn btn-light" type="button">Subscribe</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default About;
