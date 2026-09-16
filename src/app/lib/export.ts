import { jsPDF } from 'jspdf';

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function exportTextAsPdf(filename: string, title: string, body: string) {
  const doc = new jsPDF();
  const marginX = 20;
  const maxWidth = 170;
  let y = 20;

  doc.setFontSize(16);
  doc.text(title, marginX, y);
  y += 10;

  doc.setFontSize(11);
  const paragraphs = body.split('\n');
  paragraphs.forEach((paragraph) => {
    const lines: string[] = paragraph.length ? doc.splitTextToSize(paragraph, maxWidth) : [''];
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, marginX, y);
      y += 6;
    });
  });

  doc.save(`${filename}.pdf`);
}

export function exportTextAsWord(filename: string, title: string, body: string) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head><body><h2>${escapeHtml(title)}</h2><div style="white-space:pre-wrap;font-family:Calibri,Arial,sans-serif;font-size:14px;line-height:1.5;">${escapeHtml(body)}</div></body></html>`;
  const blob = new Blob(['﻿', html], { type: 'application/msword' });
  triggerDownload(blob, `${filename}.doc`);
}
