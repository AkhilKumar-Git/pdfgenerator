const { createCanvas } = require("canvas");
const Chart = require("chart.js/auto");

function createRangePlot(data) {
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: Object.keys(data["test markers"]),
      datasets: [
        {
          label: "Marker Levels",
          data: Object.values(data["test markers"]),
          borderColor: "rgba(75, 192, 192, 1)",
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

module.exports = createRangePlot;
