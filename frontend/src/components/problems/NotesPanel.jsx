import React, { useState, useEffect, useRef } from 'react';

const NotesPanel = ({ isOpen, initialContent, onClose, onSave }) => {
  const [content, setContent] = useState(initialContent || '');
  const [isSaving, setIsSaving] = useState(false);

  // Position state for dragging
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const panelRef = useRef(null);

  // Sync state if initialContent changes (e.g. switching problems)
  useEffect(() => {
    setContent(initialContent || '');
  }, [initialContent]);

  // Handle drag mechanics
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e) => {
    // Only drag if clicking directly on the header bar, not buttons/inputs
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content);
      onClose();
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      ref={panelRef}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className="absolute w-96 max-w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 flex flex-col space-y-3 z-50 resize overflow-auto min-h-[300px] max-h-[600px]"
    >
      {/* Draggable Header Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between border-b border-slate-800 pb-2 cursor-move select-none"
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <span>📝</span> Problem Notes
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs cursor-pointer"
        >
          ✕
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Jot down hints, patterns, or quick reminders..."
        className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
        rows="8"
      />

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save & Close'}
        </button>
      </div>
    </div>
  );
};

export default NotesPanel;