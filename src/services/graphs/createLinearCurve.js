const { createCanvas } = require("canvas");
const Chart = require("chart.js/auto");

function createLinearCurve(data) {
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: Object.keys(data["microbiome metrics"]["DYSBIOSIS RATIOS"]),
      datasets: [
        {
          label: "Dysbiosis Ratios",
          data: Object.values(data["microbiome metrics"]["DYSBIOSIS RATIOS"]),
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  return canvas.toBuffer("image/png");
}

module.exports = createLinearCurve;
