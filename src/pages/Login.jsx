import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser } from '../utils/api/auth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Login Successful!');
      
      if (data.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6"><LogIn size={48} className="text-green-600" /></div>
        <h2 className="text-2xl font-bold text-center mb-6">Login to Mini Link</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="email" name="email" required className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" placeholder="you@example.com" onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="password" name="password" required className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" placeholder="••••••••" onChange={handleChange} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">Don't have an account? <Link to="/register" className="text-green-600 hover:underline">Register here</Link></p>
          <p className="text-gray-600 mt-2">Are you Admin? <Link to="/register-admin" className="text-blue-600 hover:underline">Admin Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;