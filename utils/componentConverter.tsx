import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { optimizeImage } from './pdfGenerator';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  image: {
    width: '100%',
    maxHeight: 300,
    objectFit: 'contain',
  },
  chart: {
    width: '100%',
    height: 200,
  },
});

export const convertComponent = async (component: React.ReactElement) => {
  // Handle different component types
  switch (component.type.name) {
    case 'TraitHealthReportComponent':
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>Health Report</Text>
          <Text style={styles.text}>
            Name: {component.props.personal_info.name}
          </Text>
          <Text style={styles.text}>
            Date: {component.props.personal_info.report_date}
          </Text>
        </View>
      );

    case 'TableOfContents':
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>Table of Contents</Text>
          {component.props.contentList.map((item: any, index: number) => (
            <Text key={index} style={styles.text}>
              {item.title}
            </Text>
          ))}
        </View>
      );

    case 'BloodTest':
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>Blood Test Results</Text>
          {Object.entries(component.props.testData).map(([key, value]: [string, any]) => (
            <Text key={key} style={styles.text}>
              {key}: {value.value} {value.unit}
            </Text>
          ))}
        </View>
      );

    // Add more component converters as needed

    default:
      // Default fallback for unknown components
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Component: {component.type.name}</Text>
        </View>
      );
  }
};

export const convertImage = async (src: string): Promise<string> => {
  try {
    return await optimizeImage(src);
  } catch (error) {
    console.error('Error optimizing image:', error);
    return src;
  }
};
