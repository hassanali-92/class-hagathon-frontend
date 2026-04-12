import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerUser } from '../utils/api/auth';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      toast.success('Registration Successful! Please Login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6"><UserPlus size={48} className="text-green-600" /></div>
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="text" name="name" required className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" placeholder="Hasan Ali" onChange={handleChange} />
            </div>
          </div>
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">Already have an account? <Link to="/login" className="text-green-600 hover:underline">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;