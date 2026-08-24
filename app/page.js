'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import TreeView from '../components/TreeView';
import UploadZone from '../components/UploadZone';
import Toolbar from '../components/Toolbar';

export default function Home() {
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState([]);
  const autoSaveRef = useRef(null);
  const pollRef = useRef(null);
  const structureRef = useRef(structure);

  // Keep ref in sync
  useEffect(() => {
    structureRef.current = structure;
  }, [structure]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Load structure from server
  const loadStructure = useCallback(async (silent = false) => {
    try {
      const res = await fetch('/api/structure');
      const data = await res.json();
      if (data.structure) {
        setStructure(data.structure);
        setLastSaved(data.lastModified ? new Date(data.lastModified) : null);
        if (!silent) setLoading(false);
      } else {
        setStructure(null);
        if (!silent) setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load structure:', err);
      if (!silent) setLoading(false);
    }
  }, []);

  // Save structure to server
  const saveStructure = useCallback(async (data) => {
    const toSave = data || structureRef.current;
    if (!toSave) return;
    try {
      const res = await fetch('/api/structure', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ structure: toSave }),
      });
      if (res.ok) {
        setLastSaved(new Date());
        setUnsavedChanges(false);
        addToast('Changes saved', 'success');
      }
    } catch (err) {
      console.error('Failed to save:', err);
      addToast('Failed to save changes', 'error');
    }
  }, [addToast]);

  // Initial load
  useEffect(() => {
    loadStructure();
  }, [loadStructure]);

  // Polling for real-time collaboration (every 10 seconds)
  useEffect(() => {
    pollRef.current = setInterval(() => {
      loadStructure(true);
    }, 10000);
    return () => clearInterval(pollRef.current);
  }, [loadStructure]);

  // Auto-save every 5 minutes
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (structureRef.current) {
        saveStructure();
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(autoSaveRef.current);
  }, [saveStructure]);

  // Handle structure updates from tree operations
  const handleStructureChange = useCallback((newStructure) => {
    setStructure(newStructure);
    setUnsavedChanges(true);
  }, []);

  // Handle ZIP upload
   const handleUpload = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const text = await res.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Response was not JSON:', text);
        addToast('Server error — check console for details', 'error');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        console.error('Upload API error:', data);
        addToast(data.error || 'Upload failed', 'error');
        setLoading(false);
        return;
      }

      if (data.structure) {
        setStructure(data.structure);
        setLastSaved(new Date());
        setUnsavedChanges(false);
        addToast('ZIP uploaded and parsed successfully', 'success');
      } else {
        addToast('No structure found in ZIP', 'error');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      addToast('Upload failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);
  
  // Export as ZIP
  const handleExport = useCallback(async () => {
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ structure }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'folder-structure.zip';
      a.click();
      URL.revokeObjectURL(url);
      addToast('Structure exported as ZIP', 'success');
    } catch (err) {
      console.error('Export failed:', err);
      addToast('Export failed', 'error');
    }
  }, [structure, addToast]);

  // Reset / upload new
  const handleReset = useCallback(async () => {
    if (!confirm('Are you sure you want to clear the current structure? This cannot be undone.')) return;
    try {
      await fetch('/api/structure', { method: 'DELETE' });
      setStructure(null);
      setUnsavedChanges(false);
      addToast('Structure cleared', 'info');
    } catch (err) {
      addToast('Failed to clear structure', 'error');
    }
  }, [addToast]);

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--bg-primary)'
      }}>
        <div style={{
          textAlign: 'center', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '16px'
        }}>
          <div style={{
            width: 48, height: 48, border: '3px solid var(--border-color)',
            borderTopColor: 'var(--accent-purple)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading structure...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>🗂️</span>
          <h1 style={{
            fontSize: '1.3rem', fontWeight: 700,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Folder Structure Manager
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {lastSaved && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {unsavedChanges && (
            <span style={{
              fontSize: '0.75rem', color: 'var(--accent-orange)',
              padding: '2px 8px', background: 'rgba(245,158,11,0.1)',
              borderRadius: '4px'
            }}>
              Unsaved changes
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {!structure ? (
          <UploadZone onUpload={handleUpload} />
        ) : (
          <>
            <Toolbar
              onSave={() => saveStructure()}
              onExport={handleExport}
              onReset={handleReset}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              unsavedChanges={unsavedChanges}
            />
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
              <TreeView
                structure={structure}
                onChange={handleStructureChange}
                searchTerm={searchTerm}
                addToast={addToast}
              />
            </div>
          </>
        )}
      </main>

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
        ))}
      </div>
    </div>
  );
}
