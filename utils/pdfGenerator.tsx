import { Document, Page, View, Text, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import React from 'react';

// Define styles for PDF
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
  pageBreak: {
    break: 'page',
  },
  image: {
    objectFit: 'contain',
  },
  chart: {
    width: '100%',
    height: 'auto',
  }
});

// PDF Generation wrapper
export const generatePDF = async (components: React.ReactElement[]): Promise<Buffer> => {
  const MyDocument = () => (
    <Document>
      {components.map((component, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <View style={styles.section}>
            {component}
          </View>
        </Page>
      ))}
    </Document>
  );

  return await pdf(<MyDocument />).toBuffer();
};

// Function to handle charts and images
export const optimizeImage = async (imageUrl: string, quality: number = 0.8): Promise<string> => {
  if (typeof window === 'undefined') return imageUrl;
  
  const image = new Image();
  image.src = imageUrl;
  
  return new Promise((resolve) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set dimensions
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Draw and optimize
      ctx?.drawImage(image, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
  });
};
