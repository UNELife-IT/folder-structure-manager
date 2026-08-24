'use client';

import { useState, useCallback, useRef } from 'react';
import TreeNode from './TreeNode';
import ContextMenu from './ContextMenu';

export default function TreeView({ structure, onChange, searchTerm, addToast, expandAll, issues, treeRef }) {
  const [contextMenu, setContextMenu] = useState(null);
  const [dragState, setDragState] = useState({ dragging: null, dropTarget: null, dropPosition: null });
  const internalRef = useRef(null);

  const containerRef = treeRef || internalRef;

  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  const getNode = (root, path) => {
    let node = root;
    for (const idx of path) {
      if (!node.children || !node.children[idx]) return null;
      node = node.children[idx];
    }
    return node;
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

  const insertAt = (root, parentPath, index, child) => {
    const newRoot = clone(root);
    let parent = newRoot;
    for (const idx of parentPath) {
      parent = parent.children[idx];
    }
    if (!parent.children) parent.children = [];
    parent.children.splice(index, 0, child);
    return newRoot;
  };

  const genId = () => Math.random().toString(36).substr(2, 9);

  // Move a node up within its parent's children
  const handleMoveUp = useCallback((path) => {
    if (path.length === 0) return;
    const index = path[path.length - 1];
    if (index === 0) return;

    const newRoot = clone(structure);
    const parentPath = path.slice(0, -1);
    let parent = newRoot;
    for (const idx of parentPath) {
      parent = parent.children[idx];
    }

    const temp = parent.children[index];
    parent.children[index] = parent.children[index - 1];
    parent.children[index - 1] = temp;

    onChange(newRoot);
    addToast(`Moved "${temp.name}" up`, 'success');
  }, [structure, onChange, addToast]);

  // Move a node down within its parent's children
  const handleMoveDown = useCallback((path) => {
    if (path.length === 0) return;
    const index = path[path.length - 1];

    const newRoot = clone(structure);
    const parentPath = path.slice(0, -1);
    let parent = newRoot;
    for (const idx of parentPath) {
      parent = parent.children[idx];
    }

    if (index >= parent.children.length - 1) return;

    const temp = parent.children[index];
    parent.children[index] = parent.children[index + 1];
    parent.children[index + 1] = temp;

    onChange(newRoot);
    addToast(`Moved "${temp.name}" down`, 'success');
  }, [structure, onChange, addToast]);

  const handleAction = useCallback((action, path, extra) => {
    if (action === 'contextMenu') {
      const node = path.length === 0 ? structure : getNode(structure, path);
      // Figure out isFirst/isLast for context menu
      let isFirst = false;
      let isLast = false;
      if (path.length > 0) {
        const index = path[path.length - 1];
        const parentPath = path.slice(0, -1);
        let parent = structure;
        for (const idx of parentPath) {
          parent = parent.children[idx];
        }
        isFirst = index === 0;
        isLast = index === parent.children.length - 1;
      }
      setContextMenu({ x: extra.x, y: extra.y, path, node, isFirst, isLast });
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
      case 'moveUp': {
        handleMoveUp(path);
        break;
      }
      case 'moveDown': {
        handleMoveDown(path);
        break;
      }
    }
  }, [contextMenu, structure, onChange, addToast, handleMoveUp, handleMoveDown]);

  // --- Drag and drop ---

  const handleDragStart = useCallback((path) => {
    setDragState({ dragging: path, dropTarget: null, dropPosition: null });
  }, []);

  const handleDragOver = useCallback((path, position) => {
    setDragState(prev => ({ ...prev, dropTarget: path, dropPosition: position }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({ dragging: null, dropTarget: null, dropPosition: null });
  }, []);

  const handleDrop = useCallback((targetPath, position) => {
    const { dragging } = dragState;
    if (!dragging) return;

    // Can't drop on itself
    if (dragging.join('/') === targetPath.join('/')) {
      handleDragEnd();
      return;
    }

    // Can't drop into own child
    if (targetPath.join('/').startsWith(dragging.join('/') + '/')) {
      addToast('Cannot move a folder into its own child', 'error');
      handleDragEnd();
      return;
    }

    const dragNode = clone(getNode(structure, dragging));
    if (!dragNode) { handleDragEnd(); return; }

    // Remove the dragged node first
    let newStructure = removeNode(structure, dragging);

    if (position === 'inside') {
      // Drop inside a folder
      // Recalculate targetPath after removal
      const adjustedTarget = adjustPathAfterRemoval(targetPath, dragging);
      const targetNode = getNode(newStructure, adjustedTarget);
      if (targetNode && targetNode.type === 'folder') {
        newStructure = addChild(newStructure, adjustedTarget, dragNode);
      } else {
        // If target isn't a folder, insert after it
        const parentPath = adjustedTarget.slice(0, -1);
        const insertIndex = adjustedTarget[adjustedTarget.length - 1] + 1;
        newStructure = insertAt(newStructure, parentPath, insertIndex, dragNode);
      }
    } else if (position === 'before') {
      const adjustedTarget = adjustPathAfterRemoval(targetPath, dragging);
      const parentPath = adjustedTarget.slice(0, -1);
      const insertIndex = adjustedTarget[adjustedTarget.length - 1];
      newStructure = insertAt(newStructure, parentPath, insertIndex, dragNode);
    } else if (position === 'after') {
      const adjustedTarget = adjustPathAfterRemoval(targetPath, dragging);
      const parentPath = adjustedTarget.slice(0, -1);
      const insertIndex = adjustedTarget[adjustedTarget.length - 1] + 1;
      newStructure = insertAt(newStructure, parentPath, insertIndex, dragNode);
    }

    onChange(newStructure);
    handleDragEnd();
    addToast(`Moved "${dragNode.name}"`, 'success');
  }, [dragState, structure, onChange, addToast, handleDragEnd]);

  // After removing a node, paths that come after it in the same parent shift down by 1
  function adjustPathAfterRemoval(targetPath, removedPath) {
    const adjusted = [...targetPath];

    // Only adjust if they share the same parent
    if (removedPath.length <= targetPath.length) {
      const parentLen = removedPath.length - 1;
      let sameParent = true;
      for (let i = 0; i < parentLen; i++) {
        if (removedPath[i] !== targetPath[i]) {
          sameParent = false;
          break;
        }
      }
      if (sameParent && parentLen < targetPath.length) {
        const removedIndex = removedPath[parentLen];
        const targetIndex = targetPath[parentLen];
        if (targetIndex > removedIndex) {
          adjusted[parentLen] = targetIndex - 1;
        }
      }
    }

    return adjusted;
  }

  const rootChildCount = structure?.children?.length || 0;

  if (!structure) return null;

  return (
    <div
      ref={containerRef}
      data-tree-container="true"
      style={{ minHeight: '100%' }}
      onDragEnd={handleDragEnd}
    >
      {/* Root node */}
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          handleAction('contextMenu', [], { x: e.clientX, y: e.clientY });
        }}
        onDragOver={(e) => {
          e.preventDefault();
          handleDragOver([], 'inside');
        }}
        onDrop={(e) => {
          e.preventDefault();
          handleDrop([], 'inside');
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
          background: (dragState.dropTarget && dragState.dropTarget.length === 0 && dragState.dropPosition === 'inside')
            ? 'rgba(139,92,246,0.15)' : 'transparent'
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
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          isFirst={i === 0}
          isLast={i === rootChildCount - 1}
          siblingCount={rootChildCount}
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
          isFirst={contextMenu.isFirst}
          isLast={contextMenu.isLast}
        />
      )}
    </div>
  );
}
