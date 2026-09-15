import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StudentRegistration } from '../types';
import { SUPER_ADMIN } from '../../SuperAdmin';

export type PdfExportType = 'approved' | 'rejected' | 'all';

interface ExportPdfOptions {
  type: PdfExportType;
  students: StudentRegistration[];
}

function loadImage(src: string | undefined): Promise<HTMLImageElement | null> {
  if (!src || typeof window === 'undefined') return Promise.resolve(null);
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function createWatermarkCanvas(img: HTMLImageElement, opacity = 0.07): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width || 400;
  canvas.height = img.naturalHeight || img.height || 400;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.globalAlpha = opacity;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
  return canvas;
}

/**
 * Generates and downloads a clean, professional PDF registration report in A4 Portrait format.
 * Content dynamically loaded from SuperAdmin/PDF Settings CMS.
 */
export async function generateStudentReportPdf({ type, students }: ExportPdfOptions): Promise<void> {
  const pdfCfg = SUPER_ADMIN.pdfSettings;

  // Pre-load logo and watermark images if available
  const [logoImg, watermarkImg] = await Promise.all([
    loadImage(pdfCfg.pic.logo),
    loadImage(pdfCfg.pic.watermark)
  ]);

  const watermarkCanvas = watermarkImg ? createWatermarkCanvas(watermarkImg, 0.07) : null;

  // 1. Filter students according to requested export type
  let filtered: StudentRegistration[] = [];
  let categoryLabel = '';

  if (type === 'approved') {
    // Only approved students: registration_status = approved (or verified)
    filtered = students.filter(s => s.status === 'Approved' || s.status === 'Verified');
    categoryLabel = 'Approved Records';
  } else if (type === 'rejected') {
    // Only rejected students: registration_status = rejected
    filtered = students.filter(s => s.status === 'Rejected');
    categoryLabel = 'Rejected Records';
  } else {
    // Show all students
    filtered = [...students];
    categoryLabel = 'All Records';
  }

  // Logical sorting: numerical by roll when valid, otherwise alphabetical
  filtered.sort((a, b) => {
    const rollA = parseInt(a.roll, 10);
    const rollB = parseInt(b.roll, 10);
    if (!isNaN(rollA) && !isNaN(rollB)) {
      return rollA - rollB;
    }
    return (a.roll || '').localeCompare(b.roll || '');
  });

  // 2. Initialize jsPDF in A4 Portrait mode (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 13;

  // Format Generated Date
  const now = new Date();
  const dateFormatted =
    now.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) +
    ' ' +
    now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

  // 3. Prepare Table Columns and Data
  // Exact Columns: SL, Name, Section, Roll, ID, Contact, Jersey Name, Jersey Number, Size
  // For "All Registrations", also include Status column
  const isAllType = type === 'all';
  const tableHeaders = isAllType
    ? ['SL', 'Name', 'Section', 'Roll', 'ID', 'Contact', 'Jersey Name', 'Jersey Number', 'Size', 'Status']
    : ['SL', 'Name', 'Section', 'Roll', 'ID', 'Contact', 'Jersey Name', 'Jersey Number', 'Size'];

  // SL NUMBER SYSTEM: Auto-generated serial numbers 1, 2, 3, 4, 5... (based on exported records)
  const tableBody = filtered.map((student, index) => {
    const row = [
      (index + 1).toString(),
      student.fullName || '-',
      student.section || '-',
      student.roll || '-',
      student.studentId || '-',
      student.contactNumber || '-',
      student.jerseyName || '-',
      student.jerseyNumber || '-',
      student.jerseySize || '-'
    ];
    if (isAllType) {
      row.push(student.status || 'Pending');
    }
    return row;
  });

  if (tableBody.length === 0) {
    const emptyRow = ['-', `No ${categoryLabel.toLowerCase()} found`, '-', '-', '-', '-', '-', '-', '-'];
    if (isAllType) emptyRow.push('-');
    tableBody.push(emptyRow);
  }

  // 4. Render Table with auto page breaking
  autoTable(doc, {
    head: [tableHeaders],
    body: tableBody,
    startY: 47,
    margin: { left: marginX, right: marginX, top: 47, bottom: 18 },
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: [0, 0, 0], // Black text
      cellPadding: { top: 2.2, right: 1.5, bottom: 2.2, left: 1.5 },
      overflow: 'linebreak',
      lineWidth: 0.15,
      lineColor: [200, 200, 200]
    },
    headStyles: {
      fillColor: [242, 244, 246], // Crisp neutral light table header
      textColor: [0, 0, 0],       // Black text
      fontStyle: 'bold',
      fontSize: 8.5,
      lineWidth: 0.25,
      lineColor: [120, 120, 120]
    },
    columnStyles: isAllType
      ? {
          0: { halign: 'center', cellWidth: 8 },  // SL
          1: { cellWidth: 28 },                  // Name
          2: { cellWidth: 16 },                  // Section
          3: { halign: 'center', cellWidth: 13 }, // Roll
          4: { cellWidth: 20 },                  // ID
          5: { cellWidth: 22 },                  // Contact
          6: { cellWidth: 24 },                  // Jersey Name
          7: { halign: 'center', cellWidth: 16 }, // Jersey Number
          8: { halign: 'center', cellWidth: 14 }, // Size
          9: { halign: 'center', cellWidth: 19 }  // Status
        }
      : {
          0: { halign: 'center', cellWidth: 10 }, // SL
          1: { cellWidth: 32 },                  // Name
          2: { cellWidth: 20 },                  // Section
          3: { halign: 'center', cellWidth: 14 }, // Roll
          4: { cellWidth: 22 },                  // ID
          5: { cellWidth: 24 },                  // Contact
          6: { cellWidth: 28 },                  // Jersey Name
          7: { halign: 'center', cellWidth: 18 }, // Jersey Number
          8: { halign: 'center', cellWidth: 16 }  // Size
        }
  });

  // 5. Apply Watermark, Headers & Footers to all pages
  const totalPages = doc.getNumberOfPages();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    doc.setPage(pageNum);

    // Optional watermark support: if watermark exists, show it with low opacity behind content
    if (watermarkCanvas) {
      const wmSize = 100;
      const wmX = (pageWidth - wmSize) / 2;
      const wmY = (pageHeight - wmSize) / 2;
      try {
        doc.addImage(watermarkCanvas, 'PNG', wmX, wmY, wmSize, wmSize);
      } catch (e) {
        console.warn('Watermark render skipped', e);
      }
    }

    // ----------------------------------------------------
    // PDF HEADER
    // ----------------------------------------------------
    // Header Logo (from PDF Settings/pic/logo.png)
    if (logoImg) {
      try {
        const logoSize = 16;
        doc.addImage(logoImg, 'PNG', marginX, 9, logoSize, logoSize);
      } catch (e) {
        console.warn('PDF logo render skipped', e);
      }
    }

    // Title 1: Loaded from title.txt (e.g. National Ideal College)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(0, 0, 0);
    doc.text(pdfCfg.txt.title || 'National Ideal College', pageWidth / 2, 13, { align: 'center' });

    // Title 2: Loaded from subtitle.txt (e.g. RAD Day HSC 27)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(pdfCfg.txt.subtitle || 'RAD Day HSC 27', pageWidth / 2, 19, { align: 'center' });

    // Title 3: Loaded from approved_report_title.txt / rejected_report_title.txt / all_report_title.txt
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    const subTitle =
      type === 'approved'
        ? (pdfCfg.txt.approvedReportTitle || 'Approved Student Report')
        : type === 'rejected'
        ? (pdfCfg.txt.rejectedReportTitle || 'Rejected Student Report')
        : (pdfCfg.txt.allReportTitle || 'All Registration Report');
    doc.text(subTitle, pageWidth / 2, 24.5, { align: 'center' });

    // Header divider line
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(marginX, 28, pageWidth - marginX, 28);

    // Header Metadata: Generated Date & Total Records
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text(`Generated Date: ${dateFormatted}`, marginX, 34);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    const recordsText = `Total Records: ${filtered.length}`;
    doc.text(recordsText, pageWidth - marginX, 34, { align: 'right' });

    // Secondary hairline divider before table
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.15);
    doc.line(marginX, 37.5, pageWidth - marginX, 37.5);

    // ----------------------------------------------------
    // PDF FOOTER
    // ----------------------------------------------------
    const footerY = pageHeight - 8.5;

    // Footer divider line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(marginX, footerY - 3.5, pageWidth - marginX, footerY - 3.5);

    // Footer Left: Loaded from footer.txt (e.g. Generated From RAD Day Registration System)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(pdfCfg.txt.footer || 'Generated From RAD Day Registration System', marginX, footerY);

    // Footer Right: "Page Number" (e.g. Page 1 of 2)
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - marginX, footerY, { align: 'right' });
  }

  // 6. Automatic Download
  const fileDate = now.toISOString().slice(0, 10);
  const safeCollege = (pdfCfg.txt.title || 'National_Ideal_College').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeEvent = (pdfCfg.txt.subtitle || 'RAD_Day_HSC_27').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeCategory =
    type === 'approved'
      ? 'Approved_Students'
      : type === 'rejected'
      ? 'Rejected_Students'
      : 'All_Students';
  const fileName = `${safeCollege}_${safeEvent}_${safeCategory}_${fileDate}.pdf`;

  doc.save(fileName);
}
