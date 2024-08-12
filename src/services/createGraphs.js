const fs = require("fs");
const QuickChart = require("quickchart-js");
const axios = require("axios");
const path = require("path");

async function saveImage(url, filePath) {
  console.log("inside function: with url : " + url);
  try {
    console.log("Inside try");
    const response = await axios.get(url, { responseType: "arraybuffer" });
    console.log("Fetched Response");
    const buffer = response.data;

    // Check if the directory exists, if not create it
    const directory = path.dirname(filePath);
    await fs.promises.mkdir(directory, { recursive: true });

    // Write the file
    await fs.promises.writeFile(filePath, Buffer.from(buffer));
    console.log(`Image saved to ${filePath}`);
  } catch (error) {
    console.error(`Failed to save image from ${url}:`, error);
  }
}

async function createCharts() {
  // Read the JSON data from the file
  const data = fs.readFileSync("src/data/output/data.json", "utf8");
  const jsonData = JSON.parse(data);
  console.log(jsonData["microbiome metrics"]["Phylum Totals"]);

  // Ensure the JSON structure is as expected
  const phylumTotals = jsonData["microbiome metrics"]
    ? jsonData["microbiome metrics"]["Phylum Totals"]
    : {};

  // Check if phylumTotals is defined and not null
  if (!phylumTotals) {
    throw new Error("Phylum totals data is missing or undefined");
  }

  // Parse the values to ensure they are numbers
  const dataYours = [];
  for (const key in phylumTotals) {
    if (phylumTotals.hasOwnProperty(key)) {
      dataYours.push(parseInt(phylumTotals[key]));
    }
  }
  console.log("Data yours" + dataYours);
  const labels = Object.keys(phylumTotals);

  const dataNormal = [20, 40, 20, 5, 5];

  console.log("Building Charts....");

  // Create a QuickChart instance for the "Normal" pie chart
  const chartNormal = new QuickChart();
  chartNormal.setConfig({
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "NORMAL",
          data: dataNormal,
          backgroundColor: [
            "#36A2EB",
            "#FFCE56",
            "#FF6384",
            "#AA63D9",
            "#FF9F40",
          ],
        },
      ],
    },
  });

  // Get the URL for the "Normal" chart
  const normalImageUrl = chartNormal.getUrl();
  console.log("normal image: " + normalImageUrl);
  // Create a QuickChart instance for the "Yours" pie chart
  const chartYours = new QuickChart();
  chartYours.setConfig({
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "YOURS",
          data: dataYours,
          backgroundColor: [
            "#36A2EB",
            "#FFCE56",
            "#FF6384",
            "#AA63D9",
            "#FF9F40",
          ],
        },
      ],
    },
  });

  // Get the URL for the "Yours" chart
  const yoursImageUrl = chartYours.getUrl();
  console.log("Yours Image: " + yoursImageUrl);

  // Save the charts as images
  await saveImage(normalImageUrl, "src/data/charts/normal.png");
  await saveImage(yoursImageUrl, "src/data/charts/yours.png");

  console.log("Charts created and saved as images.");
}
module.exports = { createCharts };
