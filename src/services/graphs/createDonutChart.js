const { createCanvas } = require("canvas");
const echarts = require("echarts");

function createDonutChart(data) {
  const canvas = createCanvas(800, 400);
  const chart = echarts.init(canvas);

  chart.setOption({
    title: {
      text: "Phylum Totals (Donut Chart)",
      left: "center",
    },
    series: [
      {
        name: "Phylum Totals",
        type: "pie",
        radius: ["50%", "70%"],
        data: Object.entries(data["microbiome metrics"]["Phylum Totals"]).map(
          ([key, value]) => ({ name: key, value })
        ),
        label: {
          formatter: "{b}: {c} ({d}%)",
        },
      },
    ],
  });

  return canvas.toBuffer("image/png");
}

module.exports = createDonutChart;
