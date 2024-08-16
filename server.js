const express = require("express");
const path = require("path");
const fs = require("fs");
const { createCharts } = require("./src/services/createGraphs");
const { createPDF } = require("./src/services/createPDF");

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "src", "public")));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route to serve chart data
app.get("/chart-data", (req, res) => {
  const data = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "src", "data", "output", "data.json"),
      "utf8"
    )
  );
  res.json(data);
});

// Route to generate PDF
app.get("/generate-pdf", async (req, res) => {
  try {
    const userId = req.query.userId || "demo-user"; // In a real app, get this from authentication
    const chartUrls = await createCharts(userId);
    const pdfUrl = await createPDF(userId, chartUrls);
    res.json({ pdfUrl, chartUrls });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
