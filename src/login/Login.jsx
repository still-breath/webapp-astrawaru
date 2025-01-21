import React, { useState } from "react";
import axios from "axios";
import './login.scss';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Fungsi untuk menangani klik login
  const handleLoginClick = async () => {
    try {
      // Kirim permintaan login ke server dengan username dan password
      const response = await axios.post('https://bengkel-mate-backend.vercel.app/api/auth/login', {
        username,
        password,
      });

      // Ambil token dari response.data
      const { token } = response.data;

      if (token) {
        // Simpan token di localStorage atau sessionStorage
        localStorage.setItem('token', token);

        // Dekode token untuk mendapatkan role
        const decoded = JSON.parse(atob(token.split('.')[1])); // Dekode JWT untuk mendapatkan payload
        const role = decoded.role;

        // Panggil onLogin dengan role yang diterima
        onLogin(role);
      } else {
        setError('Token tidak ditemukan dalam respons');
      }
    } catch (error) {
      // Tangani error jika login gagal
      if (error.response) {
        setError('Username atau password salah');
      } else {
        setError('Terjadi kesalahan jaringan, silakan coba lagi');
      }
    }
  };

  const handleRegisterClick = () => {
    // Jika pengguna belum memiliki akun, arahkan ke halaman register
    window.location.href = '/register';
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>

        {/* Tampilkan error jika ada */}
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div className="input-container">
            <input
              type="email"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="button" onClick={handleLoginClick}>
          Login
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={handleRegisterClick}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Login;
