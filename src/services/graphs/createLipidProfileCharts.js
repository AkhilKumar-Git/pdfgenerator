const { createCanvas } = require("canvas");
const Chart = require("chart.js/auto");
const echarts = require("echarts");

function createLipidProfileCharts(data) {
  const lipidProfile = {
    "Cholesterol-Total": data["test markers"]["Cholesterol-Total-Index-2"],
    HDL: data["test markers"]["Cholesterol-HDL Direct-Index-4"],
    LDL: data["test markers"]["LDL Cholesterol-Index-5"],
  };

  const ranges = {
    "Cholesterol-Total": [0, 200, 239],
    HDL: [40, 60],
    LDL: [0, 100, 159],
  };

  // Create Cholesterol Range Chart
  const cholesterolCanvas = createCanvas(800, 400);
  const cholesterolCtx = cholesterolCanvas.getContext("2d");

  new Chart(cholesterolCtx, {
    type: "bar",
    data: {
      labels: ["Cholesterol-Total", "HDL", "LDL"],
      datasets: [
        {
          label: "Lipid Levels",
          data: Object.values(lipidProfile),
          backgroundColor: (ctx) => {
            const value = ctx.dataset.data[ctx.dataIndex];
            const range = ranges[ctx.label];
            if (ctx.label === "HDL") {
              if (value >= range[1]) return "rgba(75, 192, 192, 0.5)"; // Better
              if (value >= range[0] && value < range[1])
                return "rgba(255, 206, 86, 0.5)"; // Good
              return "rgba(255, 99, 132, 0.5)"; // High Risk
            } else if (ctx.label === "Cholesterol-Total") {
              if (value < range[0]) return "rgba(75, 192, 192, 0.5)"; // Good
              if (value >= range[0] && value < range[1])
                return "rgba(255, 206, 86, 0.5)"; // Borderline
              return "rgba(255, 99, 132, 0.5)"; // Bad
            } else if (ctx.label === "LDL") {
              if (value < range[0]) return "rgba(75, 192, 192, 0.5)"; // Good
              if (value >= range[0] && value < range[1])
                return "rgba(255, 206, 86, 0.5)"; // Borderline
              return "rgba(255, 99, 132, 0.5)"; // Bad
            }
          },
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          max: 300,
        },
      },
    },
  });

  // Create Scatter Plot with Range Indicators
  const scatterCanvas = createCanvas(800, 400);
  const chart = echarts.init(scatterCanvas);

  chart.setOption({
    title: {
      text: "Lipid Levels vs Typical Ranges",
    },
    xAxis: {
      type: "value",
      name: "Lipid Levels",
      min: 0,
      max: 300,
    },
    yAxis: {
      type: "category",
      data: ["Cholesterol-Total", "HDL", "LDL"],
    },
    series: [
      {
        name: "Levels",
        type: "scatter",
        data: [
          [lipidProfile["Cholesterol-Total"], "Cholesterol-Total"],
          [lipidProfile["HDL"], "HDL"],
          [lipidProfile["LDL"], "LDL"],
        ],
        symbolSize: 15,
        itemStyle: {
          color: function (params) {
            const range = ranges[params.value[1]];
            const value = params.value[0];
            if (params.value[1] === "HDL") {
              if (value >= range[1]) return "#4bc0c0"; // Better
              if (value >= range[0] && value < range[1]) return "#ffce56"; // Good
              return "#ff6384"; // High Risk
            } else if (params.value[1] === "Cholesterol-Total") {
              if (value < range[0]) return "#4bc0c0"; // Good
              if (value >= range[0] && value < range[1]) return "#ffce56"; // Borderline
              return "#ff6384"; // Bad
            } else if (params.value[1] === "LDL") {
              if (value < range[0]) return "#4bc0c0"; // Good
              if (value >= range[0] && value < range[1]) return "#ffce56"; // Borderline
              return "#ff6384"; // Bad
            }
          },
        },
      },
    ],
  });

  return {
    cholesterolRange: cholesterolCanvas.toBuffer("image/png"),
    scatterPlotWithMarkers: scatterCanvas.toBuffer("image/png"),
  };
}

module.exports = createLipidProfileCharts;
