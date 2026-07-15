import { pdfService } from '../services/pdf.service.js';
import HTMLtoDOCX from 'html-to-docx';

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

export const generateDOCX = async (req, res, next) => {
  try {
    const { html, css } = req.body;

    const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${css || ''}</style></head><body>${html}</body></html>`;

    const docxBuffer = await HTMLtoDOCX(fullHtml, null, {
      table: { row: { cantSplit: true } },
      footer: false,
      pageNumber: false,
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="Resume.docx"');
    res.send(docxBuffer);
  } catch (error) {
    next(error);
  }
};
