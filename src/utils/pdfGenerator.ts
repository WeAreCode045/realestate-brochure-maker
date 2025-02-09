// src/utils/pdfGenerator.ts
import PDFDocument from 'pdfkit';
import { PropertyData } from '../components/PropertyForm';

export async function generatePropertyPDF(propertyData: PropertyData): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true
      });

      // Collect PDF chunks
      const chunks: Uint8Array[] = [];
      doc.on('data', chunks.push.bind(chunks));
      doc.on('end', () => {
        const pdfBlob = new Blob(chunks, { type: 'application/pdf' });
        resolve(pdfBlob);
      });

      // Add content to PDF
      addContentToPDF(doc, propertyData);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function addContentToPDF(doc: PDFKit.PDFDocument, data: PropertyData) {
  // Header with main image
  if (data.images.length > 0) {
    doc.image(data.images[0], {
      fit: [500, 300],
      align: 'center'
    });
    doc.moveDown();
  }

  // Title and Price
  doc.fontSize(24).font('Helvetica-Bold').text(data.title, { align: 'center' });
  doc.fontSize(18).font('Helvetica').text(data.price, { align: 'center' });
  doc.moveDown();

  // Property Details
  doc.fontSize(14).font('Helvetica-Bold').text('Property Details');
  doc.fontSize(12).font('Helvetica');
  doc.text(`Address: ${data.address}`);
  doc.text(`Living Area: ${data.livingArea} m²`);
  doc.text(`Plot Size: ${data.sqft} m²`);
  doc.text(`Bedrooms: ${data.bedrooms}`);
  doc.text(`Bathrooms: ${data.bathrooms}`);
  doc.text(`Build Year: ${data.buildYear}`);
  doc.text(`Garages: ${data.garages}`);
  doc.text(`Energy Label: ${data.energyLabel}`);
  doc.moveDown();

  // Description
  doc.fontSize(14).font('Helvetica-Bold').text('Description');
  doc.fontSize(12).font('Helvetica').text(data.description);
  doc.moveDown();

  // Features
  if (data.features.length > 0) {
    doc.fontSize(14).font('Helvetica-Bold').text('Features');
    data.features.forEach(feature => {
      doc.fontSize(12).font('Helvetica').text(`• ${feature.description}`);
    });
    doc.moveDown();
  }

  // Images
  if (data.images.length > 1) {
    doc.addPage();
    doc.fontSize(14).font('Helvetica-Bold').text('Photos', { align: 'center' });
    doc.moveDown();

    const imagesPerRow = 2;
    const imageWidth = 250;
    const imageHeight = (imageWidth * 3) / 4;
    const spacing = 20;

    for (let i = 1; i < data.images.length; i++) {
      const row = Math.floor((i - 1) / imagesPerRow);
      const col = (i - 1) % imagesPerRow;
      const x = 50 + (col * (imageWidth + spacing));
      const y = doc.y + (row * (imageHeight + spacing));

      if (y + imageHeight > doc.page.height - 50) {
        doc.addPage();
        doc.fontSize(14).font('Helvetica-Bold').text('Photos (continued)', { align: 'center' });
        doc.moveDown();
      }

      doc.image(data.images[i], x, doc.y, {
        fit: [imageWidth, imageHeight]
      });
    }
  }

  // Add agency information if available
  const agencySettings = localStorage.getItem('agencySettings');
  const agencyLogo = localStorage.getItem('agencyLogo');

  if (agencySettings) {
    doc.addPage();
    doc.fontSize(14).font('Helvetica-Bold').text('Contact Information', { align: 'center' });
    doc.moveDown();

    const settings = JSON.parse(agencySettings);
    doc.fontSize(12).font('Helvetica');
    doc.text(`${settings.name}`);
    doc.text(`${settings.address}`);
    doc.text(`${settings.phone}`);
    doc.text(`${settings.email}`);

    if (agencyLogo) {
      doc.image(agencyLogo, {
        fit: [200, 100],
        align: 'center'
      });
    }
  }
}
