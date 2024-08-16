const fs = require("fs");
const path = require("path");
const axios = require("axios");
const createBloodParametersChart = require("./graphs/createBloodParametersChart");
const createMicrobiomeMetricsChart = require("./graphs/createMicrobiomeMetricsChart");
const { createCanvas } = require("canvas");
const Chart = require("chart.js/auto");
const echarts = require("echarts");

const createDonutChart = require("./graphs/createDonutChart");
const createRangePlot = require("./graphs/createRangePlot");
const createSpeedometerChart = require("./graphs/createSpeedometerChart");
const createStackedBarChart = require("./graphs/createStackedBarChart");
const createBubbleChart = require("./graphs/createBubbleChart");
const createLinearCurve = require("./graphs/createLinearCurve");
const createContourPlot = require("./graphs/createContourPlot");
const createPieChart = require("./graphs/createPieChart");
const createLipidProfileCharts = require("./graphs/createLipidProfileCharts");

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

async function saveChartToS3(chartName, chartBuffer, userId) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `users/${userId}/charts/${chartName}.png`,
    Body: chartBuffer,
    ContentType: "image/png",
    ACL: "public-read",
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error(`Error uploading ${chartName} to S3:`, error);
    throw error;
  }
}

async function createCharts(userId) {
  const data = JSON.parse(fs.readFileSync("src/data/output/data.json", "utf8"));

  const charts = [
    { name: "donutChart", generator: createDonutChart },
    { name: "rangePlot", generator: createRangePlot },
    { name: "speedometerChart", generator: createSpeedometerChart },
    { name: "stackedBarChart", generator: createStackedBarChart },
    { name: "bubbleChart", generator: createBubbleChart },
    { name: "linearCurve", generator: createLinearCurve },
    { name: "contourPlot", generator: createContourPlot },
    { name: "pieChart", generator: createPieChart },
    {
      name: "cholesterolRange",
      generator: (data) => createLipidProfileCharts(data).cholesterolRange,
    },
    {
      name: "scatterPlotWithMarkers",
      generator: (data) =>
        createLipidProfileCharts(data).scatterPlotWithMarkers,
    },
  ];

  const chartUrls = {};
  for (const chart of charts) {
    const chartBuffer = await chart.generator(data);
    chartUrls[chart.name] = await saveChartToS3(
      chart.name,
      chartBuffer,
      userId
    );
  }

  return chartUrls;
}

async function createPDF(userId, chartUrls) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(chunks);
      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `users/${userId}/pdfs/${Date.now()}.pdf`,
        Body: pdfBuffer,
        ContentType: "application/pdf",
        ACL: "public-read",
      };

      try {
        const data = await s3.upload(s3Params).promise();
        console.log("PDF uploaded successfully. URL:", data.Location);
        resolve(data.Location);
      } catch (err) {
        console.error("Error uploading PDF to S3:", err);
        reject(err);
      }
    });

    for (const [chartName, chartUrl] of Object.entries(chartUrls)) {
      doc.addPage();
      doc.image(chartUrl, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
    }

    doc.end();
  });
}

module.exports = { createCharts, createPDF };
