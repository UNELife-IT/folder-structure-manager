'use client';

import { useEffect, useRef } from 'react';

export default function ContextMenu({ x, y, node, onAction, onClose, isFirst, isLast }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const isFolder = node.type === 'folder';

  const items = [
    ...(isFolder ? [
      { label: '📁 New Folder', action: 'newFolder' },
      { label: '📄 New File', action: 'newFile' },
      { divider: true },
    ] : []),
    { label: '✏️ Rename', action: 'rename' },
    { label: '📋 Duplicate', action: 'duplicate' },
    { divider: true },
    { label: '⬆️ Move Up', action: 'moveUp', disabled: isFirst },
    { label: '⬇️ Move Down', action: 'moveDown', disabled: isLast },
    { divider: true },
    { label: '🗑️ Delete', action: 'delete', danger: true },
  ];

  const menuStyle = {
    position: 'fixed',
    top: y, left: x,
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-lg)',
    padding: '6px 0',
    zIndex: 9999,
    minWidth: '180px'
  };

  const itemStyle = (danger, disabled) => ({
    padding: '8px 16px',
    cursor: disabled ? 'default' : 'pointer',
    fontSize: '0.85rem',
    color: disabled ? 'var(--text-muted)' : danger ? 'var(--accent-red)' : 'var(--text-primary)',
    display: 'flex', alignItems: 'center', gap: '8px',
    transition: 'background 0.1s',
    opacity: disabled ? 0.4 : 1,
  });

  return (
    <div ref={menuRef} style={menuStyle}>
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} style={{ height: 1, background: 'var(--border-color)', margin: '4px 0' }} />
        ) : (
          <div
            key={i}
            style={itemStyle(item.danger, item.disabled)}
            onClick={() => {
              if (item.disabled) return;
              onAction(item.action);
              onClose();
            }}
            onMouseEnter={(e) => { if (!item.disabled) e.target.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
          >
            {item.label}
          </div>
        )
      )}
    </div>
  );
}
