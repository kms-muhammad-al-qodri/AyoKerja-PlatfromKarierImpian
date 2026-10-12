import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

/**
 * useLanguageSync — Hook yang menyinkronkan bahasa dari database (via Inertia shared props)
 * ke react-i18next dan localStorage saat user pertama kali login / refresh halaman.
 *
 * Dipanggil sekali di komponen root halaman yang memerlukan auth (misal Dashboard, CvAnalysis, dll.)
 */
export default function useLanguageSync() {
  const { auth } = usePage().props;
  const { i18n } = useTranslation();

  useEffect(() => {
    const dbLang = auth?.user?.language;
    const localLang = localStorage.getItem('ayokerja_lang');

    if (dbLang && dbLang !== i18n.language) {
      // Prioritas: bahasa tersimpan di DB (lintas device)
      i18n.changeLanguage(dbLang);
      localStorage.setItem('ayokerja_lang', dbLang);
    } else if (!dbLang && localLang && localLang !== i18n.language) {
      // Fallback: bahasa dari localStorage (guest/belum login)
      i18n.changeLanguage(localLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user?.language]);
}
