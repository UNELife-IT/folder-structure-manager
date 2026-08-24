// Lightweight DOM-to-PNG screenshot utility — no external dependencies
// Reads data attributes from tree nodes and renders to canvas

export async function captureElement(element) {
  const treeData = extractTreeData(element);
  return renderTreeToCanvas(treeData);
}

function extractTreeData(element) {
  const items = [];
  const rows = element.querySelectorAll('[data-tree-node]');

  rows.forEach(row => {
    items.push({
      depth: parseInt(row.getAttribute('data-depth') || '0'),
      name: row.getAttribute('data-name') || '',
      type: row.getAttribute('data-type') || 'file',
      icon: row.getAttribute('data-icon') || '📄',
      childCount: row.getAttribute('data-children') || '',
      isExpanded: row.getAttribute('data-expanded') === 'true',
      hasIssue: row.getAttribute('data-has-issue') === 'true',
      issueSeverity: row.getAttribute('data-issue-severity') || ''
    });
  });

  return items;
}

function renderTreeToCanvas(items) {
  const FONT_SIZE = 14;
  const LINE_HEIGHT = 28;
  const INDENT = 24;
  const PADDING_X = 32;
  const PADDING_Y = 24;
  const HEADER_HEIGHT = 52;
  const FOOTER_HEIGHT = 40;

  // Calculate width based on longest name
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${FONT_SIZE}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

  let maxTextWidth = 300;
  items.forEach(item => {
    const textWidth = ctx.measureText(item.name).width + (item.depth * INDENT) + 80;
    if (textWidth > maxTextWidth) maxTextWidth = textWidth;
  });

  const width = Math.max(Math.ceil(maxTextWidth) + PADDING_X * 2, 400);
  const height = HEADER_HEIGHT + (items.length * LINE_HEIGHT) + PADDING_Y * 2 + FOOTER_HEIGHT;

  // Set canvas size (2x for retina)
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(scale, scale);

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#0f0f1a');
  bgGrad.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = bgGrad;
  roundRect(ctx, 0, 0, width, height, 12);
  ctx.fill();

  // Border
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
  ctx.lineWidth = 1;
  roundRect(ctx, 0.5, 0.5, width - 1, height - 1, 12);
  ctx.stroke();

  // Header background
  const headerGrad = ctx.createLinearGradient(0, 0, width, 0);
  headerGrad.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
  headerGrad.addColorStop(1, 'rgba(20, 184, 166, 0.15)');
  ctx.fillStyle = headerGrad;
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(width - 12, 0);
  ctx.quadraticCurveTo(width, 0, width, 12);
  ctx.lineTo(width, HEADER_HEIGHT);
  ctx.lineTo(0, HEADER_HEIGHT);
  ctx.lineTo(0, 12);
  ctx.quadraticCurveTo(0, 0, 12, 0);
  ctx.closePath();
  ctx.fill();

  // Header divider
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
  ctx.beginPath();
  ctx.moveTo(0, HEADER_HEIGHT);
  ctx.lineTo(width, HEADER_HEIGHT);
  ctx.stroke();

  // Header title
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const titleGrad = ctx.createLinearGradient(PADDING_X + 28, 0, PADDING_X + 250, 0);
  titleGrad.addColorStop(0, '#8b5cf6');
  titleGrad.addColorStop(1, '#14b8a6');
  ctx.fillStyle = titleGrad;
  ctx.fillText('🗂️  Folder Structure', PADDING_X, HEADER_HEIGHT / 2 + 6);

  // Item count
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  const countText = `${items.length} items`;
  const countWidth = ctx.measureText(countText).width;
  ctx.fillText(countText, width - PADDING_X - countWidth, HEADER_HEIGHT / 2 + 5);

  // Draw tree items
  const startY = HEADER_HEIGHT + PADDING_Y;

  items.forEach((item, index) => {
    const x = PADDING_X + (item.depth * INDENT);
    const itemY = startY + (index * LINE_HEIGHT);

    // Alternating row background
    if (index % 2 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      ctx.fillRect(PADDING_X - 8, itemY - LINE_HEIGHT / 2 + 4, width - PADDING_X * 2 + 16, LINE_HEIGHT);
    }

    // Issue indicator bar
    if (item.hasIssue) {
      const issueColor = item.issueSeverity === 'error' ? '#ef4444' :
                         item.issueSeverity === 'warning' ? '#f59e0b' : '#14b8a6';
      ctx.fillStyle = issueColor;
      ctx.fillRect(PADDING_X - 8, itemY - LINE_HEIGHT / 2 + 4, 3, LINE_HEIGHT);
    }

    // Tree connector lines
    if (item.depth > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      const lineX = PADDING_X + ((item.depth - 1) * INDENT) + 8;
      ctx.beginPath();
      ctx.moveTo(lineX, itemY - LINE_HEIGHT / 2 + 4);
      ctx.lineTo(lineX, itemY + 4);
      ctx.lineTo(lineX + INDENT - 12, itemY + 4);
      ctx.stroke();
    }

    // Expand/collapse arrow for folders
    if (item.type === 'folder') {
      ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillText(item.isExpanded ? '▼' : '▶', x, itemY + 5);
    }

    // Icon
    ctx.font = `${FONT_SIZE}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(item.icon, x + 16, itemY + 5);

    // Name
    ctx.font = `${item.type === 'folder' ? 'bold ' : ''}${FONT_SIZE}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = item.type === 'folder' ? '#e2e8f0' : 'rgba(255,255,255,0.7)';
    ctx.fillText(item.name, x + 38, itemY + 5);

    // Child count badge
    if (item.childCount && parseInt(item.childCount) > 0) {
      const nameWidth = ctx.measureText(item.name).width;
      ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const badgeText = item.childCount;
      const badgeWidth = ctx.measureText(badgeText).width + 10;
      const badgeX = x + 38 + nameWidth + 8;

      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      roundRect(ctx, badgeX, itemY - 5, badgeWidth, 18, 9);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillText(badgeText, badgeX + 5, itemY + 5);
    }

    // Issue dot
    if (item.hasIssue) {
      const issueColor = item.issueSeverity === 'error' ? '#ef4444' :
                         item.issueSeverity === 'warning' ? '#f59e0b' : '#14b8a6';
      ctx.font = `bold ${FONT_SIZE}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      const nameWidth = ctx.measureText(item.name).width;
      const dotX = x + 38 + nameWidth + (item.childCount ? 40 : 8);

      ctx.fillStyle = issueColor;
      ctx.beginPath();
      ctx.arc(dotX + 4, itemY + 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Footer divider
  const footerY = height - FOOTER_HEIGHT;
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.beginPath();
  ctx.moveTo(PADDING_X, footerY);
  ctx.lineTo(width - PADDING_X, footerY);
  ctx.stroke();

  // Footer text
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  const now = new Date();
  const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
  ctx.fillText(`Generated: ${dateStr}`, PADDING_X, footerY + 22);

  const watermark = 'Folder Structure Manager';
  const wmWidth = ctx.measureText(watermark).width;
  ctx.fillText(watermark, width - PADDING_X - wmWidth, footerY + 22);

  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function downloadCanvas(canvas, filename = 'folder-structure.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
