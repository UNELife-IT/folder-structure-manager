'use client';

import { useState, useRef, useEffect } from 'react';

export default function TreeNode({
  node, path, depth, onAction, searchTerm, dragState,
  onDragStart, onDragOver, onDrop, expandAll, issues,
  onMoveUp, onMoveDown, isFirst, isLast
}) {
  const [localExpanded, setLocalExpanded] = useState(depth < 2);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef(null);
  const nodeRef = useRef(null);

  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && node.children && node.children.length > 0;
  const matchesSearch = searchTerm && node.name.toLowerCase().includes(searchTerm.toLowerCase());
  const childMatchesSearch = searchTerm && isFolder && hasDescendantMatch(node, searchTerm);

  const pathStr = path.join('/');
  const nodeIssues = issues ? issues.filter(i => i.path.join('/') === pathStr) : [];
  const hasIssues = nodeIssues.length > 0;
  const worstSeverity = hasIssues
    ? (nodeIssues.some(i => i.severity === 'error') ? 'error'
      : nodeIssues.some(i => i.severity === 'warning') ? 'warning' : 'info')
    : null;

  useEffect(() => {
    if (expandAll === true) setLocalExpanded(true);
    if (expandAll === false) setLocalExpanded(false);
  }, [expandAll]);

  const isExpanded = searchTerm
    ? (matchesSearch || childMatchesSearch)
    : localExpanded;

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

  if (node._startEdit) {
    node._startEdit = false;
    setTimeout(startEditing, 50);
  }

  const icon = isFolder
    ? (isExpanded ? '📂' : '📁')
    : getFileIcon(node.name);

  const isDragOver = dragState?.overPath === path.join('/');

  const issueIndicatorColor = worstSeverity === 'error' ? 'var(--accent-red)'
    : worstSeverity === 'warning' ? 'var(--accent-orange)' : 'var(--accent-teal)';

  const moveBtnStyle = (disabled) => ({
    background: 'none',
    border: 'none',
    color: disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
    cursor: disabled ? 'default' : 'pointer',
    fontSize: '0.75rem',
    padding: '2px 4px',
    borderRadius: '3px',
    opacity: disabled ? 0.3 : 0.7,
    transition: 'all 0.15s ease',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

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
        onClick={() => isFolder && setLocalExpanded(!localExpanded)}
        onMouseEnter={(e) => {
          setHovered(true);
          if (!isDragOver) e.currentTarget.style.background = 'var(--bg-hover)';
        }}
        onMouseLeave={(e) => {
          setHovered(false);
          if (!isDragOver && !matchesSearch) e.currentTarget.style.background = 'transparent';
          else if (matchesSearch) e.currentTarget.style.background = 'rgba(20,184,166,0.1)';
        }}
        // Data attributes for screenshot capture
        data-tree-node="true"
        data-depth={depth}
        data-name={node.name}
        data-type={node.type}
        data-icon={icon}
        data-children={hasChildren ? node.children.length : ''}
        data-expanded={isExpanded}
        data-has-issue={hasIssues}
        data-issue-severity={worstSeverity || ''}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 10px',
          paddingLeft: `${depth * 20 + 10}px`,
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          background: isDragOver ? 'rgba(139,92,246,0.15)' :
                      matchesSearch ? 'rgba(20,184,166,0.1)' : 'transparent',
          borderLeft: isDragOver ? '3px solid var(--accent-purple)'
            : hasIssues ? `3px solid ${issueIndicatorColor}`
            : '3px solid transparent',
          transition: 'all 0.1s ease',
          userSelect: 'none'
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
            fontWeight: matchesSearch ? 600 : 400,
            textDecoration: hasIssues && worstSeverity === 'error' ? 'wavy underline red' :
                           hasIssues && worstSeverity === 'warning' ? 'wavy underline orange' :
                           hasIssues ? 'wavy underline teal' : 'none',
            textUnderlineOffset: '3px'
          }}>
            {highlightMatch(node.name, searchTerm)}
          </span>
        )}

        {/* Issue indicator */}
        {hasIssues && (
          <span
            title={nodeIssues.map(i => i.message).join('\n')}
            style={{
              fontSize: '0.7rem',
              color: issueIndicatorColor,
              background: `${issueIndicatorColor}15`,
              padding: '1px 6px',
              borderRadius: '10px',
              border: `1px solid ${issueIndicatorColor}40`,
              flexShrink: 0,
              cursor: 'help'
            }}
          >
            {worstSeverity === 'error' ? '🔴' : worstSeverity === 'warning' ? '🟡' : '🔵'} {nodeIssues.length}
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

        {/* Move up/down buttons — only visible on hover */}
        {hovered && !editing && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
              marginLeft: 'auto',
              flexShrink: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isFirst) onMoveUp(path);
              }}
              disabled={isFirst}
              title="Move up"
              style={moveBtnStyle(isFirst)}
              onMouseEnter={(e) => { if (!isFirst) e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--accent-purple)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = isFirst ? '0.3' : '0.7'; e.currentTarget.style.color = isFirst ? 'var(--text-muted)' : 'var(--text-secondary)'; }}
            >
              ▲
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isLast) onMoveDown(path);
              }}
              disabled={isLast}
              title="Move down"
              style={moveBtnStyle(isLast)}
              onMouseEnter={(e) => { if (!isLast) e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--accent-purple)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = isLast ? '0.3' : '0.7'; e.currentTarget.style.color = isLast ? 'var(--text-muted)' : 'var(--text-secondary)'; }}
            >
              ▼
            </button>
          </div>
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
              expandAll={expandAll}
              issues={issues}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              isFirst={i === 0}
              isLast={i === node.children.length - 1}
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
