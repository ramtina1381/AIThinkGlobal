import React from "react";
import './Contact.css'

export default function Contact() {

    const showModal = () => {
    const modal = document.getElementById("thankYouModal");
    if (modal) modal.style.display = "flex";
  };

  const closeModal = () => {
    const modal = document.getElementById("thankYouModal");
    if (modal) modal.style.display = "none";
  };


const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };

    try {
      const response = await fetch(`http://localhost:5001/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
            });

      if (response.ok) {
        showModal();
        e.target.reset();
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };


  return (
    <section id="contact" className="contact section">
      <div className="container section-title">
        <h2 className="contact-title">Contact</h2>
        <p>Drop us a line! We love to hear from you.</p>
      </div>

      <div className="container">
        <div className="contact-row">
          {/* Left Column */}
          <div className="contact-col-left">
            <div className="info-wrap">
              <div className="info-item">
                <i className="bi bi-geo-alt"></i>
                <div>
                  <h4>Address</h4>
                  <p>Oakville, Ontario, Canada</p>
                </div>
              </div>

              <div className="info-item">
                <i className="bi bi-telephone"></i>
                <div>
                  <h4>Call Us</h4>
                  <p>+1 416 316 0285</p>
                </div>
              </div>

              <div className="info-item">
                <i className="bi bi-envelope"></i>
                <div>
                  <h4>Email Us</h4>
                  <p>contact@aithinkglobal.com</p>
                </div>
              </div>

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d92597.08485050796!2d-79.9701101!3d43.5094508!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b5b8b8f729979%3A0x5037b28c7231bd0!2sOakville%2C%20ON!5e0!3m2!1sen!2sca!4v1742955223278!5m2!1sen!2sca"
                className="map-iframe"
                title="Google Map"
              ></iframe>
            </div>
          </div>

          {/* Right Column */}
          <div className="contact-col-right">
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Send Us a Message</h2>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  placeholder="Subject of your message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button type="submit" className="contact-button">
                Send Message
              </button>
            </form>
                    </div>
        </div>
      </div>

      {/* Custom Modal */}
      <div
        className="modal-overlay"
        id="thankYouModal"
        style={{ display: "none" }}
        onClick={(e) => {
          if (e.target.id === "thankYouModal") closeModal();
        }}
      >
        <div className="modal-box">
          <button className="modal-close" onClick={closeModal}>
            &times;
          </button>
          <h2>Thank You!</h2>
          <div className="modal-content">
            <p>We appreciate your message. Our team will get back to you shortly.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
