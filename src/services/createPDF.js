const PDFDocument = require("pdfkit");
const fs = require("fs");

function createPDF() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const pdfPath = "src/data/generatedPDFs/output.pdf";

    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.image("src/data/charts/normal.png", {
      fit: [500, 300],
      align: "center",
      valign: "center",
    });

    doc.addPage().image("src/data/charts/yours.png", {
      fit: [500, 300],
      align: "center",
      valign: "center",
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
