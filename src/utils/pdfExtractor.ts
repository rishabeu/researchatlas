import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  try {
    // Use official CDN matching the installed version or fallback
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('Could not set workerSrc from cdnjs:', e);
  }
}

export interface ExtractionProgress {
  currentPage: number;
  totalPages: number;
  percentage: number;
  statusText: string;
}

export async function extractTextFromPdf(
  file: File,
  onProgress?: (progress: ExtractionProgress) => void
): Promise<{ text: string; pageCount: number; fileName: string }> {
  // Validate file size (max 25MB)
  const MAX_SIZE_MB = 25;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`PDF exceeds maximum allowed size of ${MAX_SIZE_MB}MB.`);
  }

  if (file.type && !file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Please select a valid PDF file (.pdf extension).');
  }

  onProgress?.({
    currentPage: 0,
    totalPages: 0,
    percentage: 5,
    statusText: 'Reading PDF binary buffer...',
  });

  const arrayBuffer = await file.arrayBuffer();
  
  onProgress?.({
    currentPage: 0,
    totalPages: 0,
    percentage: 15,
    statusText: 'Initializing PDF parser...',
  });

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;

  if (totalPages === 0) {
    throw new Error('The selected PDF contains no readable pages.');
  }

  const extractedPages: string[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Combine text items with spacing awareness
    const pageText = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');

    extractedPages.push(pageText.trim());

    const percentage = Math.round(15 + (pageNum / totalPages) * 80);
    onProgress?.({
      currentPage: pageNum,
      totalPages,
      percentage,
      statusText: `Extracting text: page ${pageNum} of ${totalPages}...`,
    });
  }

  const combinedText = extractedPages.join('\n\n--- Page Break ---\n\n').trim();

  if (combinedText.length < 50) {
    throw new Error(
      'Extracted text is empty or too short. This document may be a scanned image PDF without an embedded text layer (OCR required).'
    );
  }

  onProgress?.({
    currentPage: totalPages,
    totalPages,
    percentage: 100,
    statusText: 'Extraction completed successfully.',
  });

  return {
    text: combinedText,
    pageCount: totalPages,
    fileName: file.name,
  };
}
