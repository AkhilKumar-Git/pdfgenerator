const { createCanvas } = require("canvas");
const Chart = require("chart.js/auto");
const ChartDataLabels = require("chartjs-plugin-datalabels");

Chart.register(ChartDataLabels);

function createBloodParametersChart(data) {
  const canvas = createCanvas(1000, 800);
  const ctx = canvas.getContext("2d");

  const parameters = [
    "Hemoglobin",
    "Total RBC Count",
    "Total WBC Count",
    "Platelet Count",
    "PCV/HCT",
    "MCV",
    "MCH",
    "MCHC",
    "Erythrocyte Sedimentation Rate (ESR)",
  ];

  const values = parameters.map((param) =>
    parseFloat(data["test markers"][param])
  );
  const ranges = [
    [12, 15],
    [3.8, 4.8],
    [4000, 10000],
    [1.5, 4.1],
    [36, 46],
    [83, 101],
    [27, 32],
    [31.5, 34.5],
    [0, 30],
  ];

  const units = [
    "g/dL",
    "Mlns/cmm",
    "cells/cmm",
    "lakhs/cmm",
    "%",
    "fL",
    "pg",
    "g/dL",
    "mm/hr",
  ];

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: parameters,
      datasets: [
        {
          // Range
          data: ranges.map((range) => range[1] - range[0]),
          backgroundColor: "rgba(200, 200, 200, 0.3)",
          barPercentage: 0.5,
        },
        {
          // Actual value
          data: values,
          backgroundColor: (context) => {
            const value = context.dataset.data[context.dataIndex];
            const range = ranges[context.dataIndex];
            return value >= range[0] && value <= range[1]
              ? "rgba(0, 0, 0, 0.8)"
              : "rgba(255, 99, 132, 0.8)";
          },
          barPercentage: 0.2,
        },
      ],
    },
    options: {
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        datalabels: {
          color: "#333",
          font: { weight: "bold" },
          formatter: (value, context) => {
            if (context.datasetIndex === 1) {
              return value.toFixed(1);
            }
            return "";
          },
          align: "end",
          anchor: "end",
        },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          stacked: true,
          display: false,
        },
        y: {
          stacked: true,
          ticks: {
            callback: (value, index) => {
              return [parameters[index], units[index]];
            },
            font: {
              weight: "bold",
            },
          },
        },
      },
      layout: {
        padding: {
          right: 100,
        },
      },
    },
    plugins: [
      {
        id: "customPlugin",
        afterDraw: (chart) => {
          const ctx = chart.ctx;
          chart.data.datasets[1].data.forEach((value, index) => {
            const meta = chart.getDatasetMeta(1);
            const x = meta.data[index].x;
            const y = meta.data[index].y;

            ctx.fillStyle = "#333";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.font = "bold 12px Arial";

            // Draw range
            ctx.fillText(
              `${ranges[index][0]} - ${ranges[index][1]}`,
              x + 10,
              y
            );

            // Draw actual value
            ctx.fillStyle =
              value >= ranges[index][0] && value <= ranges[index][1]
                ? "#333"
                : "#FF6384";
            ctx.font = "bold 14px Arial";
            ctx.fillText(value.toFixed(1), chart.width - 50, y);
          });
        },
      },
    ],
  });

  return canvas.toBuffer("image/png");
}

module.exports = createBloodParametersChart;
