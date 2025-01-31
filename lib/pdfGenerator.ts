// src/lib/pdfGenerator.ts
import * as puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";

interface PDFOptions {
  format?: string;
  margin?: { top: string; right: string; bottom: string; left: string };
  scale?: number;
  preferCSSPageSize?: boolean;
}

class PDFGenerator {
  private browser: puppeteer.Browser | null = null;

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async generatePDF(html: string, styles: string[], options: PDFOptions = {}) {
    const {
      format = "A4",
      margin = { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
      scale = 1,
      preferCSSPageSize = true,
    } = options;

    if (!this.browser) {
      await this.initialize();
    }

    try {
      const page = await this.browser!.newPage();

      // Set viewport to A4 size
      await page.setViewport({
        width: 794,
        height: 1123,
        deviceScaleFactor: scale,
      });

      // Create a complete HTML document with all styles
      const completeHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!-- Include Tailwind CSS -->
            <link href="https://cdn.tailwindcss.com" rel="stylesheet">
            <!-- Custom print styles -->
            <style>
              @page {
                size: A4;
                margin: 0;
              }
              .component {
                page-break-inside: avoid;
                margin-bottom: 20px;
              }
              @media print {
                .page-break {
                  page-break-before: always;
                }
                html, body {
                  width: 210mm;
                  height: 297mm;
                }
              }
              /* Include all passed styles */
              ${styles.join("\n")}
            </style>
          </head>
          <body>
            <div id="content">
              ${html}
            </div>
          </body>
        </html>
      `;

      // Set content and wait for all resources to load
      await page.setContent(completeHtml, {
        waitUntil: ["domcontentloaded", "networkidle0"],
      });

      // Wait for specific elements/content to be ready
      await page.waitForSelector(".dynamic-content");
      // OR

      // Generate PDF with high-quality settings
      const pdfBuffer = await page.pdf({
        format: format as puppeteer.PaperFormat,
        margin,
        preferCSSPageSize,
        printBackground: true,
        scale,
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate: `
          <div style="font-size: 10px; text-align: center; width: 100%;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        `,
        omitBackground: false,
      });

      // Optimize PDF while maintaining quality
      const pdfDoc = await PDFDocument.load(pdfBuffer);

      const optimizedPdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      return Buffer.from(optimizedPdfBytes);
    } catch (error) {
      console.error("PDF generation error:", error);
      throw error;
    }
  }
}

// Export as singleton
export const pdfGenerator = new PDFGenerator();
