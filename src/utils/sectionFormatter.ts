/**
 * Formats student section according to National Ideal College HSC convention:
 * - Science: Prefix "Sc" (e.g., ScB2, ScG1, ScV5)
 * - Commerce: Prefix "Bs" (e.g., BsB1, BsG1, BsV5)
 * - Humanities: Prefix "Hu" (e.g., HuB1, HuG1, HuV5)
 * - Boys usually have 'B' (e.g. ScB2, BsB1, HuB1)
 * - Girls usually have 'G' (e.g. ScG1, BsG1, HuG1)
 */
export function formatStudentSection(
  rawSection: string,
  group?: 'Science' | 'Commerce' | 'Humanities' | string,
  gender?: 'Male' | 'Female' | string
): string {
  if (!rawSection) return '';
  let sec = rawSection.trim();

  // Convert Bengali digits (০-৯) to English digits (0-9)
  const banglaDigits: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  sec = sec.replace(/[০-৯]/g, d => banglaDigits[d] || d);

  // Convert Bengali section names e.g. "বি" -> "B", "জি" -> "G", "ভি" -> "V"
  sec = sec.replace(/বি/gi, 'B').replace(/জি/gi, 'G').replace(/ভি/gi, 'V');

  // Remove whitespace, dashes, and underscores
  sec = sec.replace(/\s+/g, '').replace(/[-_]/g, '');

  // Determine group prefix
  let groupPrefix = 'Sc';
  if (group) {
    const g = group.toLowerCase();
    if (g.includes('comm') || g.includes('business') || g.includes('bs')) {
      groupPrefix = 'Bs';
    } else if (g.includes('hum') || g.includes('art') || g.includes('hu')) {
      groupPrefix = 'Hu';
    } else {
      groupPrefix = 'Sc';
    }
  }

  // If already starts with Sc, Bs, or Hu (case-insensitive)
  if (/^sc/i.test(sec)) {
    return 'Sc' + sec.slice(2).toUpperCase();
  }
  if (/^bs/i.test(sec)) {
    return 'Bs' + sec.slice(2).toUpperCase();
  }
  if (/^hu/i.test(sec)) {
    return 'Hu' + sec.slice(2).toUpperCase();
  }

  // If input is purely a number (e.g. "1", "2"):
  if (/^[0-9]+$/.test(sec)) {
    const defaultLetter = gender === 'Female' ? 'G' : 'B';
    return `${groupPrefix}${defaultLetter}${sec}`;
  }

  // If input is single letter "A", "B", "C", "D"
  if (/^[a-zA-Z]$/.test(sec)) {
    const up = sec.toUpperCase();
    const subNum = up === 'A' ? '1' : up === 'B' ? '2' : up === 'C' ? '3' : up === 'D' ? '4' : '1';
    const defaultLetter = gender === 'Female' ? 'G' : 'B';
    return `${groupPrefix}${defaultLetter}${subNum}`;
  }

  // Standard case (e.g. "b2" -> "ScB2", "v5" -> "ScV5", "b1" -> "BsB1")
  const cleanBody = sec.toUpperCase();
  return `${groupPrefix}${cleanBody}`;
}
