function drawRing(canvas, pct, color, trackColor) {
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.clientWidth || 128;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2, cy = size / 2, r = size / 2 - 9;
  const start = -Math.PI / 2;
  const clamped = Math.max(0, Math.min(1, pct));

  ctx.lineWidth = 12;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = trackColor;
  ctx.stroke();

  if (clamped > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, start + Math.PI * 2 * clamped);
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}
