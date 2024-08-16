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

async function createCharts() {
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

  for (const chart of charts) {
    const chartBuffer = await chart.generator(data);
    fs.writeFileSync(`src/data/charts/${chart.name}.png`, chartBuffer);
  }

  console.log("Charts created and saved as images.");
}
module.exports = { createCharts };
