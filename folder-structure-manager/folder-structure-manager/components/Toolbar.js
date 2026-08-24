'use client';

export default function Toolbar({ onSave, onExport, onReset, searchTerm, onSearchChange, unsavedChanges }) {
  const btnStyle = (color) => ({
    padding: '8px 16px',
    background: color || 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '6px',
    transition: 'all 0.15s ease',
    fontWeight: 500
  });

  return (
    <div style={{
      padding: '12px 24px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex', alignItems: 'center', gap: '10px',
      flexWrap: 'wrap', flexShrink: 0
    }}>
      <button onClick={onSave} style={btnStyle(unsavedChanges ? 'rgba(139,92,246,0.2)' : undefined)}>
        💾 Save
      </button>
      <button onClick={onExport} style={btnStyle()}>
        📥 Export ZIP
      </button>
      <button onClick={onReset} style={btnStyle()}>
        🗑️ Clear & Re-upload
      </button>

      <div style={{ flex: 1 }} />

      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="🔍 Search files & folders..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            padding: '8px 14px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            width: '240px',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      </div>
    </div>
  );
}