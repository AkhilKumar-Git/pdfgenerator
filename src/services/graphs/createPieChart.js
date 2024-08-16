const { createCanvas } = require("canvas");
const echarts = require("echarts");

function createPieChart(data) {
  const canvas = createCanvas(800, 400);
  const chart = echarts.init(canvas);

  chart.setOption({
    title: {
      text: "Dysbiosis Ratios (Pie Chart)",
      left: "center",
    },
    series: [
      {
        type: "pie",
        data: Object.entries(
          data["microbiome metrics"]["DYSBIOSIS RATIOS"]
        ).map(([key, value]) => ({ name: key, value })),
        label: {
          formatter: "{b}: {c} ({d}%)",
        },
      },
    ],
  });

  return canvas.toBuffer("image/png");
}

module.exports = createPieChart;
