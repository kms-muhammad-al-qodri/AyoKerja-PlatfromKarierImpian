import { useTranslation } from 'react-i18next';

/**
 * Helper to translate dynamic backend strings (Job source, location, salary, level, etc.)
 */
export function translateJobField(text, isEn) {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();

  // If Indonesian requested (isEn is false)
  if (!isEn) {
    if (trimmed === 'Month 1 - 2' || trimmed === 'Month 1-2') return 'Bulan 1 - 2';
    if (trimmed === 'Month 3 - 4' || trimmed === 'Month 3-4') return 'Bulan 3 - 4';
    if (trimmed === 'Month 5 - 7' || trimmed === 'Month 5-7') return 'Bulan 5 - 7';
    if (trimmed === 'Month 8 - 10' || trimmed === 'Month 8-10') return 'Bulan 8 - 10';
    if (trimmed === 'Month 11 - 12' || trimmed === 'Month 11-12') return 'Bulan 11 - 12';
    if (trimmed === 'YOU ARE HERE') return 'LOKASI SAAT INI';
    if (trimmed === 'IN PROGRESS') return 'SEDANG BERJALAN';
    if (trimmed === 'NEXT GOAL') return 'TARGET SELANJUTNYA';
    if (trimmed === 'FUTURE GOAL') return 'TARGET MASA DEPAN';
    if (trimmed === 'CAREER TARGET') return 'TARGET KARIR';
    if (trimmed === 'Junior Level') return 'Level Junior';
    if (trimmed === 'Middle Level') return 'Level Menengah';
    if (trimmed === 'Senior Level') return 'Level Senior';
    return trimmed
      .replace(/^Stage (\d+):/i, 'Tahap $1:')
      .replace(/Month (\d+)\s*-\s*(\d+)/gi, 'Bulan $1 - $2');
  }

  // If English requested (isEn is true)
  // Job Source
  if (trimmed === 'Lowongan Terverifikasi') return 'Verified Job Listing';

  // Job Location
  if (trimmed === 'Kerja di rumah' || trimmed === 'Kerja Di Rumah') return 'Work from home';

  // Job Salary
  if (trimmed === 'Gaji Kompetitif (Negosiasi)') return 'Competitive Salary (Negotiable)';
  if (trimmed === 'Gaji Kompetitif') return 'Competitive Salary';

  // User Level
  if (trimmed === 'Mahasiswa Aktif' || trimmed === 'Sedang Kuliah (Mahasiswa Aktif)') return 'Active Student';
  if (trimmed === 'Lulusan Baru' || trimmed === 'Fresh Graduate') return 'Fresh Graduate';

  // Time & Timeframe
  if (trimmed === 'Baru saja') return 'Just now';
  if (trimmed === 'Bulan 1 - 2' || trimmed === 'Bulan 1-2') return 'Month 1 - 2';
  if (trimmed === 'Bulan 3 - 4' || trimmed === 'Bulan 3-4') return 'Month 3 - 4';
  if (trimmed === 'Bulan 5 - 7' || trimmed === 'Bulan 5-7') return 'Month 5 - 7';
  if (trimmed === 'Bulan 8 - 10' || trimmed === 'Bulan 8-10') return 'Month 8 - 10';
  if (trimmed === 'Bulan 11 - 12' || trimmed === 'Bulan 11-12') return 'Month 11 - 12';

  // Statuses
  if (trimmed === 'LOKASI SAAT INI') return 'YOU ARE HERE';
  if (trimmed === 'SEDANG BERJALAN') return 'IN PROGRESS';
  if (trimmed === 'TARGET SELANJUTNYA') return 'NEXT GOAL';
  if (trimmed === 'TARGET MASA DEPAN') return 'FUTURE GOAL';
  if (trimmed === 'TARGET KARIR') return 'CAREER TARGET';

  // Fallback description
  if (trimmed === 'Deskripsi pekerjaan terverifikasi dari Live Job API.') return 'Verified job description from Live Job API.';

  // Default replacements for nested patterns
  return trimmed
    .replace(/Lowongan Terverifikasi/g, 'Verified Job Listing')
    .replace(/Kerja di rumah/gi, 'Work from home')
    .replace(/Gaji Kompetitif \(Negosiasi\)/gi, 'Competitive Salary (Negotiable)')
    .replace(/Gaji Kompetitif/gi, 'Competitive Salary')
    .replace(/Mahasiswa Aktif/gi, 'Active Student')
    .replace(/Baru saja/gi, 'Just now')
    .replace(/^Tahap (\d+):/i, 'Stage $1:')
    .replace(/Bulan (\d+)\s*-\s*(\d+)/gi, 'Month $1 - $2');
}

/**
 * Lightweight bilingual helper for inline ID/EN strings & dynamic field translation.
 * Re-renders automatically when the user switches language (via react-i18next).
 */
export default function useBilingual() {
  const { i18n } = useTranslation();
  const isEn = (i18n.resolvedLanguage || i18n.language || 'id').startsWith('en');
  const L = (id, en) => (isEn ? en : id);
  const T = (text) => translateJobField(text, isEn);

  return { isEn, L, T, lang: isEn ? 'en' : 'id' };
}
