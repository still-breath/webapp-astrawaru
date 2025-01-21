import React, { useState } from 'react';
import axios from 'axios';
import './register.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'customer' // Default role is 'admin'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure the formData is correctly structured
      console.log('Form Data:', formData); // Log to check the data before sending it
      
      // Make the POST request to the backend
      const response = await axios.post('https://bengkel-mate-backend.vercel.app/api/auth/register', formData);
      
      setMessage('Registration successful!');
      console.log('Registration response:', response.data);
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>User Registration</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div className="input-container">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-container">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="SA">Service Advisor</option>
            <option value="sparepart">Sparepart</option>
            <option value="customer">Customer</option>
            <option value="satpam">Security</option>
            <option value="mekanik">Mekanik</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Register</button>
        {message && <p className="message">{message}</p>}
        <button className="secondary-button" onClick={() => window.location.href = '/login'}>Already have an account? Login</button>
      </form>
    </div>
  );
};

export default Register;
