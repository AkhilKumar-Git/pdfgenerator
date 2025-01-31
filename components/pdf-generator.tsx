"use client";

import React, { useEffect, useState } from 'react';
import { PDFViewer, Document, Page, View, StyleSheet } from '@react-pdf/renderer';
import { generatePDF } from '../utils/pdfGenerator';
import { convertComponent } from '../utils/componentConverter';

// Define styles for PDF components
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
});

interface PDFGeneratorProps {
  reportData: any;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ reportData }) => {
  const [isClient, setIsClient] = useState(false);
  const [pdfComponents, setPdfComponents] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    setIsClient(true);
    convertComponents();
  }, []);

  const convertComponents = async () => {
    const components = [
      {
        type: { name: 'TraitHealthReportComponent' },
        props: { personal_info: reportData.personal_info }
      },
      {
        type: { name: 'TableOfContents' },
        props: {
          contentList: reportData.toc,
          name: reportData.personal_info.name,
          report_date: reportData.personal_info.report_date
        }
      },
      // Add more components here
    ];

    const convertedComponents = await Promise.all(
      components.map(component => convertComponent(component))
    );

    setPdfComponents(convertedComponents);
  };

  const handleDownload = async () => {
    try {
      const blob = await generatePDF(pdfComponents);
      const url = URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'integrated-health-report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!isClient) {
    return <div>Loading PDF generator...</div>;
  }

  return (
    <div className="pdf-generator">
      <div className="mb-4">
        <button 
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download PDF
        </button>
      </div>
      
      <div className="w-full h-screen">
        <PDFViewer width="100%" height="100%">
          <Document>
            {pdfComponents.map((component, index) => (
              <Page key={index} size="A4" style={styles.page}>
                <View style={styles.section}>{component}</View>
              </Page>
            ))}
          </Document>
        </PDFViewer>
      </div>
    </div>
  );
};

export default PDFGenerator;
