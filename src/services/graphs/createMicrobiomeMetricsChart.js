const QuickChart = require("quickchart-js");

function createMicrobiomeMetricsChart(data) {
  const phylumTotals = data["microbiome metrics"]["Phylum Totals"];
  const labels = Object.keys(phylumTotals);
  const values = labels.map((key) => parseFloat(phylumTotals[key]));

  const chart = new QuickChart();
  chart.setWidth(800).setHeight(400);
  chart.setConfig({
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
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
    options: {
      title: {
        display: true,
        text: "Microbiome Metrics - Phylum Totals",
      },
    },
  });

  return chart.getUrl();
}

module.exports = createMicrobiomeMetricsChart;
