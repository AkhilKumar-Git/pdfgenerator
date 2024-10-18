const https = require("https");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

// The authentication key (API Key).
// Get your own by registering at https://app.pdf.co
const API_KEY =
  "akmnvn@gmail.com_4bRdcDBYaWaqSZ2BEvQ7Zau82A4LqKPKKoLhnNWLyD2lUuhYyZq3Hf5szonSJvyb";

// Source directory containing page.tsx files
const sourceDir = "./app/pages";
// Destination directory for PDF files
const destDir = "./pdf_output";

// Ensure the destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function convertPagesToPDF() {
  try {
    const files = await readdir(sourceDir);
    const pageFiles = files.filter((file) => file.endsWith("page.tsx"));

    for (const file of pageFiles) {
      const inputHtml = await readFile(path.join(sourceDir, file), "utf8");
      const destFile = path.join(destDir, `${path.parse(file).name}.pdf`);

      await convertToPDF(inputHtml, destFile);
      console.log(`Converted ${file} to PDF`);
    }
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

function convertToPDF(html, destFile) {
  return new Promise((resolve, reject) => {
    const parameters = {
      html: html,
      name: path.basename(destFile),
      margins: "5px 5px 5px 5px",
      paperSize: "Letter",
      orientation: "Portrait",
      printBackground: true,
      async: true,
    };

    const jsonPayload = JSON.stringify(parameters);

    const reqOptions = {
      host: "api.pdf.co",
      path: "/v1/pdf/convert/from/html",
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(jsonPayload, "utf8"),
      },
    };

    const postRequest = https
      .request(reqOptions, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          const parsedData = JSON.parse(data);
          if (!parsedData.error) {
            console.log(`Job #${parsedData.jobId} has been created!`);
            checkIfJobIsCompleted(
              parsedData.jobId,
              parsedData.url,
              destFile,
              resolve,
              reject
            );
          } else {
            reject(new Error(parsedData.message));
          }
        });
      })
      .on("error", (e) => {
        reject(e);
      });

    postRequest.write(jsonPayload);
    postRequest.end();
  });
}

function checkIfJobIsCompleted(
  jobId,
  resultFileUrl,
  destFile,
  resolve,
  reject
) {
  const queryPath = `/v1/job/check?jobid=${jobId}`;
  const reqOptions = {
    host: "api.pdf.co",
    path: encodeURI(queryPath),
    method: "GET",
    headers: { "x-api-key": API_KEY },
  };

  https
    .get(reqOptions, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        const parsedData = JSON.parse(data);
        console.log(
          `Checking Job #${jobId}, Status: ${
            parsedData.status
          }, Time: ${new Date().toLocaleString()}`
        );

        if (parsedData.status == "working") {
          setTimeout(
            () =>
              checkIfJobIsCompleted(
                jobId,
                resultFileUrl,
                destFile,
                resolve,
                reject
              ),
            3000
          );
        } else if (parsedData.status == "success") {
          downloadPDF(resultFileUrl, destFile, resolve, reject);
        } else {
          reject(
            new Error(`Operation ended with status: "${parsedData.status}".`)
          );
        }
      });
    })
    .on("error", (e) => {
      reject(e);
    });
}

function downloadPDF(url, destFile, resolve, reject) {
  const file = fs.createWriteStream(destFile);
  https
    .get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`Generated PDF file saved as "${destFile}".`);
        resolve();
      });
    })
    .on("error", (e) => {
      fs.unlink(destFile, () => {}); // Delete the file async. (But we don't check the result)
      reject(e);
    });
}

convertPagesToPDF();
