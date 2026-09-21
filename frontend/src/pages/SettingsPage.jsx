import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const [languageName, setLanguageName] = useState('');
  const [tagName, setTagName] = useState('');

  // State for fetched lists
  const [languages, setLanguages] = useState([]);
  const [tags, setTags] = useState([]);

  // Loading & Feedback messages
  const [loadingLang, setLoadingLang] = useState(false);
  const [loadingTag, setLoadingTag] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchLanguages();
    fetchTags();
  }, []);

  const fetchLanguages = async () => {
    try {
      const res = await api.get('/languages');
      setLanguages(res.data);
    } catch (err) {
      console.error('Error fetching languages:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await api.get('/tags');
      setTags(res.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const handleAddLanguage = async (e) => {
    e.preventDefault();
    if (!languageName.trim()) return;

    setLoadingLang(true);
    setMessage({ text: '', type: '' });

    try {
      await api.post('/languages', { name: languageName.toLowerCase().trim() });
      setLanguageName('');
      fetchLanguages();
      setMessage({ text: 'Language added successfully!', type: 'success' });
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Error adding language. It might already exist.', 
        type: 'error' 
      });
    } finally {
      setLoadingLang(false);
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    setLoadingTag(true);
    setMessage({ text: '', type: '' });

    try {
      await api.post('/tags', { name: tagName.toLowerCase().trim() });
      setTagName('');
      fetchTags();
      setMessage({ text: 'Tag added successfully!', type: 'success' });
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Error adding tag. It might already exist.', 
        type: 'error' 
      });
    } finally {
      setLoadingTag(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-4 mb-1">
            <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium translate-y-0.5">
              &larr; Back
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Settings</h1>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {message.text && (
          <div className={`p-4 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section: Languages */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                Programming Languages
              </h2>
              
              <form onSubmit={handleAddLanguage} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Language Name</label>
                  <input
                    type="text"
                    value={languageName}
                    onChange={(e) => setLanguageName(e.target.value)}
                    placeholder="e.g., python, javascript"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingLang || !languageName.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  {loadingLang ? 'Adding...' : 'Add Language'}
                </button>
              </form>

              {/* Existing Items List */}
              <div className="mt-6">
                <h3 className="text-xs uppercase font-semibold text-slate-400 mb-2">Existing Languages ({languages.length})</h3>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                  {languages.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No languages added yet.</p>
                  ) : (
                    languages.map((lang) => (
                      <span key={lang._id} className="bg-slate-800 text-indigo-300 px-3 py-1 rounded-md text-sm border border-slate-700">
                        {lang.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Tags */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Problem Tags
              </h2>
              
              <form onSubmit={handleAddTag} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Tag Name</label>
                  <input
                    type="text"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    placeholder="e.g., two-pointer, dynamic-programming"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingTag || !tagName.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  {loadingTag ? 'Adding...' : 'Add Tag'}
                </button>
              </form>

              {/* Existing Items List */}
              <div className="mt-6">
                <h3 className="text-xs uppercase font-semibold text-slate-400 mb-2">Existing Tags ({tags.length})</h3>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                  {tags.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No tags added yet.</p>
                  ) : (
                    tags.map((tag) => (
                      <span key={tag._id} className="bg-slate-800 text-emerald-300 px-3 py-1 rounded-md text-sm border border-slate-700">
                        {tag.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SettingsPage