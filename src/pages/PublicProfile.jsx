import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ExternalLink, Share2, CheckCircle, User } from 'lucide-react';
import { API_BASE_URL } from '../utils/apiConfig';

const PublicProfile = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => { fetchProfile(); }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/profile/${username}`);
      setData(data);
    } catch (error) { console.error(error); toast.error('Profile not found'); } 
    finally { setLoading(false); }
  };

  const handleLinkClick = async (linkId, url) => {
    try { await axios.patch(`${API_BASE_URL}/links/${linkId}/click`); } catch (error) {}
    window.open(url, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;

  if (!data || !data.profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <User size={64} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h1>
        <p className="text-gray-600">The user @{username} does not exist.</p>
        <Link to="/" className="mt-6 text-green-600 hover:underline font-medium">Go Home</Link>
      </div>
    );
  }

  const { profile, links } = data;
  const isDark = profile.theme === 'dark';
  const bgClass = isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800';
  const cardClass = isDark ? 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700' : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className={`min-h-screen flex flex-col items-center py-12 px-4 transition-colors duration-300 ${bgClass}`}>
      <div className="w-full max-w-md text-center mb-10 animate-fade-in-down">
        <div className="relative inline-block group">
          <img src={profile.profileImage || `https://ui-avatars.com/api/?name=${profile.fullName}&background=random`} alt={profile.fullName} className="w-28 h-28 rounded-full mx-auto border-4 border-white shadow-xl object-cover transition-transform transform group-hover:scale-105" />
        </div>
        <h1 className="text-2xl font-bold mt-4">{profile.fullName}</h1>
        <p className="text-sm opacity-70 font-medium">@{profile.username}</p>
        {profile.bio && <p className="mt-3 text-sm max-w-xs mx-auto leading-relaxed opacity-90">{profile.bio}</p>}
        <button onClick={copyToClipboard} className={`mt-6 flex items-center justify-center gap-2 mx-auto text-xs px-4 py-2 rounded-full transition-all duration-200 border ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-100 shadow-sm'}`}>
          {copied ? <CheckCircle size={14} className="text-green-500" /> : <Share2 size={14} />}
          {copied ? 'Copied!' : 'Share Profile'}
        </button>
      </div>

      <div className="w-full max-w-md space-y-4">
        {links.length === 0 ? (
          <div className={`text-center p-8 rounded-xl border border-dashed ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'}`}><p>No links added yet.</p></div>
        ) : (
          links.map((link) => (
            <button key={link._id} onClick={() => handleLinkClick(link._id, link.url)} className={`w-full p-4 rounded-xl shadow-sm border flex items-center justify-between group transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${cardClass}`}>
              <span className="font-semibold truncate mr-4">{link.title}</span>
              <ExternalLink size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>
          ))
        )}
      </div>

      <div className="mt-16 text-xs opacity-40"><p>Powered by Mini Link SaaS</p></div>
    </div>
  );
};
export default PublicProfile