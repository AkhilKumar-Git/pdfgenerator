const express = require("express");
const serverless = require("serverless-http");
const path = require("path");
const fs = require("fs");
const { createCharts } = require("../../src/services/createGraphs");
const { createPDF } = require("../../src/services/createPDF");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, "../../public")));

// Serve JSON files from the data directory
app.use("/data", express.static(path.join(__dirname, "../../src/data")));

// Serve index.html at the root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

// Route to generate the PDF
app.get("/generate-pdf", async (req, res) => {
  try {
    // Step 1: Convert Excel data to JSON
    excelToJson(path.join(__dirname, "../../src/data/input/report.xlsx"));

    // Step 2: Create charts and save them as images
    await createCharts();

    // Step 3: Generate the PDF
    const pdfPath = await createPDF(); // Now it returns a promise

    // Check if the PDF was generated and exists
    if (fs.existsSync(pdfPath)) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=output.pdf");

      // Create a read stream and pipe it to the response
      const stream = fs.createReadStream(pdfPath);
      stream.pipe(res);

      // Handle stream events
      stream.on("end", () => {
        console.log("PDF sent successfully.");
      });

      stream.on("error", (err) => {
        console.error("Error sending PDF:", err);
        res.status(500).send("Internal Server Error");
      });
    } else {
      res.status(404).send("Generated PDF not found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports.handler = serverless(app);
