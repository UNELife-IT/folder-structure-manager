import JSZip from 'jszip';
import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

const BLOB_PREFIX = 'folder-structure';
const BLOB_FILENAME = `${BLOB_PREFIX}/structure.json`;

function buildTree(paths) {
  const root = {
    id: 'root',
    name: 'Root',
    type: 'folder',
    children: []
  };

  const genId = () => Math.random().toString(36).substr(2, 9);

  for (const filePath of paths) {
    const parts = filePath.split('/').filter(Boolean);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const isFolder = filePath.endsWith('/') ? true : !isLast;

      let existing = current.children.find(c => c.name === part);

      if (!existing) {
        existing = {
          id: genId(),
          name: part,
          type: isFolder ? 'folder' : 'file',
          ...(isFolder ? { children: [] } : {})
        };
        current.children.push(existing);
      }

      if (existing.type === 'folder') {
        current = existing;
      }
    }
  }

  const sortChildren = (node) => {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortChildren);
    }
  };
  sortChildren(root);

  if (root.children.length === 1 && root.children[0].type === 'folder') {
    const topFolder = root.children[0];
    root.name = topFolder.name;
    root.children = topFolder.children;
  }

  return root;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file as ArrayBuffer directly — works reliably on Vercel
    const arrayBuffer = await file.arrayBuffer();
    
    let zip;
    try {
      zip = await JSZip.loadAsync(arrayBuffer);
    } catch (zipError) {
      console.error('JSZip parse error:', zipError);
      return NextResponse.json({ error: 'Invalid ZIP file. Please ensure you are uploading a valid .zip file.' }, { status: 400 });
    }

    const paths = Object.keys(zip.files)
      .filter(p => !p.startsWith('__MACOSX') && !p.includes('.DS_Store') && !p.startsWith('.'))
      .sort();

    if (paths.length === 0) {
      return NextResponse.json({ error: 'ZIP file appears to be empty' }, { status: 400 });
    }

    const structure = buildTree(paths);

    // Delete old blob
    try {
      const { blobs } = await list({ prefix: BLOB_PREFIX });
      for (const blob of blobs) {
        await del(blob.url);
      }
    } catch (e) {
      console.error('Failed to clean old blobs:', e);
    }

    // Save to Vercel Blob
    await put(BLOB_FILENAME, JSON.stringify(structure), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    return NextResponse.json({ structure });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to process ZIP: ' + err.message }, { status: 500 });
  }
}
