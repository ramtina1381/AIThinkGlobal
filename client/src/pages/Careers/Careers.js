import React, { useState, useEffect } from "react";
import "./Careers.css";

const jobData = [
  { title: "Wordpress Developer", category: "Engineering", experience: "2 Years", deadline: "2025-05-08" },
  { title: "Javascript Developer", category: "Engineering", experience: "1 Year", deadline: "2025-06-08" },
  { title: "Apps Developer", category: "Engineering", experience: "3 Years", deadline: "2021-06-08" },
  { title: "iOS Developer", category: "Engineering", experience: "2 Years", deadline: "2021-06-08" },
  { title: "Node JS Developer", category: "Engineering", experience: "3 Years", deadline: "2021-07-08" },
  { title: "SEO Specialist", category: "Digital Marketing", experience: "2 Years", deadline: "2025-09-01" },
  { title: "Customer Support Rep", category: "Support", experience: "1 Year", deadline: "2025-09-15" },
];

export default function CareersPage() {
  const [search, setSearch] = useState("");
const [category, setCategory] = useState("All");
  
// SCROLL TO THE TOP!
useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


const filteredJobs = jobData.filter(job => {
  const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
  const matchesCategory = category === "All" || job.category === category;
  return matchesSearch && matchesCategory;
});


  return (
    <div className="careers-page">
      {/* Hero Section */}
      <section className="careers-section">
        <div className="careers-content">
          <h1>JOIN US</h1>
          <p>
            Be part of a forward-thinking team where innovation, teamwork, and
            growth matter. Explore opportunities and shape the future with us.
          </p>
          <div className="careers-buttons">
            <button className="btn-primary"><a href="#careers">Join the Team</a></button>
            <button className="btn-outline">Contact</button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <h2>Why You Should Join Our Awesome Team</h2>
        <div className="benefit-grid">
          <div className="benefit-card">
            <h3>🤝 Teamwork</h3>
            <p>Work in a collaborative environment where ideas matter.</p>
          </div>
          <div className="benefit-card">
            <h3>🔒 Secured Future</h3>
            <p>We provide stability and growth opportunities for your career.</p>
          </div>
          <div className="benefit-card">
            <h3>📚 Learning Opportunity</h3>
            <p>Access to resources and mentorship to help you grow.</p>
          </div>
          <div className="benefit-card">
            <h3>🚀 Upgrade Skills</h3>
            <p>Keep up with the latest technologies and trends.</p>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="careers" id="careers">
        <h2>Career Openings</h2>
        <p>
          We're always looking for talented, creative individuals. Check out our
          open positions below.
        </p>

        <div className="job-search">
          <input
            type="text"
            placeholder="Keywords/job title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Support">Support</option>
            <option value="Digital Marketing">Digital Marketing</option>
          </select>
          <input type="text" placeholder="Location" />
          <button className="btn-primary">Find Jobs</button>
        </div>

<div className="job-list">
  {filteredJobs.map((job, index) => (
    <div key={index} className="job-card">
      <h3 className="job-title">{job.title}</h3>
      
      <div className="job-info">
        <div className="job-field">
          <span className="label">Category</span>
          <span className="value">{job.category}</span>
        </div>

        <div className="job-field">
          <span className="label">Experience</span>
          <span className="value">{job.experience}</span>
        </div>

        <div className="job-field">
          <span className="label">Deadline</span>
          <span className="value">{job.deadline}</span>
        </div>
      </div>
      <button className="apply-btn">→</button>
    </div>
  ))}
</div>
      </section>
    </div>
  );
}
