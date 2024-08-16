const { createCanvas } = require("canvas");
const echarts = require("echarts");

function createContourPlot(data) {
  const canvas = createCanvas(800, 400);
  const chart = echarts.init(canvas);

  chart.setOption({
    visualMap: {
      show: false,
      min: 0,
      max: 100,
      inRange: {
        color: [
          "#313695",
          "#4575b4",
          "#74add1",
          "#abd9e9",
          "#e0f3f8",
          "#ffffbf",
          "#fee090",
          "#fdae61",
          "#f46d43",
          "#d73027",
          "#a50026",
        ],
      },
    },
    xAxis3D: {
      type: "value",
    },
    yAxis3D: {
      type: "value",
    },
    zAxis3D: {
      type: "value",
    },
    grid3D: {
      viewControl: {
        projection: "orthographic",
      },
    },
    series: [
      {
        type: "surface",
        data: [
          [1, 2, 3],
          [2, 3, 4],
          [3, 4, 5],
          [4, 5, 6],
          [5, 6, 7],
        ],
      },
    ],
  });

  return canvas.toBuffer("image/png");
}

module.exports = createContourPlot;
