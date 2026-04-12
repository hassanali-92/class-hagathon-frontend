import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerAdmin } from '../utils/api/auth';

const AdminRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await registerAdmin(formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Admin Created Successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md border border-gray-700">
        <div className="flex justify-center mb-6"><ShieldAlert size={48} className="text-red-500" /></div>
        <h2 className="text-2xl font-bold text-center mb-2 text-white">Admin Access</h2>
        <p className="text-center text-gray-400 text-sm mb-6">Only for the first administrator.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Admin Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 text-gray-500" size={20} />
              <input type="text" name="name" required className="pl-10 w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 outline-none" placeholder="Admin Name" onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
              <input type="email" name="email" required className="pl-10 w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 outline-none" placeholder="admin@example.com" onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input type="password" name="password" required className="pl-10 w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 outline-none" placeholder="••••••••" onChange={handleChange} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50">
            {loading ? 'Processing...' : 'Create Admin'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-gray-400 hover:text-white">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;