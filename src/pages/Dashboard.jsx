import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Trash2, ExternalLink, Eye, LogOut, Link as LinkIcon, MousePointerClick, CheckCircle, User, Edit3 } from 'lucide-react';
import { getMyProfile, updateProfile } from '../utils/api/profile';
import { getMyLinks, createLink, deleteLink, toggleLink } from '../utils/api/links';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ username: '', fullName: '', bio: '' });
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [loading, setLoading] = useState(true);
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [stats, setStats] = useState({ totalLinks: 0, activeLinks: 0, totalClicks: 0 });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const profileData = await getMyProfile();
      setProfile(profileData);
      if (profileData && profileData._id) setIsProfileCreated(true);
      
      const linksData = await getMyLinks();
      setLinks(linksData);
      setStats({
        totalLinks: linksData.length,
        activeLinks: linksData.filter(l => l.isActive).length,
        totalClicks: linksData.reduce((acc, curr) => acc + curr.clicks, 0)
      });
    } catch (error) { if (error.response?.status !== 404) toast.error('Failed to load data'); } 
    finally { setLoading(false); }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profile.username || !profile.fullName) return toast.error('Username and Name required');
    try {
      await updateProfile(profile);
      toast.success(isProfileCreated ? 'Profile Updated!' : 'Profile Created!');
      setIsProfileCreated(true);
      setProfile({ username: '', fullName: '', bio: '' }); // Reset Form
      const linksData = await getMyLinks();
      setStats({
        totalLinks: linksData.length,
        activeLinks: linksData.filter(l => l.isActive).length,
        totalClicks: linksData.reduce((acc, curr) => acc + curr.clicks, 0)
      });
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return toast.error('Fill all fields');
    try {
      await createLink(newLink);
      setNewLink({ title: '', url: '' });
      fetchData();
      toast.success('Link Added!');
    } catch (error) { toast.error('Failed to add link'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this link?')) {
      try { await deleteLink(id); fetchData(); toast.success('Deleted'); } 
      catch (error) { toast.error('Failed'); }
    }
  };

  const handleToggle = async (id) => {
    try { await toggleLink(id); fetchData(); } catch (error) { toast.error('Failed'); }
  };

  const handleLogout = () => { localStorage.removeItem('userInfo'); navigate('/login'); };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white shadow-md z-10">
        <div className="p-6 border-b"><h1 className="text-2xl font-bold text-green-600">Mini Link</h1></div>
        <nav className="p-4 space-y-2">
          <button className="w-full text-left py-3 px-4 bg-green-50 text-green-700 rounded-lg font-medium flex items-center gap-2"><LinkIcon size={18} /> My Links</button>
          <button onClick={handleLogout} className="w-full text-left py-3 px-4 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition flex items-center gap-2"><LogOut size={18} /> Logout</button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div><h2 className="text-3xl font-bold text-gray-800">Dashboard</h2><p className="text-gray-500">Manage your profile and links</p></div>
            {isProfileCreated && profile.username && (
              <button onClick={() => window.open(`${window.location.origin}/u/${profile.username}`, '_blank')} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm transition">
                <Eye size={18} /> View Live Page
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between"><div><p className="text-gray-500 text-xs uppercase font-bold">Total Links</p><h3 className="text-2xl font-bold">{stats.totalLinks}</h3></div><LinkIcon className="text-blue-100" size={32} /></div>
            <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center justify-between"><div><p className="text-gray-500 text-xs uppercase font-bold">Active Links</p><h3 className="text-2xl font-bold">{stats.activeLinks}</h3></div><CheckCircle className="text-green-100" size={32} /></div>
            <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-purple-500 flex items-center justify-between"><div><p className="text-gray-500 text-xs uppercase font-bold">Total Clicks</p><h3 className="text-2xl font-bold">{stats.totalClicks}</h3></div><MousePointerClick className="text-purple-100" size={32} /></div>
          </div>

          <section className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">{isProfileCreated ? <Edit3 size={20}/> : <User size={20}/>} {isProfileCreated ? 'Edit Profile' : 'Create Profile'}</h3>
              {isProfileCreated && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>}
            </div>
            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" placeholder="Username" className="w-full p-2.5 border rounded-lg" value={profile.username} onChange={(e) => setProfile({...profile, username: e.target.value})} />
              <input type="text" placeholder="Full Name" className="w-full p-2.5 border rounded-lg" value={profile.fullName} onChange={(e) => setProfile({...profile, fullName: e.target.value})} />
              <textarea placeholder="Bio" className="w-full p-2.5 border rounded-lg md:col-span-2 h-24" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
              <button type="submit" className={`md:col-span-2 px-6 py-2.5 rounded-lg text-white font-medium ${isProfileCreated ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                {isProfileCreated ? 'Update Profile' : 'Save Profile'}
              </button>
            </form>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">My Links</h3>
            <form onSubmit={handleAddLink} className="flex flex-col md:flex-row gap-3 mb-6 bg-gray-50 p-4 rounded-lg">
              <input type="text" placeholder="Title" className="flex-1 p-2.5 border rounded-lg" value={newLink.title} onChange={(e) => setNewLink({...newLink, title: e.target.value})} />
              <input type="text" placeholder="URL" className="flex-1 p-2.5 border rounded-lg" value={newLink.url} onChange={(e) => setNewLink({...newLink, url: e.target.value})} />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"><Plus size={18} /> Add</button>
            </form>
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link._id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg ${!link.isActive ? 'opacity-60 bg-gray-50' : 'bg-white hover:shadow-md'}`}>
                  <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                    <h4 className="font-bold truncate">{link.title}</h4>
                    <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate block">{link.url}</a>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex flex-col items-center mr-2"><span className="text-sm font-bold">{link.clicks}</span><span className="text-[10px] text-gray-500">Clicks</span></div>
                    <button onClick={() => handleToggle(link._id)} className={`px-3 py-1 text-xs rounded-full border ${link.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{link.isActive ? 'Active' : 'Hidden'}</button>
                    <button onClick={() => handleDelete(link._id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              {links.length === 0 && <p className="text-center text-gray-500 py-4">No links added yet.</p>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;