const { createCanvas } = require("canvas");
const echarts = require("echarts");

function createBubbleChart(data) {
  const canvas = createCanvas(800, 400);
  const chart = echarts.init(canvas);

  chart.setOption({
    title: {
      text: "Phylum Totals (Bubble Chart)",
      left: "center",
    },
    xAxis: {},
    yAxis: {},
    series: [
      {
        symbolSize: 20,
        data: Object.values(data["microbiome metrics"]["Phylum Totals"]).map(
          (value, index) => [index, value]
        ),
        type: "scatter",
      },
    ],
  });

  return canvas.toBuffer("image/png");
}

module.exports = createBubbleChart;
