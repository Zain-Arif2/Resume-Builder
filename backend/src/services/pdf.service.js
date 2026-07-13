import { ApiError } from "../utils/ApiError.js";
import { getPage, releasePage } from "./browser.service.js";

export const pdfService = {
  async generatePDF(html, css = "") {
    let page;

    try {
      page = await getPage();

      await page.setViewport({
        width: 794,
        height: 1123,
        deviceScaleFactor: 2,
      });

      const fullHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <!-- Tailwind (temporarily keep) -->
        <script src="https://cdn.tailwindcss.com"></script>

        <style>
          ${css}

          *{
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing:border-box;
          }

          html,body{
            margin:0;
            padding:0;
            background:white;
          }

          @page{
            size:A4;
            margin:0;
          }

          .avoid-break{
            page-break-inside:avoid !important;
            break-inside:avoid !important;
          }
        </style>
      </head>

      <body>
        ${html}
      </body>
      </html>
      `;

      await page.setContent(fullHTML, {
        waitUntil: "domcontentloaded",
      });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
      });

      return Buffer.from(pdf);
    } catch (error) {
      console.error(error);
      throw ApiError.internal("Failed to generate PDF");
    } finally {
      if (page) {
        await releasePage(page);
      }
    }
  },
};