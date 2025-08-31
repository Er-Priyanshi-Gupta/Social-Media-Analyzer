import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export class TextExtractionEngine {
  private static ocrWorker: Tesseract.Worker | null = null;

  static async initOCR(): Promise<void> {
    if (!this.ocrWorker) {
      this.ocrWorker = await createWorker('eng');
    }
  }

  static async extractFromPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText.trim();
    } catch (error) {
      throw new Error('Failed to extract text from PDF: ' + (error as Error).message);
    }
  }

  static async extractFromImage(file: File): Promise<string> {
    try {
      await this.initOCR();
      if (!this.ocrWorker) {
        throw new Error('OCR worker not initialized');
      }

      const { data: { text } } = await this.ocrWorker.recognize(file);
      return text.trim();
    } catch (error) {
      throw new Error('Failed to extract text from image: ' + (error as Error).message);
    }
  }

  static async extractText(file: File): Promise<string> {
    const fileType = file.type.toLowerCase();
    
    if (fileType === 'application/pdf') {
      return this.extractFromPDF(file);
    } else if (fileType.startsWith('image/')) {
      return this.extractFromImage(file);
    } else {
      throw new Error('Unsupported file type');
    }
  }

  static cleanup(): void {
    if (this.ocrWorker) {
      this.ocrWorker.terminate();
      this.ocrWorker = null;
    }
  }
}
