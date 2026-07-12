
import { pdfService } from '../services/pdf.service.js';

export const generatePDF = async (req, res, next) => {
  try {
    const { html, css } = req.body;
    const pdfBuffer = await pdfService.generatePDF(html, css);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Resume.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
