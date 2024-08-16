async function fetchChartData() {
  const response = await fetch("/chart-data");
  return response.json();
}

async function renderCharts() {
  const data = await fetchChartData();

  // Donut Chart
  const donutChart = echarts.init(document.getElementById("donutChart"));
  donutChart.setOption({
    title: { text: "Phylum Totals (Donut Chart)", left: "center" },
    series: [
      {
        name: "Phylum Totals",
        type: "pie",
        radius: ["50%", "70%"],
        data: Object.entries(data["microbiome metrics"]["Phylum Totals"]).map(
          ([key, value]) => ({ name: key, value })
        ),
        label: { formatter: "{b}: {c} ({d}%)" },
      },
    ],
  });

  // Speedometer Chart
  const speedometerChart = echarts.init(
    document.getElementById("speedometerChart")
  );
  speedometerChart.setOption({
    series: [
      {
        type: "gauge",
        detail: { formatter: "{value}%" },
        data: [{ value: 75, name: "Health Score" }],
      },
    ],
  });

  // Stacked Bar Chart
  const stackedBarChart = echarts.init(
    document.getElementById("stackedBarChart")
  );
  stackedBarChart.setOption({
    title: { text: "Test Markers (Stacked Bar Chart)", left: "center" },
    xAxis: { type: "category", data: Object.keys(data["test markers"]) },
    yAxis: { type: "value" },
    series: [
      {
        name: "Marker Levels",
        type: "bar",
        data: Object.values(data["test markers"]),
      },
    ],
  });

  // Bubble Chart
  const bubbleChart = echarts.init(document.getElementById("bubbleChart"));
  bubbleChart.setOption({
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

  // Pie Chart
  const pieChart = echarts.init(document.getElementById("pieChart"));
  pieChart.setOption({
    title: { text: "Dysbiosis Ratios (Pie Chart)", left: "center" },
    series: [
      {
        type: "pie",
        data: Object.entries(
          data["microbiome metrics"]["DYSBIOSIS RATIOS"]
        ).map(([key, value]) => ({ name: key, value })),
        label: { formatter: "{b}: {c} ({d}%)" },
      },
    ],
  });

  // Range Plot and Linear Curve using Chart.js
  const rangePlot = new Chart(document.getElementById("rangePlot"), {
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
    options: { scales: { y: { beginAtZero: true } } },
  });

  const linearCurve = new Chart(document.getElementById("linearCurve"), {
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
    options: { scales: { y: { beginAtZero: true } } },
  });

  const cholesterolRange = new Chart(
    document.getElementById("cholesterolRange"),
    {
      type: "bar",
      data: {
        labels: ["Cholesterol-Total", "HDL", "LDL"],
        datasets: [
          {
            label: "Lipid Levels",
            data: [
              data["test markers"]["Cholesterol-Total-Index-2"],
              data["test markers"]["Cholesterol-HDL Direct-Index-4"],
              data["test markers"]["LDL Cholesterol-Index-5"],
            ],
            backgroundColor: (ctx) => {
              const value = ctx.dataset.data[ctx.dataIndex];
              const label = ctx.chart.data.labels[ctx.dataIndex];
              if (label === "HDL") {
                if (value >= 60) return "rgba(75, 192, 192, 0.5)"; // Better
                if (value >= 40 && value < 60) return "rgba(255, 206, 86, 0.5)"; // Good
                return "rgba(255, 99, 132, 0.5)"; // High Risk
              } else if (label === "Cholesterol-Total") {
                if (value < 200) return "rgba(75, 192, 192, 0.5)"; // Good
                if (value >= 200 && value < 240)
                  return "rgba(255, 206, 86, 0.5)"; // Borderline
                return "rgba(255, 99, 132, 0.5)"; // Bad
              } else if (label === "LDL") {
                if (value < 100) return "rgba(75, 192, 192, 0.5)"; // Good
                if (value >= 100 && value < 160)
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
    }
  );

  const scatterPlotWithMarkers = echarts.init(
    document.getElementById("scatterPlotWithMarkers")
  );
  scatterPlotWithMarkers.setOption({
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
          [
            data["test markers"]["Cholesterol-Total-Index-2"],
            "Cholesterol-Total",
          ],
          [data["test markers"]["Cholesterol-HDL Direct-Index-4"], "HDL"],
          [data["test markers"]["LDL Cholesterol-Index-5"], "LDL"],
        ],
        symbolSize: 15,
        itemStyle: {
          color: function (params) {
            const value = params.value[0];
            if (params.value[1] === "HDL") {
              if (value >= 60) return "#4bc0c0"; // Better
              if (value >= 40 && value < 60) return "#ffce56"; // Good
              return "#ff6384"; // High Risk
            } else if (params.value[1] === "Cholesterol-Total") {
              if (value < 200) return "#4bc0c0"; // Good
              if (value >= 200 && value < 240) return "#ffce56"; // Borderline
              return "#ff6384"; // Bad
            } else if (params.value[1] === "LDL") {
              if (value < 100) return "#4bc0c0"; // Good
              if (value >= 100 && value < 160) return "#ffce56"; // Borderline
              return "#ff6384"; // Bad
            }
          },
        },
      },
    ],
  });
}

window.addEventListener("load", renderCharts);
