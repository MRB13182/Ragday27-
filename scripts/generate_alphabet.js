import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OUT_DIR = path.resolve('SuperAdmin/Jersey Custom Font');
const W = 1054;
const H = 1492;

const FILL = '#00F7FA';
const STROKE = '#FCD903';
const STROKE_WIDTH = 25;

// Baseline definitions matching existing 0-9
const Y_TOP = 160;
const Y_BOT = 1338;
const HEIGHT = Y_BOT - Y_TOP; // 1178
const Y_MID = Math.round((Y_TOP + Y_BOT) / 2); // 749

const STEM = 248; // standard stem thickness
const BAR = 228;  // standard horizontal bar thickness
const MID_BAR = 216; // middle bar thickness

// Standard bounds
const X_LEFT = 92;
const X_RIGHT = 962;
const WIDTH = X_RIGHT - X_LEFT; // 870

// Helper to format SVG
function makeSvg(pathsD) {
  const d = Array.isArray(pathsD) ? pathsD.join(' ') : pathsD;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <path d="${d}" fill-rule="evenodd" fill="${FILL}" stroke="${STROKE}" stroke-width="${STROKE_WIDTH}" stroke-linejoin="round" stroke-linecap="round" />
  </svg>`;
}

// Letter definitions
const letters = {};

// --- A ---
// Athletic A: angled legs or chamfered top, counter hole, horizontal crossbar
letters['A'] = (() => {
  const xL = 82, xR = 972;
  const yB = Y_BOT, yT = Y_TOP;
  const midY = 820;
  const barH = 190;
  // Outer silhouette:
  // Starts bottom left, goes up to top with chamfer, down to bottom right,
  // then cut up the center between legs
  const outer = `
    M ${xL} ${yB}
    L ${xL + 70} ${yB}
    L 410 ${yT + 120}
    L 470 ${yT}
    L 584 ${yT}
    L 644 ${yT + 120}
    L ${xR - 70} ${yB}
    L ${xR} ${yB}
    L 640 ${yT + 30}
    L 580 ${yT}
    L 474 ${yT}
    L 414 ${yT + 30}
    Z
  `;
  // Let us make A with clean athletic block construction
  // Outer polygon:
  const polyOuter = `
    M ${xL} ${yB}
    L ${xL + 210} ${yB}
    L 390 ${midY + barH}
    L 664 ${midY + barH}
    L 744 ${yB}
    L ${xR} ${yB}
    L 620 ${yT}
    L 434 ${yT}
    Z
  `;
  // Inner counter triangular / trapezoid hole:
  const innerHole = `
    M 527 ${yT + 250}
    L 624 ${midY}
    L 430 ${midY}
    Z
  `;
  // Bottom opening between legs:
  // (Handled by outer path shape going up between legs)
  const athleticA = `
    M ${xL} ${yB}
    L 430 ${yT + 10}
    Q 527 ${yT - 30} 624 ${yT + 10}
    L ${xR} ${yB}
    L ${xR - 220} ${yB}
    L 654 ${midY + barH}
    L 400 ${midY + barH}
    L ${xL + 220} ${yB}
    Z
    M 527 ${yT + 260}
    L 616 ${midY}
    L 438 ${midY}
    Z
  `;
  return athleticA;
})();

// --- B ---
letters['B'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 20;
  const yT = Y_TOP, yB = Y_BOT;
  const rO = 140, rI = 70;
  const outer = `
    M ${xL} ${yT}
    L ${xR - rO} ${yT}
    Q ${xR} ${yT} ${xR} ${yT + rO}
    L ${xR} ${Y_MID - 60}
    Q ${xR} ${Y_MID} ${xR - 80} ${Y_MID}
    Q ${xR + 20} ${Y_MID} ${xR + 20} ${Y_MID + 60}
    L ${xR + 20} ${yB - rO}
    Q ${xR + 20} ${yB} ${xR + 20 - rO} ${yB}
    L ${xL} ${yB}
    Z
  `;
  const holeTop = `
    M ${xL + STEM} ${yT + BAR}
    L ${xR - STEM - rI} ${yT + BAR}
    Q ${xR - STEM} ${yT + BAR} ${xR - STEM} ${yT + BAR + rI}
    L ${xR - STEM} ${Y_MID - 80 - rI}
    Q ${xR - STEM} ${Y_MID - 80} ${xR - STEM - rI} ${Y_MID - 80}
    L ${xL + STEM} ${Y_MID - 80}
    Z
  `;
  const holeBot = `
    M ${xL + STEM} ${Y_MID + 80}
    L ${xR - STEM + 20 - rI} ${Y_MID + 80}
    Q ${xR - STEM + 20} ${Y_MID + 80} ${xR - STEM + 20} ${Y_MID + 80 + rI}
    L ${xR - STEM + 20} ${yB - BAR - rI}
    Q ${xR - STEM + 20} ${yB - BAR} ${xR - STEM + 20 - rI} ${yB - BAR}
    L ${xL + STEM} ${yB - BAR}
    Z
  `;
  return `${outer} ${holeTop} ${holeBot}`;
})();

// --- C ---
letters['C'] = (() => {
  const xL = X_LEFT, xR = X_RIGHT;
  const yT = Y_TOP, yB = Y_BOT;
  const rO = 150, rI = 80;
  const cutGapY1 = Y_MID - 120;
  const cutGapY2 = Y_MID + 120;
  return `
    M ${xR} ${cutGapY1}
    L ${xR} ${yT + rO}
    Q ${xR} ${yT} ${xR - rO} ${yT}
    L ${xL + rO} ${yT}
    Q ${xL} ${yT} ${xL} ${yT + rO}
    L ${xL} ${yB - rO}
    Q ${xL} ${yB} ${xL + rO} ${yB}
    L ${xR - rO} ${yB}
    Q ${xR} ${yB} ${xR} ${yB - rO}
    L ${xR} ${cutGapY2}
    L ${xR - BAR} ${cutGapY2}
    L ${xR - BAR} ${yB - BAR - rI}
    Q ${xR - BAR} ${yB - BAR} ${xR - BAR - rI} ${yB - BAR}
    L ${xL + STEM + rI} ${yB - BAR}
    Q ${xL + STEM} ${yB - BAR} ${xL + STEM} ${yB - BAR - rI}
    L ${xL + STEM} ${yT + BAR + rI}
    Q ${xL + STEM} ${yT + BAR} ${xL + STEM + rI} ${yT + BAR}
    L ${xR - BAR - rI} ${yT + BAR}
    Q ${xR - BAR} ${yT + BAR} ${xR - BAR} ${yT + BAR + rI}
    L ${xR - BAR} ${cutGapY1}
    Z
  `;
})();

// --- D ---
letters['D'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT;
  const yT = Y_TOP, yB = Y_BOT;
  const rO = 280, rI = 140;
  const outer = `
    M ${xL} ${yT}
    L ${xR - rO} ${yT}
    Q ${xR} ${yT} ${xR} ${yT + rO}
    L ${xR} ${yB - rO}
    Q ${xR} ${yB} ${xR - rO} ${yB}
    L ${xL} ${yB}
    Z
  `;
  const hole = `
    M ${xL + STEM} ${yT + BAR}
    L ${xR - STEM - rI} ${yT + BAR}
    Q ${xR - STEM} ${yT + BAR} ${xR - STEM} ${yT + BAR + rI}
    L ${xR - STEM} ${yB - BAR - rI}
    Q ${xR - STEM} ${yB - BAR} ${xR - STEM - rI} ${yB - BAR}
    L ${xL + STEM} ${yB - BAR}
    Z
  `;
  return `${outer} ${hole}`;
})();

// --- E ---
letters['E'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 20;
  const yT = Y_TOP, yB = Y_BOT;
  const midH = MID_BAR;
  const midW = xR - 90;
  return `
    M ${xL} ${yT}
    L ${xR} ${yT}
    L ${xR} ${yT + BAR}
    L ${xL + STEM} ${yT + BAR}
    L ${xL + STEM} ${Y_MID - midH / 2}
    L ${midW} ${Y_MID - midH / 2}
    L ${midW} ${Y_MID + midH / 2}
    L ${xL + STEM} ${Y_MID + midH / 2}
    L ${xL + STEM} ${yB - BAR}
    L ${xR} ${yB - BAR}
    L ${xR} ${yB}
    L ${xL} ${yB}
    Z
  `;
})();

// --- F ---
letters['F'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 20;
  const yT = Y_TOP, yB = Y_BOT;
  const midH = MID_BAR;
  const midW = xR - 90;
  return `
    M ${xL} ${yT}
    L ${xR} ${yT}
    L ${xR} ${yT + BAR}
    L ${xL + STEM} ${yT + BAR}
    L ${xL + STEM} ${Y_MID - midH / 2}
    L ${midW} ${Y_MID - midH / 2}
    L ${midW} ${Y_MID + midH / 2}
    L ${xL + STEM} ${Y_MID + midH / 2}
    L ${xL + STEM} ${yB}
    L ${xL} ${yB}
    Z
  `;
})();

// --- G ---
letters['G'] = (() => {
  const xL = X_LEFT, xR = X_RIGHT;
  const yT = Y_TOP, yB = Y_BOT;
  const rO = 150, rI = 80;
  const spurY = Y_MID - 20;
  const spurInX = Y_MID - 40;
  return `
    M ${xR} ${Y_MID - 120}
    L ${xR} ${yT + rO}
    Q ${xR} ${yT} ${xR - rO} ${yT}
    L ${xL + rO} ${yT}
    Q ${xL} ${yT} ${xL} ${yT + rO}
    L ${xL} ${yB - rO}
    Q ${xL} ${yB} ${xL + rO} ${yB}
    L ${xR - rO} ${yB}
    Q ${xR} ${yB} ${xR} ${yB - rO}
    L ${xR} ${spurY}
    L ${spurInX} ${spurY}
    L ${spurInX} ${spurY + BAR}
    L ${xR - STEM} ${spurY + BAR}
    L ${xR - STEM} ${yB - BAR - rI}
    Q ${xR - STEM} ${yB - BAR} ${xR - STEM - rI} ${yB - BAR}
    L ${xL + STEM + rI} ${yB - BAR}
    Q ${xL + STEM} ${yB - BAR} ${xL + STEM} ${yB - BAR - rI}
    L ${xL + STEM} ${yT + BAR + rI}
    Q ${xL + STEM} ${yT + BAR} ${xL + STEM + rI} ${yT + BAR}
    L ${xR - BAR - rI} ${yT + BAR}
    Q ${xR - BAR} ${yT + BAR} ${xR - BAR} ${yT + BAR + rI}
    L ${xR - BAR} ${Y_MID - 120}
    Z
  `;
})();

// --- H ---
letters['H'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 20;
  const yT = Y_TOP, yB = Y_BOT;
  const midH = MID_BAR;
  return `
    M ${xL} ${yT}
    L ${xL + STEM} ${yT}
    L ${xL + STEM} ${Y_MID - midH / 2}
    L ${xR - STEM} ${Y_MID - midH / 2}
    L ${xR - STEM} ${yT}
    L ${xR} ${yT}
    L ${xR} ${yB}
    L ${xR - STEM} ${yB}
    L ${xR - STEM} ${Y_MID + midH / 2}
    L ${xL + STEM} ${Y_MID + midH / 2}
    L ${xL + STEM} ${yB}
    L ${xL} ${yB}
    Z
  `;
})();

// --- I ---
// Athletic slab I with top and bottom crossbars
letters['I'] = (() => {
  const wI = 460;
  const xL = Math.round((W - wI) / 2);
  const xR = xL + wI;
  const yT = Y_TOP, yB = Y_BOT;
  const stemW = 250;
  const sL = Math.round((W - stemW) / 2);
  const sR = sL + stemW;
  return `
    M ${xL} ${yT}
    L ${xR} ${yT}
    L ${xR} ${yT + BAR}
    L ${sR} ${yT + BAR}
    L ${sR} ${yB - BAR}
    L ${xR} ${yB - BAR}
    L ${xR} ${yB}
    L ${xL} ${yB}
    L ${xL} ${yB - BAR}
    L ${sL} ${yB - BAR}
    L ${sL} ${yT + BAR}
    L ${xL} ${yT + BAR}
    Z
  `;
})();

// --- J ---
letters['J'] = (() => {
  const xL = X_LEFT + 40, xR = X_RIGHT - 40;
  const yT = Y_TOP, yB = Y_BOT;
  const rO = 240, rI = 120;
  return `
    M ${xR - STEM} ${yT}
    L ${xR} ${yT}
    L ${xR} ${yB - rO}
    Q ${xR} ${yB} ${xR - rO} ${yB}
    L ${xL + rO} ${yB}
    Q ${xL} ${yB} ${xL} ${yB - rO}
    L ${xL} ${Y_MID + 100}
    L ${xL + STEM} ${Y_MID + 100}
    L ${xL + STEM} ${yB - BAR - rI}
    Q ${xL + STEM} ${yB - BAR} ${xL + STEM + rI} ${yB - BAR}
    L ${xR - STEM - rI} ${yB - BAR}
    Q ${xR - STEM} ${yB - BAR} ${xR - STEM} ${yB - BAR - rI}
    Z
  `;
})();

// --- K ---
letters['K'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 10;
  const yT = Y_TOP, yB = Y_BOT;
  return `
    M ${xL} ${yT}
    L ${xL + STEM} ${yT}
    L ${xL + STEM} ${Y_MID - 140}
    L ${xR - 220} ${yT}
    L ${xR} ${yT}
    L 500 ${Y_MID}
    L ${xR} ${yB}
    L ${xR - 220} ${yB}
    L ${xL + STEM} ${Y_MID + 140}
    L ${xL + STEM} ${yB}
    L ${xL} ${yB}
    Z
  `;
})();

// --- L ---
letters['L'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 20;
  const yT = Y_TOP, yB = Y_BOT;
  return `
    M ${xL} ${yT}
    L ${xL + STEM} ${yT}
    L ${xL + STEM} ${yB - BAR}
    L ${xR} ${yB - BAR}
    L ${xR} ${yB}
    L ${xL} ${yB}
    Z
  `;
})();

// --- M ---
letters['M'] = (() => {
  const xL = 60, xR = W - 60;
  const yT = Y_TOP, yB = Y_BOT;
  const stemW = 210;
  const peakY = Y_MID + 220;
  return `
    M ${xL} ${yT}
    L ${xL + stemW} ${yT}
    L 527 ${peakY - 140}
    L ${xR - stemW} ${yT}
    L ${xR} ${yT}
    L ${xR} ${yB}
    L ${xR - stemW} ${yB}
    L ${xR - stemW} ${yT + 280}
    L 527 ${peakY + 120}
    L ${xL + stemW} ${yT + 280}
    L ${xL + stemW} ${yB}
    L ${xL} ${yB}
    Z
  `;
})();

// --- N ---
letters['N'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 20;
  const yT = Y_TOP, yB = Y_BOT;
  const stemW = 220;
  return `
    M ${xL} ${yT}
    L ${xL + stemW} ${yT}
    L ${xR - stemW} ${yB - 260}
    L ${xR - stemW} ${yT}
    L ${xR} ${yT}
    L ${xR} ${yB}
    L ${xR - stemW} ${yB}
    L ${xL + stemW} ${yT + 260}
    L ${xL + stemW} ${yB}
    L ${xL} ${yB}
    Z
  `;
})();

// --- O ---
// Exactly matches 0.png
letters['O'] = (() => {
  const xL = 94, xR = 960;
  const yT = Y_TOP, yB = Y_BOT;
  const rO = 140, rI = 75;
  const outer = `
    M ${xL + rO} ${yT}
    L ${xR - rO} ${yT}
    Q ${xR} ${yT} ${xR} ${yT + rO}
    L ${xR} ${yB - rO}
    Q ${xR} ${yB} ${xR - rO} ${yB}
    L ${xL + rO} ${yB}
    Q ${xL} ${yB} ${xL} ${yB - rO}
    L ${xL} ${yT + rO}
    Q ${xL} ${yT} ${xL + rO} ${yT}
    Z
  `;
  const hole = `
    M ${xL + STEM + rI} ${yT + BAR}
    L ${xR - STEM - rI} ${yT + BAR}
    Q ${xR - STEM} ${yT + BAR} ${xR - STEM} ${yT + BAR + rI}
    L ${xR - STEM} ${yB - BAR - rI}
    Q ${xR - STEM} ${yB - BAR} ${xR - STEM - rI} ${yB - BAR}
    L ${xL + STEM + rI} ${yB - BAR}
    Q ${xL + STEM} ${yB - BAR} ${xL + STEM} ${yB - BAR - rI}
    L ${xL + STEM} ${yT + BAR + rI}
    Q ${xL + STEM} ${yT + BAR} ${xL + STEM + rI} ${yT + BAR}
    Z
  `;
  return `${outer} ${hole}`;
})();

// --- P ---
letters['P'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 20;
  const yT = Y_TOP, yB = Y_BOT;
  const rO = 140, rI = 70;
  const midY = Y_MID + 60;
  const outer = `
    M ${xL} ${yT}
    L ${xR - rO} ${yT}
    Q ${xR} ${yT} ${xR} ${yT + rO}
    L ${xR} ${midY - rO}
    Q ${xR} ${midY} ${xR - rO} ${midY}
    L ${xL + STEM} ${midY}
    L ${xL + STEM} ${yB}
    L ${xL} ${yB}
    Z
  `;
  const hole = `
    M ${xL + STEM} ${yT + BAR}
    L ${xR - STEM - rI} ${yT + BAR}
    Q ${xR - STEM} ${yT + BAR} ${xR - STEM} ${yT + BAR + rI}
    L ${xR - STEM} ${midY - BAR - rI}
    Q ${xR - STEM} ${midY - BAR} ${xR - STEM - rI} ${midY - BAR}
    L ${xL + STEM} ${midY - BAR}
    Z
  `;
  return `${outer} ${hole}`;
})();

// --- Q ---
// O with athletic tail
letters['Q'] = (() => {
  const baseO = letters['O'];
  const tail = `
    M 640 1020
    L 820 1020
    L 970 1320
    L 850 1320
    Z
  `;
  return `${baseO} ${tail}`;
})();

// --- R ---
// P with diagonal athletic leg
letters['R'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 20;
  const yT = Y_TOP, yB = Y_BOT;
  const rO = 140, rI = 70;
  const midY = Y_MID + 60;
  const legW = 230;
  const outer = `
    M ${xL} ${yT}
    L ${xR - rO} ${yT}
    Q ${xR} ${yT} ${xR} ${yT + rO}
    L ${xR} ${midY - rO}
    Q ${xR} ${midY} ${xR - rO} ${midY}
    L 600 ${midY}
    L ${xR} ${yB}
    L ${xR - legW} ${yB}
    L 500 ${midY}
    L ${xL + STEM} ${midY}
    L ${xL + STEM} ${yB}
    L ${xL} ${yB}
    Z
  `;
  const hole = `
    M ${xL + STEM} ${yT + BAR}
    L ${xR - STEM - rI} ${yT + BAR}
    Q ${xR - STEM} ${yT + BAR} ${xR - STEM} ${yT + BAR + rI}
    L ${xR - STEM} ${midY - BAR - rI}
    Q ${xR - STEM} ${midY - BAR} ${xR - STEM - rI} ${midY - BAR}
    L ${xL + STEM} ${midY - BAR}
    Z
  `;
  return `${outer} ${hole}`;
})();

// --- S ---
// Matches athletic style of 5 / 8
letters['S'] = (() => {
  const xL = X_LEFT, xR = X_RIGHT;
  const yT = Y_TOP, yB = Y_BOT;
  const rO = 130;
  return `
    M ${xR} ${yT + 260}
    L ${xR - BAR} ${yT + 260}
    L ${xR - BAR} ${yT + BAR}
    L ${xL + rO} ${yT + BAR}
    Q ${xL + STEM} ${yT + BAR} ${xL + STEM} ${yT + BAR + 60}
    L ${xL + STEM} ${Y_MID - 60}
    Q ${xL + STEM} ${Y_MID} ${xL + STEM + 60} ${Y_MID}
    L ${xR - rO} ${Y_MID}
    Q ${xR} ${Y_MID} ${xR} ${Y_MID + 60}
    L ${xR} ${yB - rO}
    Q ${xR} ${yB} ${xR - rO} ${yB}
    L ${xL} ${yB}
    L ${xL} ${yB - 260}
    L ${xL + BAR} ${yB - 260}
    L ${xL + BAR} ${yB - BAR}
    L ${xR - rO} ${yB - BAR}
    Q ${xR - STEM} ${yB - BAR} ${xR - STEM} ${yB - BAR - 60}
    L ${xR - STEM} ${Y_MID + 60}
    Q ${xR - STEM} ${Y_MID} ${xR - STEM - 60} ${Y_MID}
    L ${xL + rO} ${Y_MID}
    Q ${xL} ${Y_MID} ${xL} ${Y_MID - 60}
    L ${xL} ${yT + rO}
    Q ${xL} ${yT} ${xL + rO} ${yT}
    L ${xR} ${yT}
    Z
  `;
})();

// --- T ---
letters['T'] = (() => {
  const xL = X_LEFT, xR = X_RIGHT;
  const yT = Y_TOP, yB = Y_BOT;
  const stemW = 250;
  const sL = Math.round((W - stemW) / 2);
  const sR = sL + stemW;
  return `
    M ${xL} ${yT}
    L ${xR} ${yT}
    L ${xR} ${yT + BAR}
    L ${sR} ${yT + BAR}
    L ${sR} ${yB}
    L ${sL} ${yB}
    L ${sL} ${yT + BAR}
    L ${xL} ${yT + BAR}
    Z
  `;
})();

// --- U ---
letters['U'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 20;
  const yT = Y_TOP, yB = Y_BOT;
  const rO = 180, rI = 90;
  return `
    M ${xL} ${yT}
    L ${xL + STEM} ${yT}
    L ${xL + STEM} ${yB - BAR - rI}
    Q ${xL + STEM} ${yB - BAR} ${xL + STEM + rI} ${yB - BAR}
    L ${xR - STEM - rI} ${yB - BAR}
    Q ${xR - STEM} ${yB - BAR} ${xR - STEM} ${yB - BAR - rI}
    L ${xR - STEM} ${yT}
    L ${xR} ${yT}
    L ${xR} ${yB - rO}
    Q ${xR} ${yB} ${xR - rO} ${yB}
    L ${xL + rO} ${yB}
    Q ${xL} ${yB} ${xL} ${yB - rO}
    Z
  `;
})();

// --- V ---
letters['V'] = (() => {
  const xL = 72, xR = W - 72;
  const yT = Y_TOP, yB = Y_BOT;
  const stemW = 230;
  return `
    M ${xL} ${yT}
    L ${xL + stemW} ${yT}
    L 527 ${yB - 190}
    L ${xR - stemW} ${yT}
    L ${xR} ${yT}
    L 630 ${yB}
    L 424 ${yB}
    Z
  `;
})();

// --- W ---
letters['W'] = (() => {
  const xL = 60, xR = W - 60;
  const yT = Y_TOP, yB = Y_BOT;
  const stemW = 210;
  const peakY = Y_MID - 220;
  return `
    M ${xL} ${yT}
    L ${xL + stemW} ${yT}
    L ${xL + stemW} ${yB - 280}
    L 527 ${peakY - 120}
    L ${xR - stemW} ${yB - 280}
    L ${xR - stemW} ${yT}
    L ${xR} ${yT}
    L ${xR} ${yB}
    L ${xR - stemW} ${yB}
    L 527 ${peakY + 140}
    L ${xL + stemW} ${yB}
    L ${xL} ${yB}
    Z
  `;
})();

// --- X ---
letters['X'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 20;
  const yT = Y_TOP, yB = Y_BOT;
  const arm = 220;
  return `
    M ${xL} ${yT}
    L ${xL + arm} ${yT}
    L 527 ${Y_MID - 90}
    L ${xR - arm} ${yT}
    L ${xR} ${yT}
    L 620 ${Y_MID}
    L ${xR} ${yB}
    L ${xR - arm} ${yB}
    L 527 ${Y_MID + 90}
    L ${xL + arm} ${yB}
    L ${xL} ${yB}
    L 434 ${Y_MID}
    Z
  `;
})();

// --- Y ---
letters['Y'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 20;
  const yT = Y_TOP, yB = Y_BOT;
  const arm = 230;
  const stemW = 250;
  const sL = Math.round((W - stemW) / 2);
  const sR = sL + stemW;
  return `
    M ${xL} ${yT}
    L ${xL + arm} ${yT}
    L 527 ${Y_MID}
    L ${xR - arm} ${yT}
    L ${xR} ${yT}
    L ${sR + 60} ${Y_MID + 40}
    L ${sR} ${Y_MID + 90}
    L ${sR} ${yB}
    L ${sL} ${yB}
    L ${sL} ${Y_MID + 90}
    L ${sL - 60} ${Y_MID + 40}
    Z
  `;
})();

// --- Z ---
letters['Z'] = (() => {
  const xL = X_LEFT + 20, xR = X_RIGHT - 20;
  const yT = Y_TOP, yB = Y_BOT;
  const barH = 220;
  const diagW = 260;
  return `
    M ${xL} ${yT}
    L ${xR} ${yT}
    L ${xR} ${yT + barH}
    L ${xL + diagW + 80} ${yB - barH}
    L ${xR} ${yB - barH}
    L ${xR} ${yB}
    L ${xL} ${yB}
    L ${xL} ${yB - barH}
    L ${xR - diagW - 80} ${yT + barH}
    L ${xL} ${yT + barH}
    Z
  `;
})();

async function generateAll() {
  console.log('Generating A-Z custom alphabet set...');
  for (const char of Object.keys(letters)) {
    const d = letters[char];
    const svgStr = makeSvg(d);
    
    // Save SVG
    const svgPath = path.join(OUT_DIR, `${char}.svg`);
    fs.writeFileSync(svgPath, svgStr);
    
    // Save PNG via sharp
    const pngPath = path.join(OUT_DIR, `${char}.png`);
    await sharp(Buffer.from(svgStr))
      .png({ compressionLevel: 9 })
      .toFile(pngPath);
    
    console.log(`Generated ${char}.svg & ${char}.png`);
  }
  console.log('All 26 letters generated successfully!');
}

generateAll().catch(err => {
  console.error(err);
  process.exit(1);
});
