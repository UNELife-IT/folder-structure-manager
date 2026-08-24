import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

const BLOB_PREFIX = 'folder-structure';
const BLOB_FILENAME = `${BLOB_PREFIX}/structure.json`;

async function findBlob() {
  const { blobs } = await list({ prefix: BLOB_PREFIX });
  return blobs.find(b => b.pathname === BLOB_FILENAME);
}

// GET — Load current structure
export async function GET() {
  try {
    const blob = await findBlob();
    if (!blob) {
      return NextResponse.json({ structure: null });
    }
    const res = await fetch(blob.url);
    const data = await res.json();
    return NextResponse.json({
      structure: data,
      lastModified: blob.uploadedAt
    });
  } catch (err) {
    console.error('GET structure error:', err);
    return NextResponse.json({ structure: null });
  }
}

// PUT — Save structure
export async function PUT(request) {
  try {
    const { structure } = await request.json();

    // Delete old blob if exists
    const existing = await findBlob();
    if (existing) {
      await del(existing.url);
    }

    // Save new
    const blob = await put(BLOB_FILENAME, JSON.stringify(structure), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    console.error('PUT structure error:', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

// DELETE — Clear structure
export async function DELETE() {
  try {
    const existing = await findBlob();
    if (existing) {
      await del(existing.url);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE structure error:', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
