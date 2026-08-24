'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import TreeView from '../components/TreeView';
import UploadZone from '../components/UploadZone';
import Toolbar from '../components/Toolbar';
import SpellChecker from '../components/SpellChecker';
import { captureElement, downloadCanvas } from '../components/ScreenshotHelper';

// Natural sort comparator
function naturalCompare(a, b) {
  const ax = [];
  const bx = [];

  a.replace(/(\d+)|(\D+)/g, (_, $1, $2) => { ax.push([$1 || Infinity, $2 || '']); });
  b.replace(/(\d+)|(\D+)/g, (_, $1, $2) => { bx.push([$1 || Infinity, $2 || '']); });

  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();

    const nn = (an[0] === Infinity ? 0 : Number(an[0])) - (bn[0] === Infinity ? 0 : Number(bn[0]));
    if (nn) return nn;

    const ss = an[1].localeCompare(bn[1], undefined, { sensitivity: 'base' });
    if (ss) return ss;
  }

  return ax.length - bx.length;
}

// Recursively sort all children: folders first, then natural/numerical order
function sortStructure(node) {
  if (!node || !node.children) return node;

  node.children.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return naturalCompare(a.name.toLowerCase(), b.name.toLowerCase());
  });

  node.children.forEach(child => {
    if (child.type === 'folder') {
      sortStructure(child);
    }
  });

  return node;
}

// Recursively remove .gitkeep files from the structure
function removeGitkeep(node) {
  if (!node || !node.children) return node;

  node.children = node.children.filter(child => {
    if (child.type === 'file' && child.name === '.gitkeep') return false;
    return true;
  });

  node.children.forEach(child => {
    if (child.type === 'folder') {
      removeGitkeep(child);
    }
  });

  return node;
}

// Helper: clean structure (remove .gitkeep then sort)
function cleanStructure(data) {
  return sortStructure(removeGitkeep(JSON.parse(JSON.stringify(data))));
}

