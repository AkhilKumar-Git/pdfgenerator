const xlsx = require("xlsx");
const fs = require("fs");

function excelToJson(filePath) {
  const workbook = xlsx.readFile(filePath);
  const partASheet = workbook.Sheets[workbook.SheetNames[0]];
  const partBsheet = workbook.Sheets[workbook.SheetNames[1]];

  const partA = xlsx.utils.sheet_to_json(partASheet, { header: 1 });
  const partB = xlsx.utils.sheet_to_json(partBsheet, { header: 1 });

  const processedData = {
    "patient details": {
      "Patient Name": partA[1][2],
      Age: partA[1][7],
      Gender: partA[1][6],
      "Contact Information": partA[1][3],
      Status: partA[1][4],
    },
    "microbiome metrics": {},
    "test markers": {},
    "sample data": {
      "Sample ID": partB[1][5],
      "Sample Type": partB[1][6],
      "Date of Report": partB[1][8],
      Organization: partB[1][3],
      Referral: partB[1][4],
    },
  };

  let currentCategory = null;

  for (let col = 8; col < partB[0].length; col++) {
    if (partA[0][col] !== undefined) {
      currentCategory = partA[0][col];
      processedData["microbiome metrics"][currentCategory] = {};
    }

    const metric = partA[1][col];
    const value =
      partA[2] && partA[2][col] !== undefined ? String(partA[2][col]) : "null";

    if (currentCategory) {
      processedData["microbiome metrics"][currentCategory][metric] = value;
    }
  }

  for (let i = 10; i < partB[0].length; i++) {
    const markerName = partB[0][i];
    const markerValue = partB[1][i];
    processedData["test markers"][markerName] = String(markerValue);
  }
  console.log(JSON.stringify(processedData));

  fs.writeFileSync(
    "src/data/output/data.json",
    JSON.stringify(processedData, null, 2)
  );
}

module.exports = { excelToJson };
