const PDFDocument = require("pdfkit");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

async function createPDF(userId, chartUrls) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(chunks);
      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `users/${userId}/pdfs/${Date.now()}.pdf`,
        Body: pdfBuffer,
        ContentType: "application/pdf",
        ACL: "public-read",
      };

      try {
        const data = await s3.upload(s3Params).promise();
        console.log("PDF uploaded successfully. URL:", data.Location);
        resolve(data.Location);
      } catch (err) {
        console.error("Error uploading PDF to S3:", err);
        reject(err);
      }
    });

    for (const [chartName, chartUrl] of Object.entries(chartUrls)) {
      doc.addPage();
      doc.image(chartUrl, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
    }

    doc.end();
  });
}

module.exports = { createPDF };
