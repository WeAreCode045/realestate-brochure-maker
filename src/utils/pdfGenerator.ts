
import { PropertyData } from '../components/PropertyForm';
import type PDFKit from 'pdfkit';

// Helper function to convert File to Buffer
async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Helper function to convert data URL to Uint8Array
function dataURLtoUint8Array(dataURL: string): Uint8Array {
  const base64 = dataURL.split(',')[1];
  const binaryString = window.atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function generatePropertyPDF(propertyData: PropertyData): Promise<Blob> {
  // Dynamically import PDFKit
  const PDFDocument = (await import('pdfkit/js/pdfkit.standalone')).default;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });

    // Collect PDF chunks
    const chunks: Uint8Array[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBlob = new Blob(chunks, { type: 'application/pdf' });
      resolve(pdfBlob);
    });

    // Handle errors
    doc.on('error', (error) => {
      console.error('PDF Generation Error:', error);
      reject(error);
    });

    try {
      // Create the PDF content
      doc.fontSize(24).font('Helvetica-Bold').text(propertyData.title, { align: 'center' });
      doc.fontSize(18).font('Helvetica').text(propertyData.price, { align: 'center' });
      doc.moveDown();

      // Property Details
      doc.fontSize(14).font('Helvetica-Bold').text('Property Details');
      doc.fontSize(12).font('Helvetica');
      doc.text(`Address: ${propertyData.address}`);
      doc.text(`Living Area: ${propertyData.livingArea} m²`);
      doc.text(`Plot Size: ${propertyData.sqft} m²`);
      doc.text(`Bedrooms: ${propertyData.bedrooms}`);
      doc.text(`Bathrooms: ${propertyData.bathrooms}`);
      doc.text(`Build Year: ${propertyData.buildYear}`);
      doc.text(`Garages: ${propertyData.garages}`);
      doc.text(`Energy Label: ${propertyData.energyLabel}`);
      doc.moveDown();

      // Description
      doc.fontSize(14).font('Helvetica-Bold').text('Description');
      doc.fontSize(12).font('Helvetica').text(propertyData.description);
      doc.moveDown();

      // Features
      if (propertyData.features.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('Features');
        propertyData.features.forEach(feature => {
          doc.fontSize(12).font('Helvetica').text(`• ${feature.description}`);
        });
        doc.moveDown();
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
          const logoArray = dataURLtoUint8Array(agencyLogo);
          doc.image(logoArray, {
            fit: [200, 100],
            align: 'center'
          });
        }
      }

      // Finalize the PDF
      doc.end();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      reject(error);
    }
  });
}
