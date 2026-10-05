import { useState, useEffect } from 'react';
import { useTabs } from '../../context/TabContext';
import api from '../../services/api';

export default function ProblemForm({ initialData = null, onSuccess }) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    problem: initialData?.problem || '',
    name: initialData?.name || '',
    difficulty: initialData?.difficulty || 'easy',
    description: initialData?.description || '',
    constraints: initialData?.constraints || '',
    notes: initialData?.notes || '',
    template: initialData?.template || '', // Added template field
    stars: initialData?.stars || 5,
    tags: initialData?.tags?.map((t) => (typeof t === 'object' ? t._id : t)) || [],
    examples: initialData?.examples || [],
    solutions: initialData?.solutions || [],
  });

  const [availableTags, setAvailableTags] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { activeTabId, replaceTab } = useTabs();

  // Fetch tags and languages on mount using Axios
  useEffect(() => {
    async function fetchMetadata() {
      try {
        const [tagsRes, langsRes] = await Promise.all([
          api.get('tags'),
          api.get('languages'),
        ]);

        setAvailableTags(tagsRes.data);
        setAvailableLanguages(langsRes.data);
      } catch (err) {
        console.error('Failed to fetch metadata:', err);
      }
    }
    fetchMetadata();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tagId);
      return {
        ...prev,
        tags: exists ? prev.tags.filter((id) => id !== tagId) : [...prev.tags, tagId],
      };
    });
  };

  // --- Example Handlers ---
  const addExample = () => {
    setFormData((prev) => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '', images: [] }],
    }));
  };

  const updateExample = (index, field, value) => {
    const updated = [...formData.examples];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, examples: updated }));
  };

  const removeExample = (index) => {
    setFormData((prev) => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index),
    }));
  };

  const addImageToExample = (exIndex) => {
    const updated = [...formData.examples];
    if (!updated[exIndex].images) updated[exIndex].images = [];
    updated[exIndex].images.push({ url: '', key: '' });
    setFormData((prev) => ({ ...prev, examples: updated }));
  };

  const updateExampleImage = (exIndex, imgIndex, field, value) => {
    const updated = [...formData.examples];
    updated[exIndex].images[imgIndex][field] = value;
    setFormData((prev) => ({ ...prev, examples: updated }));
  };

  const removeExampleImage = (exIndex, imgIndex) => {
    const updated = [...formData.examples];
    updated[exIndex].images = updated[exIndex].images.filter((_, i) => i !== imgIndex);
    setFormData((prev) => ({ ...prev, examples: updated }));
  };

  // --- Solution Handlers ---
  const addSolution = () => {
    setFormData((prev) => ({
      ...prev,
      solutions: [
        ...prev.solutions,
        {
          language: availableLanguages[0]?._id || '',
          approach: '',
          explanation: '',
          code: '',
          timeComplexity: '',
          spaceComplexity: '',
        },
      ],
    }));
  };

  const updateSolution = (index, field, value) => {
    const updated = [...formData.solutions];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, solutions: updated }));
  };

  const removeSolution = (index) => {
    setFormData((prev) => ({
      ...prev,
      solutions: prev.solutions.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = async (exIndex, imgIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);
    
    // Pass along problem ID if available
    if (initialData?._id) {
      uploadData.append('problemId', initialData._id);
    } else if (formData.problem) {
      uploadData.append('problemId', formData.problem);
    }

    try {
      setLoading(true);
      const response = await api.post('/uploadImage', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { url, key } = response.data;

      // Update the specific example image fields with the S3 response
      const updated = [...formData.examples];
      updated[exIndex].images[imgIndex] = { url, key };
      setFormData((prev) => ({ ...prev, examples: updated }));
    } catch (err) {
      console.error('Image upload failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  // --- Submit Handler using Axios ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isEditing ? `problems/${initialData._id}` : 'problems';

    try {
      const payload = {
        ...formData,
        problem: Number(formData.problem),
        stars: Number(formData.stars),
      };

      let response;
      if (isEditing) {
        response = await api.put(endpoint, payload);
      } else {
        response = await api.post(endpoint, payload);
      }

      const savedProblem = response.data;

      // 1. Instantly replace the current tab (transforms 'create-problem' into the new problem tab, 
      // or updates the existing one with fresh data & title)
      replaceTab(activeTabId, savedProblem);

      // 2. Trigger parent success callback if any (e.g., to refresh the sidebar list)
      if (onSuccess) onSuccess(savedProblem);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white">
          {isEditing ? `Edit Problem #${initialData.problem}` : 'Create New Problem'}
        </h2>
      </div>

      {error && (
        <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Problem Number</label>
          <input
            type="number"
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            required
            min="1"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Problem Name (Slug)</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Stars (1-10)</label>
          <input
            type="number"
            name="stars"
            value={formData.stars}
            onChange={handleChange}
            required
            min="1"
            max="10"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Tags Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const isSelected = formData.tags.includes(tag._id);
            return (
              <button
                type="button"
                key={tag._id}
                onClick={() => handleTagToggle(tag._id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          maxLength="1500"
          rows="3"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Constraints</label>
        <textarea
          name="constraints"
          value={formData.constraints}
          onChange={handleChange}
          required
          maxLength="1000"
          rows="2"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Quick Notes</label>
        <input
          type="text"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          required
          maxLength="1500"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Starter Template Section */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Starter Template Code</label>
        <textarea
          name="template"
          value={formData.template}
          onChange={handleChange}
          required
          maxLength="10000"
          rows="6"
          placeholder="Enter the default starter code skeleton..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Examples Section */}
      <div className="space-y-4 border-t border-slate-800 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Examples</h3>
          <button
            type="button"
            onClick={addExample}
            className="text-sm bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            + Add Example
          </button>
        </div>

        {formData.examples.map((ex, exIndex) => (
          <div key={exIndex} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 relative">
            <button
              type="button"
              onClick={() => removeExample(exIndex)}
              className="absolute top-3 right-3 text-slate-500 hover:text-red-400"
            >
              ✕
            </button>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Input</label>
                <input
                  type="text"
                  value={ex.input}
                  onChange={(e) => updateExample(exIndex, 'input', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Output</label>
                <input
                  type="text"
                  value={ex.output}
                  onChange={(e) => updateExample(exIndex, 'output', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Explanation</label>
              <textarea
                value={ex.explanation}
                onChange={(e) => updateExample(exIndex, 'explanation', e.target.value)}
                rows="2"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
              />
            </div>

            {/* Images Array */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Example Images</span>
                <button
                  type="button"
                  onClick={() => addImageToExample(exIndex)}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  + Add Image Slot
                </button>
              </div>
              
              {ex.images?.map((img, imgIndex) => (
                <div key={imgIndex} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Image #{imgIndex + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExampleImage(exIndex, imgIndex)}
                      className="text-slate-500 hover:text-red-400 text-xs"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Desktop File Picker */}
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Upload from Desktop</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(exIndex, imgIndex, e)}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                    />
                  </div>

                  {/* Preview / Read-Only or Editable URLs */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">S3 URL</label>
                      <input
                        type="text"
                        placeholder="Auto-filled after upload"
                        value={img.url}
                        onChange={(e) => updateExampleImage(exIndex, imgIndex, 'url', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">S3 Key</label>
                      <input
                        type="text"
                        placeholder="Auto-filled after upload"
                        value={img.key}
                        onChange={(e) => updateExampleImage(exIndex, imgIndex, 'key', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Solutions Section */}
      <div className="space-y-4 border-t border-slate-800 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Solutions</h3>
          <button
            type="button"
            onClick={addSolution}
            className="text-sm bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            + Add Solution
          </button>
        </div>

        {formData.solutions.map((sol, solIndex) => (
          <div key={solIndex} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 relative">
            <button
              type="button"
              onClick={() => removeSolution(solIndex)}
              className="absolute top-3 right-3 text-slate-500 hover:text-red-400"
            >
              ✕
            </button>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Language</label>
                <select
                  value={sol.language}
                  onChange={(e) => updateSolution(solIndex, 'language', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
                >
                  <option value="">Select Language</option>
                  {availableLanguages.map((lang) => (
                    <option key={lang._id} value={lang._id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Approach (Max 100 chars)</label>
                <input
                  type="text"
                  maxLength="100"
                  value={sol.approach}
                  onChange={(e) => updateSolution(solIndex, 'approach', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Time Complexity</label>
                <input
                  type="text"
                  value={sol.timeComplexity}
                  onChange={(e) => updateSolution(solIndex, 'timeComplexity', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
                  placeholder="e.g. O(n)"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Space Complexity</label>
                <input
                  type="text"
                  value={sol.spaceComplexity}
                  onChange={(e) => updateSolution(solIndex, 'spaceComplexity', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
                  placeholder="e.g. O(1)"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Explanation</label>
              <textarea
                value={sol.explanation}
                onChange={(e) => updateSolution(solIndex, 'explanation', e.target.value)}
                rows="2"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Code</label>
              <textarea
                value={sol.code}
                onChange={(e) => updateSolution(solIndex, 'code', e.target.value)}
                rows="4"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm font-mono text-white"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Problem' : 'Create Problem'}
        </button>
      </div>
    </form>
  );
}