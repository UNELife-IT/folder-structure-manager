import { NextResponse } from 'next/server';
import { pool, ensureTable } from '../../../db/index.js';

const STRUCTURE_ID = 'default';

// GET — Load current structure
export async function GET() {
  try {
    await ensureTable();

    const result = await pool.query(
      'SELECT structure, updated_at FROM folder_structures WHERE id = $1',
      [STRUCTURE_ID]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ structure: null });
    }

    const row = result.rows[0];
    return NextResponse.json({
      structure: row.structure,
      lastModified: row.updated_at
    });
  } catch (err) {
    console.error('GET structure error:', err);
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}

// PUT — Save structure
export async function PUT(request) {
  try {
    await ensureTable();

    const { structure } = await request.json();

    await pool.query(
      `INSERT INTO folder_structures (id, structure, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (id)
       DO UPDATE SET structure = $2, updated_at = NOW()`,
      [STRUCTURE_ID, JSON.stringify(structure)]
    );

    return NextResponse.json({
      success: true,
      savedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('PUT structure error:', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

// DELETE — Clear structure
export async function DELETE() {
  try {
    await ensureTable();

    await pool.query(
      'DELETE FROM folder_structures WHERE id = $1',
      [STRUCTURE_ID]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE structure error:', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
