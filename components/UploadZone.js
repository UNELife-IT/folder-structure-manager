'use client';

import { useState, useRef } from 'react';

export default function UploadZone({ onUpload }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.zip')) {
      onUpload(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px'
    }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          width: '100%', maxWidth: '560px',
          padding: '60px 40px',
          border: `2px dashed ${dragging ? 'var(--accent-purple)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius)',
          background: dragging ? 'rgba(139,92,246,0.05)' : 'var(--bg-secondary)',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
        <h2 style={{
          fontSize: '1.3rem', marginBottom: '8px',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Upload a ZIP File
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
          Drag and drop a <strong>.zip</strong> file here, or click to browse.
          <br />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Only folder & file names will be extracted — no file contents are stored.
          </span>
        </p>
        <button style={{
          padding: '10px 28px',
          background: 'var(--gradient-primary)',
          border: 'none', borderRadius: 'var(--radius-sm)',
          color: '#fff', fontWeight: 600, fontSize: '0.95rem',
          cursor: 'pointer'
        }}>
          Browse Files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}