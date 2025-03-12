import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('https://frontend-take-home-service.fetch.com/auth/login', {
        name,
        email,
      }, {
        withCredentials: true,
      });
      navigate('/search');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div 
        className="flex justify-center items-center min-h-screen min-w-screen bg-contain bg-no-repeat"
        style={{
            backgroundImage: "url('src/assets/shelter1.webp'), url('src/assets/shelter2.webp')",
            backgroundSize: "50% 100%, 50% 100%",
            backgroundPosition: "left top, right bottom"
        }}
        >
      <form onSubmit={handleSubmit} className="p-12 bg-white rounded-2xl shadow-md w-120 h-96">
        <h2 className="text-2xl text-gray-900 text-center font-bold mb-6">Login</h2>
        <div>
            <label className="block text-md/6 font-medium text-gray-900">Username</label>
            <div className='mt-2'>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mb-6 outline-1 -outline-offset-1 outline-gray-400 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 rounded text-gray-900"
                    />
            </div>
        </div>

        <div>
            <label className="block text-md/6 font-medium text-gray-900">Email</label>
            <div className='mt-2'>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-6 outline-1 -outline-offset-1 outline-gray-400 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 rounded text-gray-900"
                    />
            </div>
        </div>
        
        
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
