import { StudentRegistration } from '../types';
import { SUPER_ADMIN } from '../../SuperAdmin';

export interface EventDetailsInfo {
  eventDate: string;
  eventVenue: string;
  batchName?: string;
  collegeName?: string;
}

/**
 * Loads an image safely handling CORS and falls back to a placeholder if CORS fails
 */
function loadImageSafely(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    let resolved = false;

    img.onload = () => {
      if (!resolved) {
        resolved = true;
        resolve(img);
      }
    };

    img.onerror = () => {
      if (!resolved) {
        resolved = true;
        // Try without crossOrigin if external server doesn't provide CORS headers
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = () => resolve(null);
        fallbackImg.src = src;
      }
    };

    // Timeout safety
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(null);
      }
    }, 4000);

    img.src = src;
  });
}

/**
 * Generates an HD (1920x1080) Canvas representing the invitation card based on the user-provided sketch
 */
export async function generateInvitationCardCanvas(
  student: StudentRegistration,
  eventInfo?: Partial<EventDetailsInfo>
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const eventDate = eventInfo?.eventDate || SUPER_ADMIN.eventDetails.txt.eventDate || '01 February 2027';
  const eventVenue = eventInfo?.eventVenue || SUPER_ADMIN.eventDetails.txt.eventVenue || 'NIC Campus';
  const collegeName = eventInfo?.collegeName || SUPER_ADMIN.websiteBranding.txt.collegeName || 'National Ideal College';

  // 1. Deep Black Background
  ctx.fillStyle = '#060709';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle radial gradient in center for soft teal glow atmosphere
  const bgGlow = ctx.createRadialGradient(960, 540, 100, 960, 540, 950);
  bgGlow.addColorStop(0, 'rgba(6, 182, 212, 0.045)');
  bgGlow.addColorStop(0.6, 'rgba(4, 120, 87, 0.02)');
  bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bgGlow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Colors & Glow settings
  const cyanPrimary = '#00F0FF';
  const cyanBorder = 'rgba(0, 240, 255, 0.85)';
  const cyanDimBorder = 'rgba(0, 240, 255, 0.55)';
  const boxFill = 'rgba(10, 18, 26, 0.75)';

  // Helper: Stroke a rect with glow
  const drawGlowRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    strokeColor: string,
    lineWidth = 2,
    glowRadius = 10,
    fillColor?: string
  ) => {
    ctx.save();
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, w, h);
    }
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = 'rgba(0, 240, 255, 0.45)';
    ctx.shadowBlur = glowRadius;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  };

  // Helper: Draw corner mark ticks like the sketch
  const drawCornerTick = (x: number, y: number, length: number, dirX: number, dirY: number) => {
    ctx.save();
    ctx.strokeStyle = cyanPrimary;
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(x, y + dirY * length);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dirX * length, y);
    ctx.stroke();
    ctx.restore();
  };

  // 2. Outer Double Border matching sketch
  // Outer frame
  drawGlowRect(45, 40, canvas.width - 90, canvas.height - 80, cyanBorder, 2.5, 14);

  // Inner framing accents (the hand-drawn sketch has subtle corner tick flourishes)
  // Top-left corner tick
  ctx.save();
  ctx.strokeStyle = cyanPrimary;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(0, 240, 255, 0.7)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(70, 95);
  ctx.lineTo(95, 70);
  ctx.moveTo(65, 80);
  ctx.lineTo(80, 65);
  ctx.stroke();

  // Top-right corner tick (pointing upward-right)
  ctx.beginPath();
  ctx.moveTo(canvas.width - 95, 70);
  ctx.lineTo(canvas.width - 70, 95);
  ctx.moveTo(canvas.width - 80, 65);
  ctx.lineTo(canvas.width - 65, 80);
  ctx.stroke();

  // Bottom-left corner tick
  ctx.beginPath();
  ctx.moveTo(70, canvas.height - 95);
  ctx.lineTo(95, canvas.height - 70);
  ctx.moveTo(65, canvas.height - 80);
  ctx.lineTo(80, canvas.height - 65);
  ctx.stroke();

  // Bottom-right corner ticks (double diagonal lines)
  ctx.beginPath();
  ctx.moveTo(canvas.width - 100, canvas.height - 70);
  ctx.lineTo(canvas.width - 70, canvas.height - 100);
  ctx.moveTo(canvas.width - 85, canvas.height - 70);
  ctx.lineTo(canvas.width - 70, canvas.height - 85);
  ctx.stroke();
  ctx.restore();

  // ================= 3. TOP-LEFT: CIRCULAR SEAL / LOGO =================
  const badgeCenterX = 230;
  const badgeCenterY = 175;
  const badgeRadius = 90;

  // Outer circle
  ctx.save();
  ctx.strokeStyle = cyanPrimary;
  ctx.lineWidth = 3;
  ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(badgeCenterX, badgeCenterY, badgeRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Inner circle
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(badgeCenterX, badgeCenterY, badgeRadius - 10, 0, Math.PI * 2);
  ctx.stroke();

  // Gentle radiant ray ticks around seal (handmade appearance)
  const numRays = 14;
  for (let i = 0; i < numRays; i++) {
    const angle = (i * Math.PI * 2) / numRays;
    const r1 = badgeRadius + 4;
    const r2 = badgeRadius + 15;
    ctx.beginPath();
    ctx.moveTo(badgeCenterX + Math.cos(angle) * r1, badgeCenterY + Math.sin(angle) * r1);
    ctx.lineTo(badgeCenterX + Math.cos(angle) * r2, badgeCenterY + Math.sin(angle) * r2);
    ctx.stroke();
  }

  // Circular Seal Text: "NIC27" / "Rag Day"
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 36px "Montserrat", "Segoe UI", sans-serif';
  ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText('NIC27', badgeCenterX, badgeCenterY - 18);

  ctx.fillStyle = cyanPrimary;
  ctx.font = 'bold 24px "Montserrat", "Segoe UI", sans-serif';
  ctx.fillText('Rag Day', badgeCenterX, badgeCenterY + 24);
  ctx.restore();

  // Top header horizontal accent lines extending to the right
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(350, 150);
  ctx.lineTo(1050, 150);
  ctx.moveTo(350, 175);
  ctx.lineTo(750, 175);
  ctx.stroke();
  ctx.restore();

  // ================= 4. TOP-RIGHT: REGISTRATION NUMBER =================
  const regNoText = student.registrationNo || 'RD27-001';
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 32px "Montserrat", "Segoe UI", sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
  ctx.shadowBlur = 8;
  ctx.fillText('Reg. No :', 1430, 175);
  ctx.restore();

  // Registration Number Box
  const regBoxX = 1460;
  const regBoxY = 135;
  const regBoxW = 380;
  const regBoxH = 80;

  drawGlowRect(regBoxX, regBoxY, regBoxW, regBoxH, cyanPrimary, 2.5, 12, boxFill);
  // Corner ticks on reg box
  drawCornerTick(regBoxX + 6, regBoxY + 6, 14, 1, 1);
  drawCornerTick(regBoxX + regBoxW - 6, regBoxY + regBoxH - 6, 14, -1, -1);

  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 42px "Montserrat", monospace';
  ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
  ctx.shadowBlur = 12;
  ctx.fillText(regNoText, regBoxX + regBoxW / 2, regBoxY + regBoxH / 2 + 2);
  ctx.restore();

  // ================= 5. HORIZONTAL DIVIDER LINE UNDER HEADER =================
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(65, 270);
  ctx.lineTo(canvas.width - 65, 270);
  ctx.stroke();
  ctx.restore();

  // ================= 6. RIGHT SIDE: STUDENT PHOTO =================
  const photoBoxX = 1400;
  const photoBoxY = 305;
  const photoBoxW = 440;
  const photoBoxH = 550;

  drawGlowRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH, cyanBorder, 2.5, 14, 'rgba(8, 14, 22, 0.9)');

  // Framing corner marks inside photo box (as shown in sketch: ┌ top-left, ┘ bottom-right)
  drawCornerTick(photoBoxX + 16, photoBoxY + 16, 26, 1, 1);
  drawCornerTick(photoBoxX + photoBoxW - 16, photoBoxY + photoBoxH - 16, 26, -1, -1);

  // Load and draw student photo
  let photoImg: HTMLImageElement | null = null;
  if (student.photoUrl) {
    try {
      photoImg = await loadImageSafely(student.photoUrl);
    } catch {
      photoImg = null;
    }
  }

  if (photoImg) {
    ctx.save();
    // Clip inside photo box with inner padding
    const pad = 12;
    ctx.beginPath();
    ctx.rect(photoBoxX + pad, photoBoxY + pad, photoBoxW - pad * 2, photoBoxH - pad * 2);
    ctx.clip();

    // Draw object-cover
    const imgAspect = photoImg.width / photoImg.height;
    const boxAspect = (photoBoxW - pad * 2) / (photoBoxH - pad * 2);
    let sW, sH, sX, sY;

    if (imgAspect > boxAspect) {
      sH = photoImg.height;
      sW = sH * boxAspect;
      sX = (photoImg.width - sW) / 2;
      sY = 0;
    } else {
      sW = photoImg.width;
      sH = sW / boxAspect;
      sX = 0;
      sY = (photoImg.height - sH) / 2;
    }

    ctx.drawImage(
      photoImg,
      sX,
      sY,
      sW,
      sH,
      photoBoxX + pad,
      photoBoxY + pad,
      photoBoxW - pad * 2,
      photoBoxH - pad * 2
    );
    ctx.restore();
  } else {
    // Fallback Photo Box Placeholder matching sketch
    ctx.save();
    ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '300 52px "Montserrat", sans-serif';
    ctx.fillText('Photo', photoBoxX + photoBoxW / 2, photoBoxY + photoBoxH / 2);
    ctx.restore();
  }

  // ================= 7. LEFT SIDE: STUDENT INFORMATION AREA =================
  const infoStartX = 110;
  const labelWidth = 180;
  const infoEndX = 1340; // Space before photo box
  const boxWidthFull = infoEndX - infoStartX - labelWidth;

  const rowHeight = 62;
  const rowSpacing = 28;
  let currentY = 325;

  const drawLabel = (text: string, y: number, x = infoStartX) => {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 28px "Montserrat", "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + rowHeight / 2);
    ctx.fillText(':', x + labelWidth - 30, y + rowHeight / 2);
    ctx.restore();
  };

  const drawInfoBox = (x: number, y: number, w: number, h: number, value: string, isCyanText = false) => {
    drawGlowRect(x, y, w, h, cyanDimBorder, 1.8, 8, boxFill);
    ctx.save();
    ctx.fillStyle = isCyanText ? cyanPrimary : '#FFFFFF';
    ctx.font = 'bold 24px "Montserrat", "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    // Text padding
    const paddingX = 18;
    // Truncate if too long
    let displayVal = value;
    const maxTextWidth = w - paddingX * 2;
    if (ctx.measureText(displayVal).width > maxTextWidth) {
      while (ctx.measureText(displayVal + '...').width > maxTextWidth && displayVal.length > 3) {
        displayVal = displayVal.slice(0, -1);
      }
      displayVal += '...';
    }
    ctx.fillText(displayVal, x + paddingX, y + h / 2);
    ctx.restore();
  };

  // Row 1: Name : [ Full Name Box ]
  drawLabel('Name', currentY);
  drawInfoBox(infoStartX + labelWidth, currentY, boxWidthFull, rowHeight, student.fullName);
  currentY += rowHeight + rowSpacing;

  // Row 2: Group : [ Group Box ]   Class : [ Class Box ]
  const halfGap = 40;
  const colWidth = (boxWidthFull - halfGap) / 2;
  // Left half: Group
  drawLabel('Group', currentY);
  drawInfoBox(infoStartX + labelWidth, currentY, colWidth - 50, rowHeight, student.group);
  // Right half: Class
  const classLabelStartX = infoStartX + labelWidth + colWidth + 10;
  const classLabelWidth = 140;
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '500 28px "Montserrat", "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Class', classLabelStartX, currentY + rowHeight / 2);
  ctx.fillText(':', classLabelStartX + classLabelWidth - 30, currentY + rowHeight / 2);
  ctx.restore();
  drawInfoBox(
    classLabelStartX + classLabelWidth,
    currentY,
    infoEndX - (classLabelStartX + classLabelWidth),
    rowHeight,
    student.className || 'HSC 2027'
  );
  currentY += rowHeight + rowSpacing;

  // Row 3: Section : [ Section Box ]   Roll : [ Roll Box ]
  drawLabel('Section', currentY);
  drawInfoBox(infoStartX + labelWidth, currentY, colWidth - 50, rowHeight, student.section);
  // Right half: Roll
  const rollLabelStartX = infoStartX + labelWidth + colWidth + 10;
  const rollLabelWidth = 140;
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '500 28px "Montserrat", "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Roll', rollLabelStartX, currentY + rowHeight / 2);
  ctx.fillText(':', rollLabelStartX + rollLabelWidth - 30, currentY + rowHeight / 2);
  ctx.restore();
  drawInfoBox(
    rollLabelStartX + rollLabelWidth,
    currentY,
    infoEndX - (rollLabelStartX + rollLabelWidth),
    rowHeight,
    student.roll
  );
  currentY += rowHeight + rowSpacing;

  // Row 4: ID : [ Student ID Box ]
  const studentIdDisplay = student.studentId || `NIC-27-${student.roll}`;
  drawLabel('ID', currentY);
  drawInfoBox(infoStartX + labelWidth, currentY, boxWidthFull, rowHeight, studentIdDisplay);
  currentY += rowHeight + rowSpacing;

  // Row 5: Date : [ Event Date Box ]
  drawLabel('Date', currentY);
  drawInfoBox(infoStartX + labelWidth, currentY, boxWidthFull, rowHeight, eventDate, true);
  currentY += rowHeight + rowSpacing;

  // Row 6: Venue : [ Venue Box ]
  drawLabel('Venue', currentY);
  drawInfoBox(infoStartX + labelWidth, currentY, boxWidthFull, rowHeight, eventVenue);

  // ================= 8. BOTTOM SECTION (FOLLOWING SKETCH) =================
  const bottomDividerY = 890;
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(65, bottomDividerY);
  ctx.lineTo(canvas.width - 65, bottomDividerY);
  ctx.stroke();
  ctx.restore();

  // Bottom corner arrow/ticks inside bottom divider (as in sketch)
  // Left arrow
  ctx.save();
  ctx.strokeStyle = cyanPrimary;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(85, bottomDividerY + 30);
  ctx.lineTo(105, bottomDividerY + 60);
  ctx.moveTo(110, bottomDividerY + 30);
  ctx.lineTo(85, bottomDividerY + 30);
  ctx.stroke();

  // Right diagonal ticks
  ctx.beginPath();
  ctx.moveTo(canvas.width - 120, bottomDividerY + 55);
  ctx.lineTo(canvas.width - 95, bottomDividerY + 30);
  ctx.moveTo(canvas.width - 105, bottomDividerY + 55);
  ctx.lineTo(canvas.width - 80, bottomDividerY + 30);
  ctx.stroke();
  ctx.restore();

  // Welcome Message:
  // "We are welcoming you to our last part of college life"
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 28px "Montserrat", "Segoe UI", sans-serif';
  ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
  ctx.shadowBlur = 8;
  ctx.fillText(
    'We are welcoming you to our last part of college life',
    canvas.width / 2,
    bottomDividerY + 45
  );

  // Subtitle line:
  // "— Batch 2K27 • DU —" (with flanking dash lines matching sketch)
  const subText = 'Batch 2K27 • DU';
  ctx.font = 'bold 30px "Montserrat", "Segoe UI", sans-serif';
  ctx.fillStyle = cyanPrimary;
  ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
  ctx.shadowBlur = 12;
  ctx.fillText(subText, canvas.width / 2, bottomDividerY + 105);

  // Flanking horizontal dash-lines
  const textWidth = ctx.measureText(subText).width;
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  // Left line
  ctx.moveTo(canvas.width / 2 - textWidth / 2 - 130, bottomDividerY + 105);
  ctx.lineTo(canvas.width / 2 - textWidth / 2 - 25, bottomDividerY + 105);
  // Right line
  ctx.moveTo(canvas.width / 2 + textWidth / 2 + 25, bottomDividerY + 105);
  ctx.lineTo(canvas.width / 2 + textWidth / 2 + 130, bottomDividerY + 105);
  ctx.stroke();
  ctx.restore();

  return canvas;
}

/**
 * Triggers instant download of the personalised HD Invitation Card
 */
export async function downloadInvitationCard(
  student: StudentRegistration,
  eventInfo?: Partial<EventDetailsInfo>
): Promise<void> {
  const canvas = await generateInvitationCardCanvas(student, eventInfo);

  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to generate invitation card blob'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeRegNo = (student.registrationNo || student.roll || 'ID').replace(/[^a-zA-Z0-9_-]/g, '_');
      a.download = `NIC27_Invitation_Card_${safeRegNo}.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, 250);
    }, 'image/png');
  });
}
