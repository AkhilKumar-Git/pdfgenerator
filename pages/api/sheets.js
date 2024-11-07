// pages/api/sheets.js
import { google } from "googleapis";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  console.log("API request received at /api/sheets");
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        // Replace with your credentials from the JSON file
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = "1sNM4T3d8SmliF_Lk3d9hF3RRt2xiEOvrmeJcByyHVNs";
    const range = "ResultsImportProcessed!A1:CX2";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      res.status(404).json({ message: "No data found" });
      return;
    }

    const keys = rows[0];
    const values = rows[1];

    // const data = keys
    //   .map((key, index) => ({
    //     key: key + " " + index,
    //     value: values[index] || null,
    //   }))
    //   .filter(
    //     (pair) =>
    //       pair.key !== null &&
    //       pair.key !== "" &&
    //       pair.value !== null &&
    //       pair.value !== ""
    //   );

    //CBP Import
    const CBP_grid = "CBP!A2:E22";
    const CBP = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: CBP_grid,
    });
    const CBP_metrics = CBP.data.values.map((item) => [
      item[3],
      parseFloat(item[1]),
      parseFloat(item[2]),
      item[4],
    ]);

    //RFT Import
    const RFT_grid = "RFT!A2:E11";
    const RFT = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: RFT_grid,
    });
    const RFT_metrics = RFT.data.values.map((item) => [
      item[3],
      parseFloat(item[1]),
      parseFloat(item[2]),
      item[4],
    ]);

    //LFT Import
    const LFT_grid = "LFT!A2:E13";
    const LFT = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: LFT_grid,
    });
    const LFT_metrics = LFT.data.values.map((item) => [
      item[3],
      parseFloat(item[1]),
      parseFloat(item[2]),
      item[4],
    ]);

    //Lipid Import
    const Lipid_grid = "Lipid!A2:E7";
    const Lipid = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Lipid_grid,
    });
    const Lipid_metrics = Lipid.data.values.map((item) => [
      item[3],
      parseFloat(item[1]),
      parseFloat(item[2]),
      item[4],
    ]);

    //Diabetes Import
    const Diabetes_grid = "Diabetes!A2:E3";
    const Diabetes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Diabetes_grid,
    });
    const Diabetes_metrics = Diabetes.data.values.map((item) => [
      item[3],
      parseFloat(item[1]),
      parseFloat(item[2]),
      item[4],
    ]);

    //Thyroid Import
    const Thyroid_grid = "Thyroid!A2:C4";
    const Thyroid = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Thyroid_grid,
    });
    const age = values[1];
    function getThyroidRanges(ageInYears) {
      // Convert years to a comparable number
      const age = parseFloat(ageInYears);

      // Validation
      if (isNaN(age) || age < 0 || age > 100) {
        throw new Error("Age must be a number between 0 and 100 years");
      }

      // Helper function to find ranges for any hormone type
      function findRange(ranges) {
        for (const range of ranges) {
          if (age >= range.from && age < range.to) {
            return {
              low: range.low,
              high: range.high,
            };
          }
        }
        return null;
      }

      // Define ranges for each hormone
      const t3Ranges = [
        { from: 0, to: 0.0109589041, low: 1.0, high: 7.4 },
        { from: 0.0109589041, to: 0.904109589, low: 1.05, high: 2.4 },
        { from: 0.904109589, to: 5, low: 1.05, high: 2.69 },
        { from: 5, to: 10, low: 0.94, high: 2.41 },
        { from: 10, to: 15, low: 0.82, high: 2.13 },
        { from: 15, to: 20, low: 0.8, high: 2.1 },
        { from: 20, to: 50, low: 0.7, high: 2.04 },
        { from: 50, to: 100, low: 0.4, high: 1.81 },
      ];

      const t4Ranges = [
        { from: 0, to: 0.0383561644, low: 11.8, high: 22.6 },
        { from: 0.0383561644, to: 5, low: 7.2, high: 16.6 },
        { from: 5, to: 15, low: 6.4, high: 13.3 },
        { from: 15, to: 60, low: 3.5, high: 12.6 },
        { from: 60, to: 100, low: 5.0, high: 10.7 },
      ];

      const tshRanges = [
        { from: 0, to: 0.0109589041, low: 1.0, high: 39.0 },
        { from: 0.0109589041, to: 0.5, low: 1.7, high: 9.1 },
        { from: 0.5, to: 17, low: 0.7, high: 6.4 },
        { from: 17, to: 20, low: 0.7, high: 6.4 },
        { from: 20, to: 54, low: 0.4, high: 4.5 },
        { from: 54, to: 87, low: 0.4, high: 4.5 },
      ];

      // Get ranges for each hormone
      const t3 = findRange(t3Ranges);
      const t4 = findRange(t4Ranges);
      const tsh = findRange(tshRanges);

      return {
        T3: t3,
        T4: t4,
        TSH: tsh,
      };
    }
    const thyroid_values = getThyroidRanges(age);
    const Thyroid_metrics = Thyroid.data.values.map((item) => [
      item[2],
      item[1],
    ]);

    //Vitamin Import
    const Vitamins_grid = "Vitamins!A2:E4";
    const Vitamins = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Vitamins_grid,
    });
    const Vitamins_metrics = Vitamins.data.values.map((item) => [
      item[3],
      parseFloat(item[1]),
      parseFloat(item[2]),
      item[4],
    ]);

    //Elements Import
    const Elements_grid = "Elements!A2:E8";
    const Elements = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Elements_grid,
    });
    const Elements_metrics = Elements.data.values.map((item) => [
      item[3],
      parseFloat(item[1]),
      parseFloat(item[2]),
      item[4],
    ]);

    //Urine Import
    const CUE_grid = "CUE!A2:E21";
    const CUE = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: CUE_grid,
    });
    const CUE_metrics = CUE.data.values.map((item) => [
      item[3],
      parseFloat(item[1]),
      parseFloat(item[2]),
      item[4],
    ]);

    //Snapshot Import
    const Snapshot_grid = "Snapshot!A14:C18";
    const Snapshot = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Snapshot_grid,
    });
    const colors = ["#10D3E4", "#F8F58A", "#A480B1", "#16354B", "#E9AC9C"];
    let colorIndex = 0;

    const yourPie_metrics = Snapshot.data.values.map((item) => {
      const color = colors[colorIndex % colors.length];
      colorIndex++;

      return {
        name: item[0],
        value: parseFloat(item[1]),
        color: color,
      };
    });

    colorIndex = 0;

    const normalPie_metrics = Snapshot.data.values.map((item) => {
      const color = colors[colorIndex % colors.length];
      colorIndex++;

      return {
        name: item[0],
        value: parseFloat(item[2]),
        color: color,
      };
    });

    //Biome && Health Score Import
    const Health_grid = "Snapshot!J2:K3";
    const Health = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Health_grid,
    });
    const Score_metrics = Health.data.values;

    //Microbiome Import
    const Microbiome_grid = "Microbiome!A2:D47";
    const Microbiome = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Microbiome_grid,
    });
    const Microbiome_metrics = Microbiome.data.values.map((item) => [
      parseFloat(item[1]),
      parseFloat(item[2]),
      item[3],
    ]);

    //Microbiome data Import
    const Microbiome_data_grid = "MB results!A2:BB3";
    const Microbiome_response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Microbiome_data_grid,
    });
    const MB_rows = Microbiome_response.data.values;
    if (!rows || rows.length < 2) {
      res.status(404).json({ message: "No data found" });
      return;
    }

    const MB_keys = MB_rows[0];
    const MB_values = MB_rows[1];

    const dynamicData = {
      personal_info: {
        report_type: "intro",
        name: values[0],
        age: values[1],
        gender: values[2],
        sample_types: ["Blood", "Saliva", "Urine", "Stool"],
        test_date: "Wednesday, July 31, 2024",
        report_date: "Monday, August 12, 2024",
        static: {
          heading: "INTEGRATED HEALTH ASSESSMENT",
          about: "About your raw data",
        },
      },
      CUE: CUE_metrics,
      // RFT: RFT_metrics,
      // Lipid: Lipid_metrics,
      // Thyroid: Thyroid_metrics,
      // Vitamins: Vitamins_metrics,
      // piecharts: {
      //   yours: yourPie_metrics,
      //   nomral: normalPie_metrics,
      // },
      toc: [
        "Snapshot",
        "Blood Parameters",
        "Microbiome Analysis: Intro",
        "What is Gut Microbiome",
        "Importance of gut microbiome",
        "Taxonomic Classification",
        "Microbiome Report",
        "Strains and composition",
        "Disclaimer",
        "References",
      ],
      overall_summary: {
        page_type: "snapshot",
        body_score: parseInt(Score_metrics[0][0]),
        biome_score: parseInt(Score_metrics[0][1]),
        health_snapshot_date: "15 aug 2023",
        message:
          "Your overall assessment seems ok, but would need improvement.",
        microbiome_analysis: {
          page_type: "microbiome_analysis",
          yourPie: yourPie_metrics,
          normalPie: normalPie_metrics,
          deviations: {
            Bacteroidetes: "Lower than normal",
            Firmicutes: "Higher than normal",
            "Butyricicoccus pullicaecorum": "Higher than normal",
          },
          static: {
            heading: "Microbiome Analysis",
            key: "Bacterial Phyla Key",
            note: "You are in the top 50% of the users for your Biome score.",
          },
        },
      },
      Tests: [
        {
          page_type: "blood_parameters",
          complete_blood_picture: [
            {
              name: keys[3],
              value: values[3],
              unit: CBP_metrics[0][0],
              range: [CBP_metrics[0][1], CBP_metrics[0][2]],
              rangeString: CBP_metrics[0][3],
            },
            {
              name: keys[4],
              value: values[4],
              unit: CBP_metrics[1][0],
              range: [CBP_metrics[1][1], CBP_metrics[1][2]],
              rangeString: CBP_metrics[1][3],
            },
            {
              name: keys[5],
              value: values[5],
              unit: CBP_metrics[2][0],
              range: [CBP_metrics[2][1], CBP_metrics[2][2]],
              rangeString: CBP_metrics[2][3],
            },
            {
              name: keys[6],
              value: values[6],
              unit: CBP_metrics[3][0],
              range: [CBP_metrics[3][1], CBP_metrics[3][2]],
              rangeString: CBP_metrics[3][3],
            },
            {
              name: keys[7],
              value: values[7],
              unit: CBP_metrics[4][0],
              range: [CBP_metrics[4][1], CBP_metrics[4][2]],
              rangeString: CBP_metrics[4][3],
            },
            {
              name: keys[8],
              value: values[8],
              unit: CBP_metrics[5][0],
              range: [CBP_metrics[5][1], CBP_metrics[5][2]],
              rangeString: CBP_metrics[5][3],
            },
            {
              name: keys[9],
              value: values[9],
              unit: CBP_metrics[6][0],
              range: [CBP_metrics[6][1], CBP_metrics[6][2]],
              rangeString: CBP_metrics[6][3],
            },
            {
              name: keys[10],
              value: values[10],
              unit: CBP_metrics[7][0],
              range: [CBP_metrics[7][1], CBP_metrics[7][2]],
              rangeString: CBP_metrics[7][3],
            },
            {
              name: keys[11],
              value: values[11],
              unit: CBP_metrics[8][0],
              range: [CBP_metrics[8][1], CBP_metrics[8][2]],
              rangeString: CBP_metrics[8][3],
            },
            {
              name: keys[12],
              value: values[12],
              unit: "%",
              range: [CBP_metrics[9][1], CBP_metrics[9][2]],
              rangeString: CBP_metrics[9][3],
            },
            {
              name: keys[13],
              value: values[13],
              unit: "%",
              range: [CBP_metrics[10][1], CBP_metrics[10][2]],
              rangeString: CBP_metrics[10][3],
            },
            {
              name: keys[14],
              value: values[14],
              unit: "%",
              range: [CBP_metrics[11][1], CBP_metrics[11][2]],
              rangeString: CBP_metrics[11][3],
            },
            {
              name: keys[15],
              value: values[15],
              unit: "%",
              range: [CBP_metrics[12][1], CBP_metrics[12][2]],
              rangeString: CBP_metrics[12][3],
            },
            {
              name: keys[16],
              value: values[16],
              unit: "%",
              range: [CBP_metrics[13][1], CBP_metrics[13][2]],
              rangeString: CBP_metrics[13][3],
            },
          ],
          peripheral_smear: [
            { name: keys[17], value: values[17] },
            { name: keys[18], value: values[18] },
            { name: keys[19], value: values[19] },
            { name: keys[20], value: values[20] },
            { name: keys[21], value: values[21] },
          ],
          blood_group: [
            { name: keys[22], value: values[22] },
            { name: keys[23], value: values[23] },
          ],
          static: {
            heading: "Blood Parameters",
            why_test_is_important: "Why is this test important?",
          },
        },
        {
          page_type: "blood_parameters",
          renal_function_tests: [
            {
              name: keys[25],
              value: values[25],
              unit: RFT_metrics[0][0],
              range: [RFT_metrics[0][1], RFT_metrics[0][2]],
              rangeString: RFT_metrics[0][3],
            },
            {
              name: keys[26],
              value: values[26],
              unit: RFT_metrics[1][0],
              range: [RFT_metrics[1][1], RFT_metrics[1][2]],
              rangeString: RFT_metrics[1][3],
            },
            {
              name: keys[27],
              value: values[27],
              unit: RFT_metrics[2][0],
              range: [RFT_metrics[2][1], RFT_metrics[2][2]],
              rangeString: RFT_metrics[2][3],
            },
            {
              name: keys[28],
              value: values[28],
              unit: RFT_metrics[3][0],
              range: [RFT_metrics[3][1], RFT_metrics[3][2]],
              rangeString: RFT_metrics[3][3],
            },
            {
              name: keys[29],
              value: values[29],
              unit: "",
              range: [RFT_metrics[4][1], RFT_metrics[4][2]],
              rangeString: RFT_metrics[4][3],
            },
            {
              name: keys[30],
              value: values[30],
              unit: "",
              range: [RFT_metrics[5][1], RFT_metrics[5][2]],
              rangeString: RFT_metrics[5][3],
            },
            {
              name: keys[31],
              value: values[31],
              unit: RFT_metrics[6][0],
              range: [RFT_metrics[6][1], RFT_metrics[6][2]],
              rangeString: RFT_metrics[6][3],
            },
            {
              name: keys[32],
              value: values[32],
              unit: RFT_metrics[7][0],
              range: [RFT_metrics[7][1], RFT_metrics[7][2]],
              rangeString: RFT_metrics[7][3],
            },
            {
              name: keys[33],
              value: values[33],
              unit: RFT_metrics[8][0],
              range: [RFT_metrics[8][1], RFT_metrics[8][2]],
              rangeString: RFT_metrics[8][3],
            },
            {
              name: keys[34],
              value: values[34],
              unit: RFT_metrics[9][0],
              range: [RFT_metrics[9][1], RFT_metrics[9][2]],
              rangeString: RFT_metrics[9][3],
            },
          ],
          static: {
            heading: "Renal (Kidney) Function Tests",
            why_test_is_important: `
            <div className="mt-6 break-inside-avoid">
              
             <p >
              The Kidney Function Test Panel, also known as the Basic Metabolic Panel
              (BMP), provides crucial information about the health and functionality of
              the kidneys and the body&apos;s overall metabolic state. This panel of tests
              helps doctors assess kidney function, fluid and electrolyte balance, and
              certain aspects of metabolism. Here&apos;s why each test in the panel is
              important:
              </p>
            <ol >
              <li>
                Blood Urea Nitrogen (BUN): BUN levels indicate how well the kidneys are
                filtering waste products from the blood. Elevated levels can suggest
                kidney dysfunction or dehydration.
              </li>
              <li>
                Creatinine: Creatinine levels reflect how effectively the kidneys are
                filtering waste from the bloodstream. Elevated levels may signal impaired
                kidney function.
              </li>
              <li>
                Urea Creatinine Ratio: This ratio helps evaluate the balance between urea
                and creatinine. Abnormal values might indicate issues with kidney function
                or hydration status.
              </li>
              <li>
                BUN Creatinine Ratio: This ratio provides additional insight into kidney
                function, helping differentiate between different causes of kidney issues.
              </li>
              <li>
                Uric Acid: Uric acid levels can impact kidney health, and elevated levels
                might indicate gout or other kidney-related conditions.
              </li>
              <li>
                Calcium: Calcium is important for various bodily functions, including
                kidney function and bone health. Abnormal calcium levels can indicate
                kidney dysfunction.
              </li>
              <li>
                Sodium, Potassium, Chloride: These electrolytes are essential for
                maintaining fluid balance, nerve function, and overall health. Imbalances
                can indicate kidney problems or other issues.
              </li>
            </ol>
            <p">
              Together, these tests help healthcare professionals assess kidney health,
              hydration status, and the body's ability to maintain a proper balance of
              electrolytes. The results aid in diagnosing conditions like kidney disease,
              dehydration, electrolyte imbalances, and certain metabolic disorders.
              Interpretation of the panel, along with the patient's medical history and
              other clinical factors, guides medical decisions and treatment plans.
            </p>

            <p>
              <i>
                Note: The blood parameters testing is powered by our testing facility:
                Previa Labs.
              </i>
            </p>
          </div>
`,
          },
        },
        {
          page_type: "blood_parameters",
          liver_function_tests: [
            {
              name: keys[36],
              value: values[36],
              unit: LFT_metrics[0][0],
              range: [LFT_metrics[0][1], LFT_metrics[0][2]],
              rangeString: LFT_metrics[0][3],
            },
            {
              name: keys[37],
              value: values[37],
              unit: LFT_metrics[1][0],
              range: [LFT_metrics[1][1], LFT_metrics[1][2]],
              rangeString: LFT_metrics[1][3],
            },
            {
              name: keys[38],
              value: values[38],
              unit: LFT_metrics[2][0],
              range: [LFT_metrics[2][1], LFT_metrics[2][2]],
              rangeString: LFT_metrics[2][3],
            },
            {
              name: keys[39],
              value: values[39],
              unit: LFT_metrics[3][0],
              range: [LFT_metrics[3][1], LFT_metrics[3][2]],
              rangeString: LFT_metrics[3][3],
            },
            {
              name: keys[40],
              value: values[40],
              unit: LFT_metrics[4][0],
              range: [LFT_metrics[4][1], LFT_metrics[4][2]],
              rangeString: LFT_metrics[4][3],
            },
            {
              name: keys[41],
              value: values[41],
              unit: LFT_metrics[5][0],
              range: [LFT_metrics[5][1], LFT_metrics[5][2]],
              rangeString: LFT_metrics[5][3],
            },
            {
              name: keys[42],
              value: values[42],
              unit: LFT_metrics[6][0],
              range: [LFT_metrics[6][1], LFT_metrics[6][2]],
              rangeString: LFT_metrics[6][3],
            },
            {
              name: keys[43],
              value: values[43],
              unit: LFT_metrics[7][0],
              range: [LFT_metrics[7][1], LFT_metrics[7][2]],
              rangeString: LFT_metrics[7][3],
            },
            {
              name: keys[44],
              value: values[44],
              unit: LFT_metrics[8][0],
              range: [LFT_metrics[8][1], LFT_metrics[8][2]],
              rangeString: LFT_metrics[8][3],
            },
            {
              name: keys[45],
              value: values[45],
              unit: LFT_metrics[9][0],
              range: [LFT_metrics[9][1], LFT_metrics[9][2]],
              rangeString: LFT_metrics[9][3],
            },
            {
              name: keys[46],
              value: values[46],
              unit: LFT_metrics[10][0],
              range: [LFT_metrics[10][1], LFT_metrics[10][2]],
              rangeString: LFT_metrics[10][3],
            },
            {
              name: keys[47],
              value: values[47],
              unit: LFT_metrics[11][0],
              range: [LFT_metrics[11][1], LFT_metrics[11][2]],
              rangeString: LFT_metrics[11][3],
            },
          ],
          static: {
            heading: "Liver Function Tests",
            why_test_is_important: `
            <div className="mt-6 break-inside-avoid">
              <p className="text-[10px] text-gray-500">
                The Liver Function Test (LFT) or Hepatic Panel is a group of blood tests
                that provide insights into the health and functioning of the liver. These
                tests collectively assess various aspects of liver function, enzymes, and
                protein levels. <br/>Here's why each test in the panel is important when
                considered together:
              </p>
              <ul className="list-disc list-inside text-[10px] text-gray-500">
                <li>
                  Bilirubin - Total, Direct, and Indirect: Bilirubin is a waste product from
                  the breakdown of hemoglobin. Elevated levels might suggest liver
                  dysfunction or other health conditions.
                </li>
                <li>
                  Aspartate Aminotransferase (AST/SGOT) and Alanine Transaminase (ALT/SGPT):
                  These enzymes are released when liver cells are damaged. Elevated levels
                  can indicate liver injury or disease.
                </li>
                <li>
                  SGOT/SGPT: This ratio can provide additional insights into liver health,
                  aiding in diagnosing certain liver disorders.
                </li>
                <li>
                  GGT-Gamma-glutamyl transpeptidase: GGT levels can indicate liver or bile
                  duct issues, alcohol consumption, or certain medications' effects on the
                  liver.
                </li>
                <li>
                  Alkaline Phosphatase-ALPI: Alkaline phosphatase levels can help diagnose
                  liver or bone disorders. Elevated levels might indicate liver or bone
                  issues.
                </li>
                <li>
                  Total Protein, Albumin, and Globulin: These assess overall protein levels
                  and liver's ability to produce proteins. Abnormal levels can point to
                  liver or kidney problems.
                </li>
                <li>
                  A/G Ratio: The ratio of albumin to globulin helps assess liver and immune
                  system health. Imbalances might indicate various health conditions.
                </li>
              </ul>
              <p className="text-[10px] text-gray-500 mb-10">
                Collectively, the LFT panel aids in diagnosing liver diseases, assessing
                liver function, and monitoring treatment effectiveness. It's crucial for
                detecting liver inflammation, damage, or dysfunction. Interpretation of the
                panel, combined with clinical context, guides medical decisions and
                treatment plans.
              </p>
              <br/>
              <br/>
              <p className="text-[10px] text-gray-500">
                <i>
                  Note: The blood parameters testing is powered by our testing facility:
                  Previa Labs.
                </i>
              </p>
            </div>
`,
          },
        },
        {
          page_type: "blood_parameters",
          lipid_profile: [
            {
              name: keys[49],
              value: values[49],
              unit: Lipid_metrics[0][0],
              range: [Lipid_metrics[0][1], Lipid_metrics[0][2]],
              rangeString: Lipid_metrics[0][3],
            },
            {
              name: keys[50],
              value: values[50],
              unit: Lipid_metrics[1][0],
              range: [Lipid_metrics[1][1], Lipid_metrics[1][2]],
              rangeString: Lipid_metrics[1][3],
            },
            {
              name: keys[51],
              value: values[51],
              unit: Lipid_metrics[2][0],
              range: [Lipid_metrics[2][1], Lipid_metrics[2][2]],
              rangeString: Lipid_metrics[2][3],
            },
            {
              name: keys[52],
              value: values[52],
              unit: Lipid_metrics[3][0],
              range: [Lipid_metrics[3][1], Lipid_metrics[3][2]],
              rangeString: Lipid_metrics[3][3],
            },
            {
              name: keys[53],
              value: values[53],
              unit: Lipid_metrics[4][0],
              range: [Lipid_metrics[4][1], Lipid_metrics[4][2]],
              rangeString: Lipid_metrics[4][3],
            },
            {
              name: keys[54],
              value: values[54],
              unit: Lipid_metrics[5][0],
              range: [Lipid_metrics[5][1], Lipid_metrics[5][2]],
              rangeString: Lipid_metrics[5][3],
            },
          ],

          static: {
            heading: "Lipid Profile",
            why_test_is_important: `
            <div className="mt-6 break-inside-avoid">
              <p className="text-[10px] text-gray-500">
                The Lipid Profile is a group of blood tests that assess different types of
                cholesterol and triglycerides in the blood. These tests collectively provide
                insights into a person's lipid levels, which are crucial for heart health
                and cardiovascular disease risk assessment.
                <vr></vr>
                Here's why these tests, when considered together, are important:
              </p>
              <ul className="list-disc list-inside text-[10px] text-gray-500">
                <li>
                  Cholesterol-Total: Total cholesterol levels help assess overall
                  cholesterol in the blood. Elevated levels might indicate an increased risk
                  of heart disease.
                </li>
                <li>
                  Cholesterol-HDL Direct: HDL cholesterol is considered "good" cholesterol
                  that helps remove excess cholesterol from the bloodstream. Low levels can
                  be associated with an increased risk of heart disease.
                </li>
                <li>
                  LDL Cholesterol: LDL cholesterol is often referred to as "bad"
                  cholesterol. Elevated levels might lead to the accumulation of cholesterol
                  in arteries, increasing heart disease risk.
                </li>
                <li>
                  LDL Cholesterol: LDL cholesterol is often referred to as "bad"
                  cholesterol. Elevated levels might lead to the accumulation of cholesterol
                  in arteries, increasing heart disease risk.
                </li>
                <li>
                  Non - HDL Cholesterol, Serum: Non-HDL cholesterol includes all forms of
                  cholesterol except HDL. It's considered a better predictor of heart
                  disease risk than total cholesterol alone.
                </li>
                <li>
                  VLDL Cholesterol: VLDL cholesterol is a type of lipoprotein that carries
                  triglycerides. Elevated levels can contribute to heart disease risk.
                </li>
              </ul>
              <p className="text-[10px] text-gray-500 mb-10">
                Collectively, the Lipid Profile provides valuable information about an
                individual's risk for heart disease and cardiovascular issues.
                Interpretation of these lipid levels, combined with other risk factors and
                clinical context, guides medical decisions for preventing or managing heart
                disease.
              </p>
              <br />
              <br />
              <p className="text-[10px] text-gray-500">
                <i>
                  Note: The blood parameters testing is powered by our testing facility:
                  Previa Labs.
                </i>
              </p>
            </div>
`,
          },
        },
        {
          page_type: "blood_parameters",
          metrics: [
            {
              name: keys[93],
              value: values[93],
              unit: Diabetes_metrics[0][0],
              range: [Diabetes_metrics[0][1], Diabetes_metrics[0][2]],
              rangeString: Diabetes_metrics[0][3],
            },
            {
              name: keys[94],
              value: values[94],
              unit: Diabetes_metrics[1][0],
              range: [Diabetes_metrics[1][1], Diabetes_metrics[1][2]],
              rangeString: Diabetes_metrics[1][3],
            },
          ],
          static: {
            heading: "Blood Sugar Indicators",
            why_test_is_important: `
            <div className="mt-6 break-inside-avoid">
              <p className="text-[10px] text-gray-500">
                The Diabetes Profile, consisting of Fasting Blood Glucose and HbA1c tests,
                plays a crucial role in assessing and managing diabetes. These tests provide
                key insights into blood sugar control and long-term glycemic management.

                <br />
                Here's why this profile is important:
              </p>
              <ul className="list-disc list-inside text-[10px] text-gray-500">
                <li>
                  Fasting Blood Glucose: This test measures the blood glucose level after an
                  overnight fast. Abnormal levels can indicate impaired fasting glucose or
                  diabetes, helping in early detection and monitoring of blood sugar
                  control.
                </li>
                <li>
                  HbA1c (Glycated Hemoglobin): HbA1c reflects the average blood glucose
                  levels over the past few months. It's a vital indicator of long-term
                  glycemic control and diabetes management.
                </li>
              </ul>
              <p className="text-[10px] text-gray-500 mb-10">
                Collectively, the Diabetes Profile aids healthcare professionals in
                assessing blood sugar levels, evaluating glycemic control, and making
                informed decisions regarding diabetes management. Regular monitoring of
                fasting blood glucose and HbA1c allows for timely adjustments in treatment
                plans, lifestyle modifications, and interventions to achieve and maintain
                optimal blood sugar levels. By keeping blood sugar within the target range,
                individuals with diabetes can reduce the risk of complications and improve
                their overall quality of life.
              </p>
            </div>`,
          },
        },
        {
          page_type: "blood_parameters",
          metrics: [
            {
              name: keys[56],
              value: values[56],
              unit: Thyroid_metrics[0][0],
              range: [thyroid_values.T3.low, thyroid_values.T3.high],
              rangeString: Thyroid_metrics[0][1],
            },
            {
              name: keys[57],
              value: values[57],
              unit: Thyroid_metrics[1][0],
              range: [thyroid_values.T4.low, thyroid_values.T4.high],
              rangeString: Thyroid_metrics[1][1],
            },
            {
              name: keys[58],
              value: values[58],
              unit: Thyroid_metrics[2][0],
              range: [thyroid_values.TSH.low, thyroid_values.TSH.high],
              rangeString: Thyroid_metrics[2][1],
            },
          ],
          static: {
            heading: "Thyroid Profile",
            why_test_is_important: `
            <div className="mt-6 break-inside-avoid">
              <p className="text-[10px] text-gray-500">
                The Thyroid Function Test panel includes three essential tests that assess
                the health and functioning of the thyroid gland. The thyroid plays a crucial
                role in regulating metabolism, energy production, and hormone balance. These
                tests provide valuable information about thyroid hormone levels and help
                diagnose various thyroid-related conditions.

                <br />
                Here's why these tests, when considered together, are important:
              </p>
              <ul className="list-disc list-inside text-[10px] text-gray-500">
                <li>
                  T3 (TRI-IODOTHYRONINE): T3 is a key thyroid hormone that influences
                  metabolism and growth. Different age groups and stages of life have
                  specific reference ranges, helping to identify thyroid dysfunction and
                  guide treatment.
                </li>
                <li>
                  T4 (THYROXINE): T4 is another vital thyroid hormone responsible for
                  regulating metabolism. Its levels vary based on age, and deviations can
                  indicate thyroid disorders.
                </li>
                <li>
                  TSH (THYROID STIMULATING HORMONE): TSH is produced by the pituitary gland
                  and stimulates the thyroid to produce hormones. Elevated TSH might
                  indicate an underactive thyroid (hypothyroidism), while low TSH could
                  suggest an overactive thyroid (hyperthyroidism).
                </li>
              </ul>
              <p className="text-[10px] text-gray-500 mb-10">
                Collectively, the Thyroid Function Test panel provides a comprehensive
                assessment of thyroid health. Interpretation of these values, combined with
                clinical context, guides medical decisions for diagnosing and managing
                thyroid disorders. Proper thyroid function is essential for maintaining
                overall health, energy levels, and metabolism.
              </p>
              <br />
              <br />
              <p className="text-[10px] text-gray-500">
                <i>
                  Note: The blood parameters testing is powered by our testing facility:
                  Previa Labs.
                </i>
              </p>
            </div>`,
          },
        },
        {
          page_type: "blood_parameters",
          metrics: [
            {
              name: keys[89],
              value: values[89],
              unit: Vitamins_metrics[0][0],
              range: [Vitamins_metrics[0][1], Vitamins_metrics[0][2]],
              rangeString: Vitamins_metrics[0][3],
            },
            {
              name: keys[90],
              value: values[90],
              unit: Vitamins_metrics[1][0],
              range: [Vitamins_metrics[1][1], Vitamins_metrics[1][2]],
              rangeString: Vitamins_metrics[1][3],
            },
          ],
          static: {
            heading: "Vitamin Profile",
            why_test_is_important: `
            <div className="mt-6 break-inside-avoid">
            <p className="text-[10px] text-gray-500">
              The panel of tests consisting of Vitamin B12, Vitamin C, and Vitamin D plays
              a crucial role in assessing and monitoring the status of essential vitamins
              in the body. Collectively, these tests provide insights into nutritional
              health, bone health, and immune function. Here's why this panel is
              important:
            </p>
            <ul className="list-disc list-inside text-[10px] text-gray-500">
              <li>
                Vitamin B12: Vitamin B12 is essential for red blood cell formation,
                neurological function, and DNA synthesis. Low B12 levels can lead to
                anemia, nerve damage, and other health issues. Monitoring B12 levels is
                crucial for diagnosing deficiencies and guiding supplementation.
              </li>
              <li>
                Vitamin C: Also known as ascorbic acid, Vitamin C is an antioxidant that
                supports immune function, skin health, and wound healing. Adequate Vitamin
                C intake is essential to prevent scurvy and maintain overall health.
              </li>
              <li>
                Vitamin D: Vitamin D is vital for calcium absorption, bone health, and
                immune system function. Low Vitamin D levels can lead to conditions like
                rickets and osteomalacia. Monitoring Vitamin D levels is important for
                assessing deficiency, guiding replacement therapy, and preventing
                bone-related disorders.
              </li>
            </ul>
            <ul className="list-disc list-inside text-[10px] text-gray-500">
              Interpretation of Vitamin D: Vitamin D testing is useful for various
              purposes, including:
              <li>
                Diagnosis of Vitamin D Deficiency: Low Vitamin D levels can indicate a
                deficiency, which is associated with various health issues.
              </li>
              <li>
                Differential Diagnosis of Causes of Rickets and Osteomalacia: Vitamin D
                plays a key role in bone health, and its deficiency can lead to conditions
                like rickets and osteomalacia. Testing helps in identifying the underlying
                cause.
              </li>
              <li>
                Monitoring Vitamin D Replacement Therapy: For individuals receiving
                Vitamin D supplementation, regular monitoring ensures that levels are
                within the target range.
              </li>
              <li>
                Diagnosis of Hypervitaminosis D: Excessive Vitamin D intake can lead to
                hypervitaminosis D, which can have adverse effects. Testing helps in
                identifying this condition.
              </li>
            </ul>
            <p className="text-[10px] text-gray-500 mb-10">
              It's important to note that Vitamin D levels can vary based on several
              factors, including geography, season, diet, age, and supplementation.
              Additionally, certain substances in the patient's sample may interfere with
              immunoassays, so results should be evaluated carefully. Healthcare providers
              use these results to guide dietary recommendations, supplementation, and
              treatments tailored to individual needs.
            </p>
          </div>`,
          },
        },
        {
          page_type: "blood_parameters",
          metrics: [
            {
              name: keys[60],
              value: values[60],
              unit: Elements_metrics[0][0],
              range: [Elements_metrics[0][1], Elements_metrics[0][2]],
              rangeString: Elements_metrics[0][3],
            },
            {
              name: keys[61],
              value: values[61],
              unit: Elements_metrics[1][0],
              range: [Elements_metrics[1][1], Elements_metrics[1][2]],
              rangeString: Elements_metrics[1][3],
            },
            {
              name: keys[62],
              value: values[62],
              unit: Elements_metrics[2][0],
              range: [Elements_metrics[2][1], Elements_metrics[2][2]],
              rangeString: Elements_metrics[2][3],
            },
            {
              name: keys[63],
              value: values[63],
              unit: Elements_metrics[3][0],
              range: [Elements_metrics[3][1], Elements_metrics[3][2]],
              rangeString: Elements_metrics[3][3],
            },
            {
              name: keys[64],
              value: values[64],
              unit: Elements_metrics[4][0],
              range: [Elements_metrics[4][1], Elements_metrics[4][2]],
              rangeString: Elements_metrics[4][3],
            },
            {
              name: keys[65],
              value: values[65],
              unit: Elements_metrics[5][0],
              range: [Elements_metrics[5][1], Elements_metrics[5][2]],
              rangeString: Elements_metrics[5][3],
            },
            {
              name: keys[66],
              value: values[66],
              unit: Elements_metrics[6][0],
              range: [Elements_metrics[6][1], Elements_metrics[6][2]],
              rangeString: Elements_metrics[6][3],
            },
          ],
          static: {
            heading: "Others",
            why_test_is_important: `
            <div className="mt-6 break-inside-avoid">
              <p className="text-[10px] text-gray-500">
                The panel of tests consisting of Calcium, Phosphorus, Iron, UIBC
                (Unsaturated Iron Binding Capacity), TIBC (Total Iron Binding Capacity),
                Transferrin, and Transferrin Saturation plays a crucial role in assessing
                various aspects of mineral and iron metabolism in the body. When considered
                collectively, these tests provide insights into bone health, mineral
                balance, and iron status. Here's why this panel is important:
              </p>
              <ul className="list-disc list-inside text-[10px] text-gray-500">
                <li>
                  Calcium: Calcium is essential for bone health, muscle function, nerve
                  transmission, and blood clotting. Abnormal calcium levels can indicate
                  issues such as bone disorders, kidney problems, or hormone imbalances.
                </li>
                <li>
                  Phosphorus: Phosphorus is vital for bone and teeth health, energy
                  production, and cellular function. Abnormal levels can be associated with
                  kidney disorders, bone diseases, and hormonal imbalances.
                </li>
                <li>
                  Iron, UIBC, TIBC, Transferrin, Transferrin Saturation: These tests
                  collectively assess iron levels and its transport within the body. Iron is
                  crucial for the formation of red blood cells and oxygen transport. Low
                  iron levels can lead to iron deficiency anemia, while high levels can
                  indicate iron overload conditions like hemochromatosis. The UIBC, TIBC,
                  Transferrin, and Transferrin Saturation values help evaluate the body's
                  iron-binding capacity, the total iron capacity, and the percentage of
                  transferrin bound to iron.
                </li>
              </ul>
              <ul className="list-disc list-inside text-[10px] text-gray-500">
                The interpretation of these tests is crucial for diagnosing and managing
                various conditions:
                <li>
                  Iron Deficiency: Low iron levels, high TIBC, high UIBC, and low
                  transferrin saturation indicate iron deficiency anemia. Ferritin levels
                  are also typically low in this condition.
                </li>
                <li>
                  Hemochromatosis: High iron levels, low TIBC, low UIBC, and high
                  transferrin saturation indicate hemochromatosis, a condition of iron
                  overload. Ferritin levels are also elevated.
                </li>
                <li>
                  Chronic Illness: In chronic illnesses, iron levels might be low, along
                  with low TIBC and UIBC. Transferrin saturation could be low or normal, and
                  ferritin levels can vary.
                </li>
                <li>
                  Hemolytic Anemia: High iron levels, normal or low TIBC and UIBC, and high
                  transferrin saturation can indicate hemolytic anemia. Ferritin levels are
                  also typically high.
                </li>
              </ul>
              <p className="text-[10px] text-gray-500 mb-10">
                Together, these tests provide a comprehensive overview of mineral
                metabolism, bone health, and iron status. They aid healthcare professionals
                in diagnosing conditions such as anemia, bone disorders, iron deficiency,
                and iron overload. The interpretation of the results guides medical
                decisions, enabling healthcare providers to tailor treatments, dietary
                adjustments, and interventions to ensure optimal mineral and iron balance in
                the body.
              </p>
              <br />
              <br />
              <p className="text-[10px] text-gray-500">
                <i>
                  Note: The blood parameters testing is powered by our testing facility:
                  Previa Labs.
                </i>
              </p>
            </div>`,
          },
        },
        {
          page_type: "urine_examination",
          metrics: [
            {
              name: keys[68],
              value: values[68],
              unit: CUE_metrics[0][0],
              range: [],
              rangeString: CUE_metrics[0][3],
            },
            {
              name: keys[69],
              value: values[69],
              unit: CUE_metrics[1][0],
              range: [],
              rangeString: CUE_metrics[1][3],
            },
            {
              name: keys[70],
              value: values[70],
              unit: CUE_metrics[2][0],
              range: [],
              rangeString: CUE_metrics[2][3],
            },
            {
              name: keys[71],
              value: values[71],
              unit: CUE_metrics[3][0],
              range: [CUE_metrics[3][1], CUE_metrics[3][2]],
              rangeString: CUE_metrics[3][3],
            },
            {
              name: keys[72],
              value: values[72],
              unit: CUE_metrics[4][0],
              range: [CUE_metrics[4][1], CUE_metrics[4][2]],
              rangeString: CUE_metrics[4][3],
            },
            {
              name: keys[73],
              value: values[73],
              unit: CUE_metrics[5][0],
              range: [],
              rangeString: CUE_metrics[5][3],
            },
            {
              name: keys[74],
              value: values[74],
              unit: CUE_metrics[6][0],
              range: [],
              rangeString: CUE_metrics[6][3],
            },
            {
              name: keys[75],
              value: values[75],
              unit: CUE_metrics[7][0],
              range: [],
              rangeString: CUE_metrics[7][3],
            },
            {
              name: keys[76],
              value: values[76],
              unit: CUE_metrics[8][0],
              range: [],
              rangeString: CUE_metrics[8][3],
            },
            {
              name: keys[77],
              value: values[77],
              unit: CUE_metrics[9][0],
              range: [],
              rangeString: CUE_metrics[9][3],
            },
            {
              name: keys[78],
              value: values[78],
              unit: CUE_metrics[10][0],
              range: [],
              rangeString: CUE_metrics[10][3],
            },
            {
              name: keys[79],
              value: values[79],
              unit: CUE_metrics[11][0],
              range: [],
              rangeString: CUE_metrics[11][3],
            },
            {
              name: keys[80],
              value: values[80],
              unit: CUE_metrics[12][0],
              range: [CUE_metrics[12][1], CUE_metrics[12][2]],
              rangeString: CUE_metrics[12][3],
            },
            {
              name: keys[81],
              value: values[81],
              unit: CUE_metrics[13][0],
              range: [CUE_metrics[13][1], CUE_metrics[13][2]],
              rangeString: CUE_metrics[13][3],
            },
            {
              name: keys[82],
              value: values[82],
              unit: CUE_metrics[14][0],
              range: [],
              rangeString: CUE_metrics[14][3],
            },
            {
              name: keys[83],
              value: values[83],
              unit: CUE_metrics[15][0],
              range: [],
              rangeString: CUE_metrics[15][3],
            },
            {
              name: keys[84],
              value: values[84],
              unit: CUE_metrics[16][0],
              range: [],
              rangeString: CUE_metrics[16][3],
            },
            {
              name: keys[85],
              value: values[85],
              unit: CUE_metrics[17][0],
              range: [],
              rangeString: CUE_metrics[17][3],
            },
            {
              name: keys[86],
              value: values[86],
              unit: CUE_metrics[18][0],
              range: [],
              rangeString: CUE_metrics[18][3],
            },
            {
              name: keys[87],
              value: values[87],
              unit: CUE_metrics[19][0],
              range: [],
              rangeString: CUE_metrics[19][3],
            },
          ],
          static: {
            heading: "Urine Examination",
            why_test_is_important: `
            <div className="mt-6 break-inside-avoid">
              <p className="text-[10px] text-gray-500">
                The Complete Urine Examination (CUE) panel is a set of tests that provide
                valuable insights into the health of the urinary system and overall
                well-being. Collectively, these tests assess various aspects of urine
                composition, including physical properties, chemical content, and
                microscopic elements. Here's why this panel is important:
              </p>
              <br />
              <ul className="list-disc list-inside text-[10px] text-gray-500">
                <li>
                  Physical Properties: Assessment of urine volume, colour, transparency, and
                  pH helps identify potential issues such as dehydration, kidney function,
                  and urinary tract infections. Specific Gravity: Specific gravity reflects
                  the concentration of solutes in urine, offering insights into hydration
                  levels and kidney function.
                </li>
                <li>
                  Chemical Examination: Tests for protein, glucose, blood, ketones, bile
                  pigments, and bile salts detect abnormal substances that could indicate
                  kidney dysfunction, diabetes, liver problems, or other conditions..
                </li>
                <li>
                  Urobilinogen: Urobilinogen levels can provide information about liver
                  function and red blood cell breakdown.
                </li>
                <li>
                  Microscopic Examination: Examination of cells, crystals, casts, bacteria,
                  and other elements helps diagnose urinary tract infections, kidney
                  disorders, and other abnormalities.
                </li>
              </ul>

              <p className="text-[10px] text-gray-500 mb-10">
                When considered collectively, the Complete Urine Examination (CUE) panel
                provides a comprehensive assessment of urinary health, aiding in the
                diagnosis and monitoring of various conditions affecting the urinary system.
                These tests enable healthcare professionals to identify early signs of
                kidney dysfunction, urinary tract infections, and other underlying health
                issues, allowing for timely intervention and appropriate treatment.
                <br />
                For a thorough understanding of your urine test results and their
                implications for your health, it's recommended to consult a healthcare
                provider. They can provide personalized guidance based on your specific
                health needs and circumstances.
              </p>
              <br />
              <br />
              <p className="text-[10px] text-gray-500">
                <i>
                  Note: The blood parameters testing is powered by our testing facility:
                  Previa Labs.
                </i>
              </p>
            </div>`,
          },
        },
        {
          page_type: "microbiome",
          yourPie: yourPie_metrics,
          normalPie: normalPie_metrics,
          metrics: [
            {
              name: MB_keys[8],
              value: MB_values[8],
              unit: "%",
              range: [Microbiome_metrics[0][0], Microbiome_metrics[0][1]],
              rangeString: Microbiome_metrics[0][2],
            },
            {
              name: MB_keys[9],
              value: MB_values[9],
              unit: "%",
              range: [Microbiome_metrics[1][0], Microbiome_metrics[1][1]],
              rangeString: Microbiome_metrics[1][2],
            },
            {
              name: MB_keys[10],
              value: MB_values[10],
              unit: "%",
              range: [Microbiome_metrics[2][0], Microbiome_metrics[2][1]],
              rangeString: Microbiome_metrics[2][2],
            },
            {
              name: MB_keys[11],
              value: MB_values[11],
              unit: "%",
              range: [Microbiome_metrics[3][0], Microbiome_metrics[3][1]],
              rangeString: Microbiome_metrics[3][2],
            },
            {
              name: MB_keys[12],
              value: MB_values[12],
              unit: "%",
              range: [Microbiome_metrics[4][0], Microbiome_metrics[4][1]],
              rangeString: Microbiome_metrics[4][2],
            },
            {
              name: MB_keys[13],
              value: MB_values[13],
              unit: "%",
              range: [Microbiome_metrics[5][0], Microbiome_metrics[5][1]],
              rangeString: Microbiome_metrics[5][2],
            },
            {
              name: MB_keys[14],
              value: MB_values[14],
              unit: "%",
              range: [Microbiome_metrics[6][0], Microbiome_metrics[6][1]],
              rangeString: Microbiome_metrics[6][2],
            },
            {
              name: MB_keys[15],
              value: MB_values[15],
              unit: "%",
              range: [Microbiome_metrics[7][0], Microbiome_metrics[7][1]],
              rangeString: Microbiome_metrics[7][2],
            },
            {
              name: MB_keys[16],
              value: MB_values[16],
              unit: "%",
              range: [Microbiome_metrics[8][0], Microbiome_metrics[8][1]],
              rangeString: Microbiome_metrics[8][2],
            },
            {
              name: MB_keys[17],
              value: MB_values[17],
              unit: "%",
              range: [Microbiome_metrics[9][0], Microbiome_metrics[9][1]],
              rangeString: Microbiome_metrics[9][2],
            },
            {
              name: MB_keys[18],
              value: MB_values[18],
              unit: "%",
              range: [Microbiome_metrics[10][0], Microbiome_metrics[10][1]],
              rangeString: Microbiome_metrics[10][2],
            },
            {
              name: MB_keys[19],
              value: MB_values[19],
              unit: "%",
              range: [Microbiome_metrics[11][0], Microbiome_metrics[11][1]],
              rangeString: Microbiome_metrics[11][2],
            },
            {
              name: MB_keys[20],
              value: MB_values[20],
              unit: "%",
              range: [Microbiome_metrics[12][0], Microbiome_metrics[12][1]],
              rangeString: Microbiome_metrics[12][2],
            },
            {
              name: MB_keys[21],
              value: MB_values[21],
              unit: "%",
              range: [Microbiome_metrics[13][0], Microbiome_metrics[13][1]],
              rangeString: Microbiome_metrics[13][2],
            },
            {
              name: MB_keys[22],
              value: MB_values[22],
              unit: "%",
              range: [Microbiome_metrics[14][0], Microbiome_metrics[14][1]],
              rangeString: Microbiome_metrics[14][2],
            },
            {
              name: MB_keys[23],
              value: MB_values[23],
              unit: "%",
              range: [Microbiome_metrics[15][0], Microbiome_metrics[15][1]],
              rangeString: Microbiome_metrics[15][2],
            },
            {
              name: MB_keys[24],
              value: MB_values[24],
              unit: "%",
              range: [Microbiome_metrics[16][0], Microbiome_metrics[16][1]],
              rangeString: Microbiome_metrics[16][2],
            },
            {
              name: MB_keys[25],
              value: MB_values[25],
              unit: "%",
              range: [Microbiome_metrics[17][0], Microbiome_metrics[17][1]],
              rangeString: Microbiome_metrics[17][2],
            },
            {
              name: MB_keys[26],
              value: MB_values[26],
              unit: "%",
              range: [Microbiome_metrics[18][0], Microbiome_metrics[18][1]],
              rangeString: Microbiome_metrics[18][2],
            },
            {
              name: MB_keys[27],
              value: MB_values[27],
              unit: "%",
              range: [Microbiome_metrics[19][0], Microbiome_metrics[19][1]],
              rangeString: Microbiome_metrics[19][2],
            },
            {
              name: MB_keys[28],
              value: MB_values[28],
              unit: "%",
              range: [Microbiome_metrics[20][0], Microbiome_metrics[20][1]],
              rangeString: Microbiome_metrics[20][2],
            },
            {
              name: MB_keys[29],
              value: MB_values[29],
              unit: "%",
              range: [Microbiome_metrics[21][0], Microbiome_metrics[21][1]],
              rangeString: Microbiome_metrics[21][2],
            },
            {
              name: MB_keys[30],
              value: MB_values[30],
              unit: "%",
              range: [Microbiome_metrics[22][0], Microbiome_metrics[22][1]],
              rangeString: Microbiome_metrics[22][2],
            },
            {
              name: MB_keys[31],
              value: MB_values[31],
              unit: "%",
              range: [Microbiome_metrics[23][0], Microbiome_metrics[23][1]],
              rangeString: Microbiome_metrics[23][2],
            },
            {
              name: MB_keys[32],
              value: MB_values[32],
              unit: "%",
              range: [Microbiome_metrics[24][0], Microbiome_metrics[24][1]],
              rangeString: Microbiome_metrics[24][2],
            },
            {
              name: MB_keys[33],
              value: MB_values[33],
              unit: "%",
              range: [Microbiome_metrics[25][0], Microbiome_metrics[25][1]],
              rangeString: Microbiome_metrics[25][2],
            },
            {
              name: MB_keys[34],
              value: MB_values[34],
              unit: "%",
              range: [Microbiome_metrics[26][0], Microbiome_metrics[26][1]],
              rangeString: Microbiome_metrics[26][2],
            },
            {
              name: MB_keys[35],
              value: MB_values[35],
              unit: "%",
              range: [Microbiome_metrics[27][0], Microbiome_metrics[27][1]],
              rangeString: Microbiome_metrics[27][2],
            },
            {
              name: MB_keys[36],
              value: MB_values[36],
              unit: "%",
              range: [Microbiome_metrics[28][0], Microbiome_metrics[28][1]],
              rangeString: Microbiome_metrics[28][2],
            },
            {
              name: MB_keys[37],
              value: MB_values[37],
              unit: "%",
              range: [Microbiome_metrics[29][0], Microbiome_metrics[29][1]],
              rangeString: Microbiome_metrics[29][2],
            },
            {
              name: MB_keys[38],
              value: MB_values[38],
              unit: "%",
              range: [Microbiome_metrics[30][0], Microbiome_metrics[30][1]],
              rangeString: Microbiome_metrics[30][2],
            },
            {
              name: MB_keys[39],
              value: MB_values[39],
              unit: "%",
              range: [Microbiome_metrics[31][0], Microbiome_metrics[31][1]],
              rangeString: Microbiome_metrics[31][2],
            },
            {
              name: MB_keys[40],
              value: MB_values[40],
              unit: "%",
              range: [Microbiome_metrics[32][0], Microbiome_metrics[32][1]],
              rangeString: Microbiome_metrics[32][2],
            },
            {
              name: MB_keys[41],
              value: MB_values[41],
              unit: "%",
              range: [Microbiome_metrics[33][0], Microbiome_metrics[33][1]],
              rangeString: Microbiome_metrics[33][2],
            },
            {
              name: MB_keys[42],
              value: MB_values[42],
              unit: "%",
              range: [Microbiome_metrics[34][0], Microbiome_metrics[34][1]],
              rangeString: Microbiome_metrics[34][2],
            },
            {
              name: MB_keys[43],
              value: MB_values[43],
              unit: "%",
              range: [Microbiome_metrics[35][0], Microbiome_metrics[35][1]],
              rangeString: Microbiome_metrics[35][2],
            },
            {
              name: MB_keys[44],
              value: MB_values[44],
              unit: "%",
              range: [Microbiome_metrics[36][0], Microbiome_metrics[36][1]],
              rangeString: Microbiome_metrics[36][2],
            },
            {
              name: MB_keys[45],
              value: MB_values[45],
              unit: "%",
              range: [Microbiome_metrics[37][0], Microbiome_metrics[37][1]],
              rangeString: Microbiome_metrics[37][2],
            },
            {
              name: MB_keys[46],
              value: MB_values[46],
              unit: "%",
              range: [Microbiome_metrics[38][0], Microbiome_metrics[38][1]],
              rangeString: Microbiome_metrics[38][2],
            },
            {
              name: MB_keys[47],
              value: MB_values[47],
              unit: "%",
              range: [Microbiome_metrics[39][0], Microbiome_metrics[39][1]],
              rangeString: Microbiome_metrics[39][2],
            },
            {
              name: MB_keys[48],
              value: MB_values[48],
              unit: "%",
              range: [Microbiome_metrics[40][0], Microbiome_metrics[40][1]],
              rangeString: Microbiome_metrics[40][2],
            },
            {
              name: MB_keys[49],
              value: MB_values[49],
              unit: "%",
              range: [Microbiome_metrics[41][0], Microbiome_metrics[41][1]],
              rangeString: Microbiome_metrics[41][2],
            },
            {
              name: MB_keys[50],
              value: MB_values[50],
              unit: "%",
              range: [Microbiome_metrics[42][0], Microbiome_metrics[42][1]],
              rangeString: Microbiome_metrics[42][2],
            },
            {
              name: MB_keys[51],
              value: MB_values[51],
              unit: "%",
              range: [Microbiome_metrics[43][0], Microbiome_metrics[43][1]],
              rangeString: Microbiome_metrics[43][2],
            },
            {
              name: MB_keys[52],
              value: MB_values[52],
              unit: "%",
              range: [Microbiome_metrics[44][0], Microbiome_metrics[44][1]],
              rangeString: Microbiome_metrics[44][2],
            },
            {
              name: MB_keys[53],
              value: MB_values[53],
              unit: "%",
              range: [Microbiome_metrics[45][0], Microbiome_metrics[45][1]],
              rangeString: Microbiome_metrics[45][2],
            },
          ],
        },
      ],
      microbiome_static_content: [
        {
          title: "Intro",
          content:
            "Microbes are everywhere, they live in and on all animals and plants and they fill our oceans. Right now, they are on your phone, your hands (even if you wash them), in your drinking water (about a million per one milliliter!), in aerosols around you and present at any moment in time. In fact, the ecosystem of planet earth, which is composed of a multitude of habitats, contains different sets of microbes that are essential for proper ecosystem functioning. As the ecosystems of planet Earth have a series of habitats with specific organisms that are essential for a proper ecosystem functioning, so does the human body. On a smaller scale, the human body is also an ecosystem, with different body sites providing different habitats for microbial communities. The microbial communities living in and on our body are collectively called the microbiome and we have distinct microbiomes at each of our body sites.",
        },
        {
          title: "What is the Gut Microbiome?",
          content:
            "The gut microbiome is a collective name for the 40 trillion cells and up to 1000 microbial species that include bacteria, viruses, fungi, parasites and archaea and reside in our gut. The number of gut bacterial cells is approximately equal to the total number of human cells in our body, so if we consider only cell counts, we are only about half human. In terms of gene counts, the microbiome contains about 200 times more genes than the human genome, making bacterial genes responsible for over 99% of our bodies’ gene content! Of all the microbial communities in the human body, the gut microbiome is by far the most dense, diverse and physiologically important ecosystem to our overall health.",
        },
        {
          title: "The importance of your Gut Microbiome",
          content: `
          <p>Our body lives in a symbiotic relationship with the microbes within us, which are significant contributors to our health and overall wellness</p> <br/> <br/>

          <p><strong>Health:</strong> In recent years science has discovered various associations between the microbiome and various health conditions including obesity(1), allergies and autoimmune conditions(2-4), vascular diseases(5), gastrointestinal diseases and disorders (IBS, IBD, Crohn's, colitis)(6-8) and even neurodegenerative disorders and mental conditions(9-10).</p> <br/> <br/>

          <p><strong>Energy:</strong> Bacterial breakdown of food provides approximately 10-20% of our energy supplies(11). The extent of energy extracted from foods depends on the microbiome, and it can differ dramatically between people(12).</p><br/> <br/>

          <p><strong>Essential Nutrients:</strong> The human body cannot produce all the nutrients required for its proper functioning, so some nutrients must be either acquired from diet, or produced by the gut microbiome. For example, the gut microbiome is a key producer of essential  vitamins, <br/><br/><br/><br/><br/><br/><br/><br/> like vitamin K and many vitamin B derivatives(13-14). Additionally, while many food components are absorbed early in our digestive tract (i.e the small intestine), some kinds of dietary fiber can only be broken down in the large intestines by specific members of the gut microbiome. Important products of this process include short chain fatty acids (SCFA) that are important for energizing colon cells, have anti-inflammatory properties and are even associated with hunger levels and the release of the hunger hormone, Leptin(15-16). </p> <br/> <br/>

          <p><strong>Immunity:</strong> There is growing evidence that the microbiome is regulating our immune system(17). Our microbiome is important in developing our immune system, helps by making our body tolerate food molecules and harmless substances, helps in recognizing invaders and protects against pathogens by constantly communicating with the immune system in the intestines(18).</p>`,
        },
        {
          title: "Taxonomic Classification",
          content: `Taxonomy is the science of organisms classification into groups based on shared characteristics or evolutionary relatedness. All living organisms are classified using taxonomic classifications.

Ranks or Levels of Microbial Taxonomy
Taxonomic classification is a hierarchical grouping of organisms in ranks of decreasing similarity. Organism groups can be aggregated with other relatively similar groups of the same rank, to create a super-group of higher rank. In bacterial taxonomy, the most commonly used ranks or levels in their ascending order are: strains, species, genera, families, orders, classes, phyla and kingdom (see table). Species is the basic taxonomic group in bacterial taxonomy. Groups of species are then collected into genera. Groups of genera are collected into families (sing. family), families into orders, orders into classes, classes into phyla (sing., phylum), and phyla into kingdom (the highest rank or level). Groups of bacteria at each rank or level have names with endings or suffixes characteristic to that rank or level.`,
        },
      ],

      gut_microbiome: {
        page_type: "gut_microbiome",
        microbiome_overview:
          "The gut microbiome is a collective name for 40 trillion cells...",
        phyla_breakdown: {
          Bacteroidetes: 43.66,
          Firmicutes: 43.21,
          Proteobacteria: 7.69,
          Others: 2.29,
          Actinobacteria: 3.15,
        },
        static: {
          heading: "Gut Microbiome",
          description: "What is the Gut Microbiome?",
          note: "Of all the microbial communities in the human body, the gut microbiome is by far the most dense and diverse.",
        },
      },
      disclaimer: {
        items: [
          `Trait Health Pvt. Ltd. (hereinafter referred to as
          &quot;We/Us/Our&quot;) is not responsible for any loss, liability, or
          counter-effect suffered by the person to whom the specimen belongs
          (including such person&apos;s guardian or any person acting on his/her
          behalf), referred to as &quot;You/Your&quot;.`,
          `This Report is not a diagnostic report and should be used for Research
          Use Only (RUO) or Investigational Use Only (IUO), and should be
          interpreted or used exclusively by or under the guidance of a
          practitioner, including but not limited to, certified physicians,
          clinicians, dietitians, nutritionists, sports therapists, and such
          other persons in similar professions having appropriate validation to
          undertake such practice.`,
          `This Report is generated using an algorithm that analyzes the
          sequencing data of your gut microbiome. As with any algorithm, the
          predictions and recommendations in this Report are based on
          statistical models and may not be entirely accurate for every
          individual. Therefore, it is important to interpret the results of
          this Report with caution and in conjunction with other relevant
          information about your health. Additionally, this Report is not
          intended to replace medical advice or guidance from a qualified
          healthcare professional.`,
          ` It is imperative that any preventative or therapeutic measures taken
          for any of the diagnosis should be solely under the guidance of a
          &quot;Professional Practitioner.&quot;`,
          `We shall not be held responsible for any misinterpretation by your
          &quot;Professional Practitioner&quot; of this Report or for any other
          matter arising out of this Report.`,
          `This Report&apos;s role is limited to providing insights into your gut
          microbiome, and risk assessment.`,
          `It is essential that you consult a Professional Practitioner for
          detailed recommendations or risk management that may be specific /
          customized for you.`,
          `Information in this Report is not intended to replace medical or
          professional advice offered by Professional Practitioners.`,
          `Not all disease-associated microbial groups may have been identified,
          validated, and recorded by the scientific community, and the clinical
          significance of many microbial groups is not completely understood.`,
          `This Report is limited only to those variants within your gut
          microbiome which has strong evidence of causing or contributing to a
          disease or a drug response or a metabolism-related issue till date.`,
          `The microbiome sequencing data is being constantly updated, both with
          new taxonomic groups and curation of old microbial databases, hence it
          is subject to revision-based updates based on the latest scientific
          research.`,
          `Microbiome information must always be considered in conjunction with
          other information about your health, including but not limited to your
          age, sex, ethnicity, lifestyle, bio-medical history, family health
          history, and any other information that You may provide to the
          &quot;Professional Practitioner.&quot;`,
          `We cannot be held responsible in any manner for non-adherence by you
          to the terms and conditions contained in this Disclaimer.`,
          `We shall not be responsible for any findings in this Report and
          disclaims any responsibility for any errors, including but not limited
          to human error in reporting, and/or omissions by the sampler or agent
          either during the collection of DNA samples (stool, etc.) or delivery
          of the DNA sample to us.`,
          ` With respect to this Report or process undertaken to arrive at the
          findings reflected or reported in the Report, We make no warranties of
          any kind including, without limitation, the implied warranties as to
          its merchantability, fitness for a specific purpose, accuracy, and
          non-infringement.`,
          `It is important to note that while this Report may provide
          information, it is not designed to diagnose or treat food allergies or
          sensitivities. If you have a known food allergy or sensitivity, it is
          important to seek guidance from a healthcare professional before
          making any dietary changes based on this Report.`,
        ],
      },
      references: {
        page_type: "references",
        reference_list: [
          "V. K. Ridaura et al. “Gut Microbiota from Twins Discordant for Obesity Modulate Metabolism in Mice.”Science 341, no. 6150 (2013). http://science.sciencemag.org/content/341/6150/1241214.",
          "M. Noval Rivas et al. “A Microbiota Signature Associated with Experimental Food Allergy Promotes Allergic Sensitization and Anaphylaxis.” Journal of Allergy and Clinical Immunology 131, no. 1 (2013): 201–212. http://www.jacionline.org/article/S0091-6749(12)01694-6/abstract.",
          "M. C. de Goffau et al. “Fecal Microbiota Composition Differs between Children with B-Cell Autoimmunity and Those Without.” Diabetes 62, no. 4 (2013): 1238–1244. http://diabetes.diabetesjournals.org/content/62/4/1238.",
          "A. Giongo et al. “Toward Defining the Autoimmune Microbiome for Type 1 Diabetes.” ISME Journal 5 (2011): 82–91. http://www.nature.com/ismej/journal/v5/n1/full/ismej201092a.html.",
          "Z. Wang et al. “Gut Flora Metabolism of Phosphatidylcholine Promotes Cardiovascular Disease.” Nature 472, no. 7341 (2011): 57–63. http://www.nature.com/nature/journal/v472/n7341/full/nature09922.html.",
          "S. Michail et al. “Alterations in the Gut Microbiome of Children with Severe Ulcerative Colitis.” Inflammatory Bowel Diseases 18, no. 10 (2012): 1799–1808. https://www.ncbi.nlm.nih.gov/pubmed/22170749.",
          "Manichanh, C., Borruel, N., Casellas, F., & Guarner, F. (2012). The Gut Microbiota In IBD. Nature reviews Gastroenterology & hepatology, 9(10), 599. https://www.nature.com/articles/nrgastro.2012.152",
          "Noor, S. O., Ridgway, K., Scovell, L., Kemsley, E. K., Lund, E. K., Jamieson, C., ... & Narbad, A. (2010). Ulcerative colitis and irritable bowel patients exhibit distinct abnormalities of the gut microbiota. BMC gastroenterology, 10(1), 134. https://bmcgastroenterol.biomedcentral.com/articles/10.1186/1471-230X-10-134",
          "A. Keshavarzian et al. “Colonic Bacterial Composition in Parkinson’s Disease.” Movement Disorders 30, no. 10 (2015): 1351–1360. http://onlinelibrary.wiley.com/doi/10.1002/mds.26307/abstract.",
          "J. M. Hill et al. “Pathogenic Microbes, the Microbiome, and Alzheimer’s Disease (AD).” Frontiers in Aging Neuroscience 6 (2014): 127. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4058571/.",
          "McNeil, N. I. (1984). The contribution of the large intestine to energy supplies in man. The American journal of clinical nutrition, 39(2), 338-342. https://academic.oup.com/ajcn/article-abstract/39/2/338/4691042.",
          "P. J. Turnbaugh et al. “An Obesity-Associated Gut Microbiome with Increased Capacity for Energy Harvest.” Nature 444 (2006): 1027–1031. http://www.nature.com/nature/journal/v444/n7122/abs/nature05414.html",
          "LeBlanc, J. G., Milani, C., de Giori, G. S., Sesma, F., Van Sinderen, D., & Ventura, M. (2013). Bacteria as vitamin suppliers to their host: a gut microbiota perspective. Current opinion in biotechnology, 24(2), 160-168. https://www.sciencedirect.com/science/article/pii/S095816691200119X",
          "Magnúsdóttir, S., Ravcheev, D., de Crécy-Lagard, V., & Thiele, I. (2015). Systematic genome assessment of Bvitamin biosynthesis suggests co-operation among gut microbes. Frontiers in genetics, 6, 148. https://www.frontiersin.org/articles/10.3389/fgene.2015.00148/full",
          "Frost, G., Sleeth, M. L., Sahuri-Arisoylu, M., Lizarbe, B., Cerdan, S., Brody, L., ... & Carling, D. (2014). The short-chain fatty acid acetate reduces appetite via a central homeostatic mechanism. Nature communications, 5, 3611. https://www.nature.com/articles/ncomms4611",
          "Schwiertz, A., Taras, D., Schäfer, K., Beijer, S., Bos, N. A., Donus, C., & Hardt, P. D. (2010). Microbiota and SCFA in lean and overweight healthy subjects. Obesity,18(1),190-195. https://onlinelibrary.wiley.com/doi/abs/10.1038/oby.2009.167",
          "Ost, K. S., & Round, J. L. (2018). Communication Between the Microbiota and Mammalian Immunity. Annual review of microbiology, 72. https://www.annualreviews.org/doi/abs/10.1146/annurevmicro-090817-062307",
          "Macpherson, A. J., de Aguero, M. G., & Ganal-Vonarburg, S. C. (2017). How nutrition and the maternal microbiota shape the neonatal immune system. Nature Reviews Immunology, 17(8), 508. https://www.nature.com/articles/nri.2017.58",
          "Le Chatelier, E., Nielsen, T., Qin, J., Prifti, E., Hildebrand, F., Falony, G., ... & Leonard, P. (2013). Richness of human gut microbiome correlates with metabolic markers. Nature, 500(7464), 541.",
          "Huttenhower, C., Gevers, D., Knight, R., Abubucker, S., Badger, J. H., Chinwalla, A. T., ... & Giglio, M. G. (2012). Structure, function and diversity of the healthy human microbiome. Nature, 486(7402), 207.",
          "Wu, G. D., Chen, J., Hoffmann, C., Bittinger, K., Chen, Y. Y., Keilbaugh, S. A., ... & Sinha, R. (2011). Linking long-term dietary patterns with gut microbial enterotypes. Science, 334(6052), 105-108.",
          "Schwiertz, A., Taras, D., Schäfer, K., Beijer, S., Bos, N. A., Donus, C., & Hardt, P. D. (2010). Microbiota and SCFA in lean and overweight healthy subjects. Obesity, 18(1), 190-195.",
          "Jumpertz, R., Le, D. S., Turnbaugh, P. J., Trinidad, C., Bogardus, C., Gordon, J. I., & Krakoff, J. (2011). Energybalance studies reveal associations between gut microbes, caloric load, and nutrient absorption in humans. The American journal of clinical nutrition, 94(1), 58-65.",
          "Flint, H. J., Scott, K. P., Louis, P., & Duncan, S. H. (2012). The role of the gut microbiota in nutrition and health. Nature Reviews Gastroenterology and Hepatology, 9(10), 577.",
          "Flint, H. J., Scott, K. P., Duncan, S. H., Louis, P., & Forano, E. (2012). Microbial degradation of complex carbohydrates in the gut. Gut microbes, 3(4), 289-306.",
          "Willing, B. P., Dicksved, J., Halfvarson, J., Andersson, A. F., Lucio, M., Zheng, Z., ... & Engstrand, L. (2010). A pyrosequencing study in twins shows that gastrointestinal microbial profiles vary with inflammatory bowel disease phenotypes. Gastroenterology, 139(6), 1844-1854.",
          "Saulnier, D. M., Riehle, K., Mistretta, T. A., Diaz, M. A., Mandal, D., Raza, S., ... & Petrosino, J. F. (2011). Gastrointestinal microbiome signatures of pediatric patients with irritable bowel syndrome. Gastroenterology, 141(5), 1782-1791.",
          "Tamanai-Shacoori, Z., Smida, I., Bousarghin, L., Loreal, O., Meuric, V., Fong, S. B., ... & Jolivet-Gougeon, A. (2017). Roseburia spp.: a marker of health?. Future microbiology, 12(2), 157-170.",
          "Everard, A., Belzer, C., Geurts, L., Ouwerkerk, J. P., Druart, C., Bindels, L. B., ... & De Vos, W. M. (2013). Cross-talk between Akkermansia muciniphila and intestinal epithelium controls diet-induced obesity. Proceedings of the National Academy of Sciences, 110(22), 9066-9071.",
          "Miquel, S., Martin, R., Rossi, O., Bermudez-Humaran, L. G., Chatel, J. M., Sokol, H., ... & Langella, P. (2013). Faecalibacterium prausnitzii and human intestinal health. Current opinion in microbiology, 16(3), 255-261.",
          "Fujimoto, T., Imaeda, H., Takahashi, K., Kasumi, E., Bamba, S., Fujiyama, Y., & Andoh, A. (2013). Decreased abundance of Faecalibacterium prausnitzii in the gut microbiota of Crohn's disease. Journal of gastroenterology and hepatology, 28(4), 613-619.",
          "Tremaroli, V., & Bäckhed, F. (2012). Functional interactions between the gut microbiota and host metabolism. Nature, 489(7415), 242.",
          "Macfarlane, G. T., & Macfarlane, S. (2012). Bacteria, colonic fermentation, and gastrointestinal health. Journal of AOAC International, 95(1), 50-60.",
          "Russell, W. R., Hoyles, L., Flint, H. J., & Dumas, M. E. (2013). Colonic bacterial metabolites and human health. Current opinion in microbiology, 16(3), 246-254.",
          "Rowland, I., Gibson, G., Heinken, A., Scott, K., Swann, J., Thiele, I., & Tuohy, K. (2017). Gut microbiota functions: metabolism of nutrients and other food components. European journal of nutrition, 1-24.",
          "Magnúsdóttir, S., Ravcheev, D., de Crécy-Lagard, V., & Thiele, I. (2015). Systematic genome assessment of Bvitamin biosynthesis suggests co-operation among gut microbes. Frontiers in genetics, 6, 148",
        ],
        static: {
          heading: "References",
        },
      },
    };

    const filePath = path.join(process.cwd(), "pages/api/dynamicData.json");
    await fs.promises.writeFile(filePath, JSON.stringify(dynamicData, null, 2));

    // Update the response to return dynamicData
    res.status(200).json({ dynamicData }); // Changed from { data } to { dynamicData }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Error fetching Google Sheets data: ${error.message}` });
  }
}
