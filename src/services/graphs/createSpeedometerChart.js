const { createCanvas } = require("canvas");
const echarts = require("echarts");

function createSpeedometerChart(data) {
  const canvas = createCanvas(800, 400);
  const chart = echarts.init(canvas);

  chart.setOption({
    series: [
      {
        type: "gauge",
        detail: { formatter: "{value}%" },
        data: [{ value: 75, name: "Health Score" }],
      },
    ],
  });

  return canvas.toBuffer("image/png");
}

module.exports = createSpeedometerChart;
