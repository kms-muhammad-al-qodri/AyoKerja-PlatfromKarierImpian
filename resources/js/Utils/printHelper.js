import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Robust print helper using an isolated hidden iframe.
 * Eliminates all issues with:
 * - Hidden ancestors (`hidden lg:block` breakpoint mismatches in print mode)
 * - Dashboard sidebar & header intrusions
 * - CSS transform scale distortions
 * - Blank sheets in Chrome/Edge print dialog
 */
export const printElementViaIframe = (elementId, title = 'Dokumen') => {
  const sourceEl = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
  if (!sourceEl) {
    console.error(`printElementViaIframe: Element #${elementId} not found.`);
    window.print();
    return;
  }

  // Remove any previously orphaned print iframes
  const oldIframe = document.getElementById('ayokerja-print-iframe');
  if (oldIframe && oldIframe.parentNode) {
    oldIframe.parentNode.removeChild(oldIframe);
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'ayokerja-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.style.zIndex = '-9999';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  // Clone stylesheets from host document
  const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(el => el.outerHTML)
    .join('\n');

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        ${headStyles}
        <style>
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          .ayokerja-print-container {
            width: 794px !important;
            max-width: 794px !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
            overflow: visible !important;
          }
          .ayokerja-print-container * {
            visibility: visible !important;
          }
        </style>
      </head>
      <body>
        <div class="ayokerja-print-container">
          ${sourceEl.outerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Give styles a brief moment to calculate layout
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.error('Print iframe error:', e);
      window.print();
    } finally {
      setTimeout(() => {
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 5000);
    }
  }, 450);
};

/**
 * Direct High-Resolution PDF Download using html2canvas-pro (native oklch support) & jsPDF.
 * Silently saves the .pdf file without opening the browser's print dialog,
 * and seamlessly falls back to printElementViaIframe if anything fails.
 */
export const downloadElementAsPdf = async ({
  elementId,
  fileName = 'Dokumen.pdf',
  onStart,
  onSuccess,
  onError,
}) => {
  if (onStart) onStart();

  const sourceEl = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
  if (!sourceEl) {
    if (onError) onError('Elemen dokumen tidak ditemukan.');
    return;
  }

  try {
    const canvas = await html2canvas(sourceEl, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
      onclone: (clonedDoc) => {
        // Find cloned element
        const targetId = typeof elementId === 'string' ? elementId : sourceEl.id;
        const clonedSource = targetId ? clonedDoc.getElementById(targetId) : null;
        if (clonedSource) {
          // Unwind all ancestor scaling, hiding, or clipping
          let curr = clonedSource.parentElement;
          while (curr && curr !== clonedDoc.body) {
            curr.style.display = 'block';
            curr.style.visibility = 'visible';
            curr.style.opacity = '1';
            curr.style.transform = 'none';
            curr.style.webkitTransform = 'none';
            curr.style.maxHeight = 'none';
            curr.style.overflow = 'visible';
            curr.style.filter = 'none';
            curr = curr.parentElement;
          }

          clonedSource.style.width = '794px';
          clonedSource.style.minWidth = '794px';
          clonedSource.style.maxWidth = '794px';
          clonedSource.style.margin = '0 auto';
          clonedSource.style.boxSizing = 'border-box';
          clonedSource.style.boxShadow = 'none';
          clonedSource.style.transform = 'none';
          clonedSource.style.visibility = 'visible';
          clonedSource.style.opacity = '1';
          clonedSource.style.display = 'block';
        }
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Check if single or multi-page
    if (imgHeight <= pdfHeight + 5) {
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight));
    } else {
      // Multi-page slicing
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
    }

    const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(cleanFileName);

    if (onSuccess) onSuccess();
  } catch (err) {
    console.error('Direct PDF export error, falling back to iframe print:', err);
    if (onError) onError('Gagal mengekspor PDF langsung. Membuka dialog cetak bersih...');
    // Fallback to iframe printing so user is NEVER left with a blank screen
    printElementViaIframe(elementId, fileName.replace('.pdf', ''));
  }
};
