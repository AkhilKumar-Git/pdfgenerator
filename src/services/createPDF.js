const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function createPDF() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const pdfPath = "src/data/generatedPDFs/output.pdf";

    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    const charts = [
      "donutChart",
      "rangePlot",
      "speedometerChart",
      "stackedBarChart",
      "bubbleChart",
      "linearCurve",
      "pieChart",
      "cholesterolRange",
      "scatterPlotWithMarkers",
    ];

    charts.forEach((chart, index) => {
      if (index > 0) {
        doc.addPage();
      }
      doc.image(`src/data/charts/${chart}.png`, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
    });

    doc.end();

    stream.on("finish", () => {
      console.log("PDF created with charts.");
      resolve(pdfPath);
    });

    stream.on("error", (err) => {
      console.error("Error creating PDF:", err);
      reject(err);
    });
  });
}

module.exports = { createPDF };
