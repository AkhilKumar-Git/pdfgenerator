const { createCanvas } = require("canvas");
const echarts = require("echarts");

function createStackedBarChart(data) {
  const canvas = createCanvas(800, 400);
  const chart = echarts.init(canvas);

  chart.setOption({
    title: {
      text: "Test Markers (Stacked Bar Chart)",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["Marker Levels"],
    },
    xAxis: {
      type: "category",
      data: Object.keys(data["test markers"]),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Marker Levels",
        type: "bar",
        stack: "total",
        data: Object.values(data["test markers"]),
        emphasis: {
          focus: "series",
        },
      },
    ],
  });

  return canvas.toBuffer("image/png");
}

module.exports = createStackedBarChart;
