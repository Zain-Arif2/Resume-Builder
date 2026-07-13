import { pdfService } from "../services/pdf.service.js";

export const generatePDF = async (req, res, next) => {
  try {
    const { html, css } = req.body;

    const pdfBuffer = await pdfService.generatePDF(html, css);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Resume.pdf"',
      "Content-Length": pdfBuffer.length,
    });

    return res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};