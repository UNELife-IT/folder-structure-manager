'use client';

import { useState, useCallback, useRef } from 'react';
import TreeNode from './TreeNode';
import ContextMenu from './ContextMenu';

export default function TreeView({ structure, onChange, searchTerm, addToast, expandAll, issues, treeRef }) {
  const [contextMenu, setContextMenu] = useState(null);
  const [dragState, setDragState] = useState({ dragging: null, overPath: null });
  const internalRef = useRef(null);

  // Use external ref if provided, otherwise internal
  const containerRef = treeRef || internalRef;

  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  const getNode = (root, path) => {
    let node = root;
    for (const idx of path) {
      node = node.children[idx];
    }
    return node;
  };

  const setNode = (root, path, value) => {
    const newRoot = clone(root);
    if (path.length === 0) return value;
    let parent = newRoot;
    for (let i = 0; i < path.length - 1; i++) {
      parent = parent.children[path[i]];
    }
    parent.children[path[path.length - 1]] = value;
    return newRoot;
  };

  const removeNode = (root, path) => {
    const newRoot = clone(root);
    let parent = newRoot;
    for (let i = 0; i < path.length - 1; i++) {
      parent = parent.children[path[i]];
    }
    parent.children.splice(path[path.length - 1], 1);
    return newRoot;
  };

  const addChild = (root, path, child) => {
    const newRoot = clone(root);
    let parent = newRoot;
    for (const idx of path) {
      parent = parent.children[idx];
    }
    if (!parent.children) parent.children = [];
    parent.children.push(child);
    return newRoot;
  };

  const genId = () => Math.random().toString(36).substr(2, 9);

  const handleAction = useCallback((action, path, extra) => {
    if (action === 'contextMenu') {
      const node = path.length === 0 ? structure : getNode(structure, path);
      setContextMenu({ x: extra.x, y: extra.y, path, node });
      return;
    }

    if (action === 'rename') {
      const newRoot = clone(structure);
      let node = newRoot;
      for (const idx of path) node = node.children[idx];
      node.name = extra;
      onChange(newRoot);
      addToast(`Renamed to "${extra}"`, 'success');
      return;
    }
  }, [structure, onChange, addToast]);

  const handleContextAction = useCallback((action) => {
    if (!contextMenu) return;
    const { path } = contextMenu;

    switch (action) {
      case 'newFolder': {
        const name = prompt('Folder name:');
        if (!name) return;
        const child = { id: genId(), name, type: 'folder', children: [] };
        onChange(addChild(structure, path, child));
        addToast(`Created folder "${name}"`, 'success');
        break;
      }
      case 'newFile': {
        const name = prompt('File name (include extension):');
        if (!name) return;
        const child = { id: genId(), name, type: 'file' };
        onChange(addChild(structure, path, child));
        addToast(`Created file "${name}"`, 'success');
        break;
      }
      case 'rename': {
        const node = getNode(structure, path);
        const name = prompt('New name:', node.name);
        if (!name || name === node.name) return;
        const newRoot = clone(structure);
        let target = newRoot;
        for (const idx of path) target = target.children[idx];
        target.name = name;
        onChange(newRoot);
        addToast(`Renamed to "${name}"`, 'success');
        break;
      }
      case 'duplicate': {
        const node = clone(getNode(structure, path));
        node.id = genId();
        node.name = node.name + ' (copy)';
        const assignIds = (n) => { n.id = genId(); if (n.children) n.children.forEach(assignIds); };
        assignIds(node);
        const parentPath = path.slice(0, -1);
        onChange(addChild(structure, parentPath.length ? parentPath : [], node));
        addToast(`Duplicated "${node.name}"`, 'success');
        break;
      }
      case 'delete': {
        const node = getNode(structure, path);
        if (!confirm(`Delete "${node.name}"?`)) return;
        onChange(removeNode(structure, path));
        addToast(`Deleted "${node.name}"`, 'success');
        break;
      }
    }
  }, [contextMenu, structure, onChange, addToast]);

  const handleDragStart = useCallback((path) => {
    setDragState(prev => ({ ...prev, dragging: path }));
  }, []);

  const handleDragOver = useCallback((path) => {
    setDragState(prev => ({ ...prev, overPath: path.join('/') }));
  }, []);

  const handleDrop = useCallback((targetPath) => {
    const { dragging } = dragState;
    if (!dragging) return;

    if (dragging.join('/') === targetPath.join('/')) {
      setDragState({ dragging: null, overPath: null });
      return;
    }

    if (targetPath.join('/').startsWith(dragging.join('/') + '/')) {
      addToast('Cannot move a folder into its own child', 'error');
      setDragState({ dragging: null, overPath: null });
      return;
    }

    const dragNode = clone(getNode(structure, dragging));
    let newStructure = removeNode(structure, dragging);

    const targetNode = getNode(newStructure, targetPath);
    if (targetNode.type === 'folder') {
      newStructure = addChild(newStructure, targetPath, dragNode);
    } else {
      const parentPath = targetPath.slice(0, -1);
      newStructure = addChild(newStructure, parentPath.length ? parentPath : [], dragNode);
    }

    onChange(newStructure);
    setDragState({ dragging: null, overPath: null });
    addToast(`Moved "${dragNode.name}"`, 'success');
  }, [dragState, structure, onChange, addToast]);

  if (!structure) return null;

  return (
    <div
      ref={containerRef}
      data-tree-container="true"
      style={{ minHeight: '100%' }}
      onDragEnd={() => setDragState({ dragging: null, overPath: null })}
    >
      {/* Root node */}
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          handleAction('contextMenu', [], { x: e.clientX, y: e.clientY });
        }}
        onDragOver={(e) => {
          e.preventDefault();
          handleDragOver([]);
        }}
        onDrop={(e) => {
          e.preventDefault();
          handleDrop([]);
        }}
        data-tree-node="true"
        data-depth="0"
        data-name={structure.name}
        data-type="folder"
        data-icon="📂"
        data-children={structure.children?.length || 0}
        data-expanded="true"
        data-has-issue="false"
        data-issue-severity=""
        style={{
          padding: '8px 10px',
          display: 'flex', alignItems: 'center', gap: '8px',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          background: dragState.overPath === '' ? 'rgba(139,92,246,0.15)' : 'transparent'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ fontSize: '1.1rem' }}>📂</span>
        <span style={{
          fontWeight: 700, fontSize: '0.95rem',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          {structure.name}
        </span>
        <span style={{
          fontSize: '0.7rem', color: 'var(--text-muted)',
          background: 'var(--bg-primary)', padding: '1px 6px',
          borderRadius: '10px'
        }}>
          {structure.children?.length || 0}
        </span>
      </div>

      {/* Children */}
      {structure.children?.map((child, i) => (
        <TreeNode
          key={child.id || i}
          node={child}
          path={[i]}
          depth={1}
          onAction={handleAction}
          searchTerm={searchTerm}
          dragState={dragState}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          expandAll={expandAll}
          issues={issues}
        />
      ))}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onAction={handleContextAction}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
