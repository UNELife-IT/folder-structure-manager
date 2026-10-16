import JSZip from 'jszip';
import { NextResponse } from 'next/server';

function addToZip(zip, node, parentPath = '') {
  const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;

  if (node.type === 'folder') {
    // Force directory entry by adding path with trailing slash
    zip.file(currentPath + '/', '', { dir: true });

    if (node.children && node.children.length > 0) {
      node.children.forEach(child => addToZip(zip, child, currentPath));
    }
  } else {
    zip.file(currentPath, '');
  }
}

export async function POST(request) {
  try {
    const { structure } = await request.json();
    const zip = new JSZip();

    if (structure.children) {
      structure.children.forEach(child => addToZip(zip, child, structure.name));
    }

    const content = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="folder-structure.zip"'
      }
    });
  } catch (err) {
    console.error('Export error:', err);
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}
