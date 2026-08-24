'use client';

export default function Toolbar({
  onSave, onExport, onReset, searchTerm, onSearchChange,
  unsavedChanges, onExpandAll, onCollapseAll, onScan, scanning,
  issueCount, onFixAll
}) {
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
    fontWeight: 500,
    whiteSpace: 'nowrap'
  });

  const separatorStyle = {
    width: '1px',
    height: '28px',
    background: 'var(--border-color)',
    margin: '0 4px'
  };

  return (
    <div style={{
      padding: '12px 24px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex', alignItems: 'center', gap: '8px',
      flexWrap: 'wrap', flexShrink: 0
    }}>
      {/* File Operations */}
      <button onClick={onSave} style={btnStyle(unsavedChanges ? 'rgba(139,92,246,0.2)' : undefined)}>
        💾 Save
      </button>
      <button onClick={onExport} style={btnStyle()}>
        📥 Export ZIP
      </button>
      <button onClick={onReset} style={btnStyle()}>
        🗑️ Clear
      </button>

      <div style={separatorStyle} />

      {/* View Controls */}
      <button onClick={onExpandAll} style={btnStyle()}>
        🔽 Expand All
      </button>
      <button onClick={onCollapseAll} style={btnStyle()}>
        🔼 Collapse All
      </button>

      <div style={separatorStyle} />

      {/* Spell & Grammar Check */}
      <button
        onClick={onScan}
        disabled={scanning}
        style={{
          ...btnStyle('rgba(20,184,166,0.15)'),
          border: '1px solid rgba(20,184,166,0.3)',
          color: 'var(--accent-teal)',
          opacity: scanning ? 0.6 : 1
        }}
      >
        {scanning ? '⏳ Scanning...' : '🔍 Scan Names'}
      </button>

      {issueCount > 0 && (
        <button
          onClick={onFixAll}
          style={{
            ...btnStyle('rgba(139,92,246,0.2)'),
            border: '1px solid rgba(139,92,246,0.4)',
            color: '#fff',
            background: 'var(--gradient-primary)',
            fontWeight: 600
          }}
        >
          🔧 Fix All ({issueCount})
        </button>
      )}

      <div style={{ flex: 1 }} />

      {/* Search */}
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