export default function Home() {
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState([]);
  const [expandAll, setExpandAll] = useState(null);
  const [issues, setIssues] = useState([]);
  const [scanning, setScanning] = useState(false);
  const autoSaveRef = useRef(null);
  const pollRef = useRef(null);
  const structureRef = useRef(structure);
  const unsavedRef = useRef(unsavedChanges);
  const savingRef = useRef(false);
  const lastSaveTimeRef = useRef(0);
  const serverTimestampRef = useRef(null);
  const treeRef = useRef(null);
  const justSavedRef = useRef(false);
  const SAVE_COOLDOWN = 15000;
  const POST_SAVE_BLOCK = 5000; // Block polls for 5s after saving

  useEffect(() => {
    structureRef.current = structure;
  }, [structure]);

  useEffect(() => {
    unsavedRef.current = unsavedChanges;
  }, [unsavedChanges]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const loadStructure = useCallback(async (silent = false) => {
    // Block silent polls if we have unsaved changes, are saving, or just saved
    if (silent && unsavedRef.current) return;
    if (silent && savingRef.current) return;
    if (silent && justSavedRef.current) return;
    if (silent && (Date.now() - lastSaveTimeRef.current) < SAVE_COOLDOWN) return;

    try {
      // Add cache-busting to the API call itself
      const res = await fetch('/api/structure?_t=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) {
        if (!silent) setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.structure) {
        const serverTime = data.lastModified ? new Date(data.lastModified).getTime() : 0;

        // For silent polls, only update if server data is genuinely newer
        if (silent && serverTimestampRef.current && serverTime <= serverTimestampRef.current) {
          return;
        }

        if (!unsavedRef.current) {
          setStructure(cleanStructure(data.structure));
          serverTimestampRef.current = serverTime;
        }

        setLastSaved(data.lastModified ? new Date(data.lastModified) : null);
      } else {
        if (!unsavedRef.current) {
          setStructure(null);
        }
      }

      if (!silent) setLoading(false);
    } catch (err) {
      console.error('Failed to load structure:', err);
      if (!silent) setLoading(false);
    }
  }, []);

  const saveStructure = useCallback(async (data) => {
    const toSave = data || structureRef.current;
    if (!toSave) return;
    if (savingRef.current) return;
    savingRef.current = true;
    justSavedRef.current = true;

    const sorted = cleanStructure(toSave);

    try {
      const res = await fetch('/api/structure', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ structure: sorted }),
      });

      if (res.ok) {
        const result = await res.json();
        const now = Date.now();
        lastSaveTimeRef.current = now;
        serverTimestampRef.current = now;
        setStructure(sorted);
        setLastSaved(new Date());
        setUnsavedChanges(false);
        addToast('Changes saved', 'success');

        // Block polls for POST_SAVE_BLOCK ms to let Vercel Blob propagate
        setTimeout(() => {
          justSavedRef.current = false;
        }, POST_SAVE_BLOCK);
      } else {
        addToast('Failed to save changes', 'error');
        justSavedRef.current = false;
      }
    } catch (err) {
      console.error('Failed to save:', err);
      addToast('Failed to save changes', 'error');
      justSavedRef.current = false;
    } finally {
      savingRef.current = false;
    }
  }, [addToast]);

  useEffect(() => {
    loadStructure();
  }, [loadStructure]);

  useEffect(() => {
    pollRef.current = setInterval(() => {
      loadStructure(true);
    }, 10000);
    return () => clearInterval(pollRef.current);
  }, [loadStructure]);

  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (unsavedRef.current && structureRef.current) {
        saveStructure();
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(autoSaveRef.current);
  }, [saveStructure]);

  const handleStructureChange = useCallback((newStructure) => {
    if (!newStructure) return;
    const sorted = cleanStructure(newStructure);
    setStructure(sorted);
    setUnsavedChanges(true);
    setIssues([]);
  }, []);

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
        const sorted = cleanStructure(data.structure);
        setStructure(sorted);
        const now = Date.now();
        lastSaveTimeRef.current = now;
        serverTimestampRef.current = now;
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

  const handleExport = useCallback(async () => {
    const toExport = structureRef.current;
    if (!toExport) return;

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ structure: toExport }),
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
  }, [addToast]);

  const handleReset = useCallback(async () => {
    if (!confirm('Are you sure you want to clear the current structure? This cannot be undone.')) return;
    try {
      await fetch('/api/structure', { method: 'DELETE' });
      setStructure(null);
      setUnsavedChanges(false);
      setIssues([]);
      lastSaveTimeRef.current = Date.now();
      serverTimestampRef.current = null;
      addToast('Structure cleared', 'info');
    } catch (err) {
      addToast('Failed to clear structure', 'error');
    }
  }, [addToast]);

  const handleScan = useCallback(() => {
    if (!structure) return;
    setScanning(true);
    const checker = new SpellChecker();
    const found = checker.scanStructure(structure);
    setIssues(found);
    setScanning(false);
    if (found.length === 0) {
      addToast('No issues found — all names look good!', 'success');
    } else {
      addToast(`Found ${found.length} issue${found.length > 1 ? 's' : ''}`, 'info');
    }
  }, [structure, addToast]);

  const handleFixAll = useCallback(() => {
    if (!structure || issues.length === 0) return;
    const fixable = issues.filter(i => i.suggestion);
    if (fixable.length === 0) {
      addToast('No auto-fixable issues', 'info');
      return;
    }
    if (!confirm(`Apply ${fixable.length} fix${fixable.length > 1 ? 'es' : ''}?`)) return;

    let newStructure = JSON.parse(JSON.stringify(structure));

    const sorted = [...fixable].sort((a, b) => b.path.length - a.path.length);

    for (const issue of sorted) {
      let node = newStructure;
      let valid = true;
      for (const idx of issue.path) {
        if (!node.children || !node.children[idx]) { valid = false; break; }
        node = node.children[idx];
      }
      if (valid && node) {
        node.name = issue.suggestion;
      }
    }

    const cleaned = cleanStructure(newStructure);
    setStructure(cleaned);
    setUnsavedChanges(true);
    setIssues([]);
    addToast(`Applied ${fixable.length} fix${fixable.length > 1 ? 'es' : ''}`, 'success');
  }, [structure, issues, addToast]);

  const handleFixSingle = useCallback((issue) => {
    if (!issue.suggestion || !structure) return;
    let newStructure = JSON.parse(JSON.stringify(structure));
    let node = newStructure;
    for (const idx of issue.path) {
      if (!node.children || !node.children[idx]) return;
      node = node.children[idx];
    }
    if (node) {
      node.name = issue.suggestion;
    }
    const cleaned = cleanStructure(newStructure);
    setStructure(cleaned);
    setUnsavedChanges(true);
    setIssues(prev => prev.filter(i => i.id !== issue.id));
    addToast(`Fixed: "${issue.original}" → "${issue.suggestion}"`, 'success');
  }, [structure, addToast]);

  // Screenshot handler
  const handleScreenshot = useCallback(async () => {
    if (!treeRef.current) {
      addToast('No structure to capture', 'error');
      return;
    }
    try {
      addToast('Capturing screenshot...', 'info');
      const canvas = await captureElement(treeRef.current);
      downloadCanvas(canvas, `folder-structure-${Date.now()}.png`);
      addToast('Screenshot downloaded!', 'success');
    } catch (err) {
      console.error('Screenshot failed:', err);
      addToast('Screenshot failed: ' + err.message, 'error');
    }
  }, [addToast]);

  // Remove .gitkeep handler
  const handleRemoveGitkeep = useCallback(() => {
    if (!structure) return;
    const cleaned = cleanStructure(structure);
    const before = JSON.stringify(structure);
    const after = JSON.stringify(cleaned);
    if (before === after) {
      addToast('No .gitkeep files found', 'info');
      return;
    }
    setStructure(cleaned);
    setUnsavedChanges(true);
    addToast('Removed all .gitkeep files', 'success');
  }, [structure, addToast]);

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
              ● Unsaved changes
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
              onExpandAll={() => setExpandAll(true)}
              onCollapseAll={() => setExpandAll(false)}
              onScan={handleScan}
              scanning={scanning}
              issueCount={issues.length}
              onFixAll={handleFixAll}
              onScreenshot={handleScreenshot}
              onRemoveGitkeep={handleRemoveGitkeep}
            />

            {/* Issues Panel */}
            {issues.length > 0 && (
              <div style={{
                padding: '12px 24px',
                background: 'rgba(245,158,11,0.05)',
                borderBottom: '1px solid var(--border-color)',
                maxHeight: '200px',
                overflowY: 'auto',
                flexShrink: 0
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-orange)',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    ⚠️ {issues.length} issue{issues.length > 1 ? 's' : ''} found
                  </span>
                  <button
                    onClick={() => setIssues([])}
                    style={{
                      background: 'none', border: 'none', color: 'var(--text-muted)',
                      cursor: 'pointer', fontSize: '0.8rem'
                    }}
                  >
                    ✕ Dismiss
                  </button>
                </div>
                {issues.map(issue => (
                  <div key={issue.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '6px 10px', marginBottom: '4px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    borderLeft: `3px solid ${issue.severity === 'error' ? 'var(--accent-red)' : issue.severity === 'warning' ? 'var(--accent-orange)' : 'var(--accent-teal)'}`
                  }}>
                    <span style={{ flexShrink: 0 }}>
                      {issue.severity === 'error' ? '🔴' : issue.severity === 'warning' ? '🟡' : '🔵'}
                    </span>
                    <span style={{ flex: 1, color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{issue.original}</strong>
                      {' — '}{issue.message}
                      {issue.suggestion && (
                        <span style={{ color: 'var(--accent-teal)' }}> → {issue.suggestion}</span>
                      )}
                    </span>
                    <span style={{
                      fontSize: '0.7rem', color: 'var(--text-muted)',
                      background: 'var(--bg-primary)', padding: '2px 6px',
                      borderRadius: '4px', flexShrink: 0
                    }}>
                      {issue.category}
                    </span>
                    {issue.suggestion && (
                      <button
                        onClick={() => handleFixSingle(issue)}
                        style={{
                          padding: '3px 10px',
                          background: 'rgba(20,184,166,0.15)',
                          border: '1px solid rgba(20,184,166,0.3)',
                          borderRadius: '4px',
                          color: 'var(--accent-teal)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          flexShrink: 0,
                          fontWeight: 600
                        }}
                      >
                        Fix
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
              <TreeView
                structure={structure}
                onChange={handleStructureChange}
                searchTerm={searchTerm}
                addToast={addToast}
                expandAll={expandAll}
                issues={issues}
                treeRef={treeRef}
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
