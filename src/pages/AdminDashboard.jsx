import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Users, ShieldCheck, LogOut, Calendar, Mail, Link as LinkIcon, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../utils/apiConfig';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, admins: 0, users: 0 });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${API_BASE_URL}/users`, config);
      setUsers(data);
      setStats({
        total: data.length,
        admins: data.filter(u => u.role === 'admin').length,
        users: data.filter(u => u.role === 'user').length
      });
    } catch (error) { toast.error('Failed to load users'); } 
    finally { setLoading(false); }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete user and all their data?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${API_BASE_URL}/users/${userId}`, config);
        toast.success('User deleted');
        fetchUsers();
      } catch (error) { toast.error('Failed to delete'); }
    }
  };

  const handleLogout = () => { localStorage.removeItem('userInfo'); window.location.href = '/login'; };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div><h1 className="text-3xl font-bold flex items-center gap-2 text-white"><ShieldCheck className="text-red-500" /> Admin Panel</h1><p className="text-gray-400 text-sm">Manage users and activity.</p></div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"><LogOut size={18} /> Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg"><div className="flex justify-between items-center"><div><p className="text-gray-400 text-sm uppercase font-bold">Total Users</p><h3 className="text-4xl font-bold text-white mt-2">{stats.total}</h3></div><Users className="text-blue-500 opacity-20" size={64} /></div></div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg"><div className="flex justify-between items-center"><div><p className="text-gray-400 text-sm uppercase font-bold">Admins</p><h3 className="text-4xl font-bold text-red-400 mt-2">{stats.admins}</h3></div><ShieldCheck className="text-red-500 opacity-20" size={64} /></div></div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg"><div className="flex justify-between items-center"><div><p className="text-gray-400 text-sm uppercase font-bold">Regular Users</p><h3 className="text-4xl font-bold text-green-400 mt-2">{stats.users}</h3></div><Users className="text-green-500 opacity-20" size={64} /></div></div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
          <div className="p-6 border-b border-gray-700 flex items-center gap-2"><Users size={20} className="text-gray-400" /><h2 className="text-xl font-semibold text-white">Registered Users</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-750 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-medium">User Info</th>
                  <th className="p-4 font-medium">Username</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium text-center">Links</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-sm">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-750 transition-colors">
                    <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">{user.name.charAt(0).toUpperCase()}</div><div><p className="font-bold text-white">{user.name}</p><div className="flex items-center gap-1 text-gray-400 text-xs"><Mail size={12} /> {user.email}</div></div></div></td>
                    <td className="p-4 text-gray-300">{user.username && user.username !== 'N/A' ? <span className="text-green-400 font-mono">@{user.username}</span> : <span className="text-gray-500 italic">Not Set</span>}</td>
                    <td className="p-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'admin' ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-blue-900/30 text-blue-400 border-blue-800'}`}>{user.role.toUpperCase()}</span></td>
                    <td className="p-4 text-center"><div className="flex items-center justify-center gap-1"><LinkIcon size={14} className={user.linkCount > 0 ? "text-purple-400" : "text-gray-500"} /><span className={`font-bold ${user.linkCount > 0 ? "text-white" : "text-gray-500"}`}>{user.linkCount || 0}</span></div></td>
                    <td className="p-4 text-gray-400"><div className="flex items-center gap-1"><Calendar size={14} />{new Date(user.createdAt).toLocaleDateString()}</div></td>
                    <td className="p-4 text-right"><button onClick={() => handleDeleteUser(user._id)} className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-900/20 rounded-full" title="Delete User"><Trash2 size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && <div className="p-8 text-center text-gray-500">No users registered yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;