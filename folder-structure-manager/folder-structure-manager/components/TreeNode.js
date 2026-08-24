'use client';

import { useState, useRef } from 'react';

export default function TreeNode({ node, path, depth, onAction, searchTerm, dragState, onDragStart, onDragOver, onDrop }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const inputRef = useRef(null);
  const nodeRef = useRef(null);

  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && node.children && node.children.length > 0;
  const matchesSearch = searchTerm && node.name.toLowerCase().includes(searchTerm.toLowerCase());
  const childMatchesSearch = searchTerm && isFolder && hasDescendantMatch(node, searchTerm);

  // Auto-expand if search matches a descendant
  const isExpanded = searchTerm ? (matchesSearch || childMatchesSearch) : expanded;

  function hasDescendantMatch(n, term) {
    if (!n.children) return false;
    return n.children.some(c =>
      c.name.toLowerCase().includes(term.toLowerCase()) || hasDescendantMatch(c, term)
    );
  }

  const handleRename = () => {
    if (editValue.trim() && editValue !== node.name) {
      onAction('rename', path, editValue.trim());
    }
    setEditing(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAction('contextMenu', path, { x: e.clientX, y: e.clientY });
  };

  const startEditing = () => {
    setEditing(true);
    setEditValue(node.name);
    setTimeout(() => inputRef.current?.select(), 50);
  };

  // Expose startEditing via node action
  if (node._startEdit) {
    node._startEdit = false;
    setTimeout(startEditing, 50);
  }

  const icon = isFolder
    ? (isExpanded ? '📂' : '📁')
    : getFileIcon(node.name);

  const isDragOver = dragState?.overPath === path.join('/');

  return (
    <div>
      <div
        ref={nodeRef}
        draggable={!editing}
        onDragStart={(e) => {
          e.stopPropagation();
          onDragStart(path);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDragOver(path);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDrop(path);
        }}
        onContextMenu={handleContextMenu}
        onDoubleClick={(e) => { e.stopPropagation(); startEditing(); }}
        onClick={() => isFolder && setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 10px',
          paddingLeft: `${depth * 20 + 10}px`,
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          background: isDragOver ? 'rgba(139,92,246,0.15)' :
                      matchesSearch ? 'rgba(20,184,166,0.1)' : 'transparent',
          borderLeft: isDragOver ? '3px solid var(--accent-purple)' : '3px solid transparent',
          transition: 'all 0.1s ease',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => {
          if (!isDragOver) e.currentTarget.style.background = 'var(--bg-hover)';
        }}
        onMouseLeave={(e) => {
          if (!isDragOver && !matchesSearch) e.currentTarget.style.background = 'transparent';
          else if (matchesSearch) e.currentTarget.style.background = 'rgba(20,184,166,0.1)';
        }}
      >
        {/* Expand/collapse arrow */}
        <span style={{
          width: '16px', fontSize: '0.7rem', color: 'var(--text-muted)',
          textAlign: 'center', flexShrink: 0
        }}>
          {isFolder ? (isExpanded ? '▼' : '▶') : ''}
        </span>

        {/* Icon */}
        <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>

        {/* Name */}
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') setEditing(false);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--accent-purple)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              padding: '2px 6px',
              fontSize: '0.85rem',
              outline: 'none',
              flex: 1
            }}
            autoFocus
          />
        ) : (
          <span style={{
            fontSize: '0.85rem',
            color: matchesSearch ? 'var(--accent-teal)' : 'var(--text-primary)',
            fontWeight: matchesSearch ? 600 : 400
          }}>
            {highlightMatch(node.name, searchTerm)}
          </span>
        )}

        {/* Child count badge */}
        {isFolder && hasChildren && (
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            background: 'var(--bg-primary)',
            padding: '1px 6px',
            borderRadius: '10px',
            marginLeft: '4px'
          }}>
            {node.children.length}
          </span>
        )}
      </div>

      {/* Children */}
      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child, i) => (
            <TreeNode
              key={child.id || `${path.join('/')}-${i}`}
              node={child}
              path={[...path, i]}
              depth={depth + 1}
              onAction={onAction}
              searchTerm={searchTerm}
              dragState={dragState}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getFileIcon(name) {
  const ext = name.split('.').pop()?.toLowerCase();
  const icons = {
    js: '🟨', jsx: '⚛️', ts: '🔷', tsx: '⚛️',
    html: '🌐', css: '🎨', scss: '🎨',
    json: '📋', md: '📝', txt: '📄',
    png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', svg: '🖼️', webp: '🖼️',
    pdf: '📕', doc: '📘', docx: '📘', xls: '📗', xlsx: '📗',
    zip: '📦', rar: '📦', tar: '📦', gz: '📦',
    py: '🐍', rb: '💎', go: '🔵', rs: '🦀', java: '☕',
    sh: '🖥️', bat: '🖥️', ps1: '🖥️',
    yml: '⚙️', yaml: '⚙️', toml: '⚙️', ini: '⚙️', env: '⚙️',
    sql: '🗃️', db: '🗃️',
    mp3: '🎵', wav: '🎵', mp4: '🎬', mov: '🎬',
    lock: '🔒', gitignore: '🙈',
  };
  return icons[ext] || '📄';
}

function highlightMatch(text, term) {
  if (!term) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ background: 'rgba(20,184,166,0.3)', borderRadius: '2px', padding: '0 1px' }}>
        {text.slice(idx, idx + term.length)}
      </span>
      {text.slice(idx + term.length)}
    </>
  );
}