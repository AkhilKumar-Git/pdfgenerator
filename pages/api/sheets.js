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

    const data = keys
      .map((key, index) => ({
        key: key + " " + index,
        value: values[index] || null,
      }))
      .filter(
        (pair) =>
          pair.key !== null &&
          pair.key !== "" &&
          pair.value !== null &&
          pair.value !== ""
      );

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
    const Lipid_grid = "Lipid!A2:C7";
    const Lipid = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Lipid_grid,
    });
    const Lipid_metrics = Lipid.data.values.map((item) => [item[2], item[1]]);

    //Diabetes Import
    const Diabetes_grid = "Diabetes!A2:C3";
    const Diabetes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Diabetes_grid,
    });
    const Diabetes_metrics = Diabetes.data.values.map((item) => [
      item[2],
      item[1],
    ]);

    //Thyroid Import
    const Thyroid_grid = "Thyroid!A2:C4";
    const Thyroid = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Thyroid_grid,
    });
    const Thyroid_metrics = Thyroid.data.values.map((item) => [
      item[2],
      item[1],
    ]);

    //Vitamin Import
    const Vitamins_grid = "Vitamins!A2:C4";
    const Vitamins = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Vitamins_grid,
    });
    const Vitamins_metrics = Vitamins.data.values.map((item) => [
      item[2],
      item[1],
    ]);

    //Elements Import
    const Elements_grid = "Elements!A2:C8";
    const Elements = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Elements_grid,
    });
    const Elements_metrics = Elements.data.values.map((item) => [
      item[2],
      item[1],
    ]);

    //Urine Import
    const CUE_grid = "CUE!A2:C21";
    const CUE = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: CUE_grid,
    });
    const CUE_metrics = CUE.data.values.map((item) => [item[2], item[1]]);

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
        value: item[1],
        color: color,
      };
    });

    colorIndex = 0;

    const normalPie_metrics = Snapshot.data.values.map((item) => {
      const color = colors[colorIndex % colors.length];
      colorIndex++;

      return {
        name: item[0],
        value: item[2],
        color: color,
      };
    });

    //Microbiome Import
    const Microbiome_grid = "Microbiome!A2:B47";
    const Microbiome = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Microbiome_grid,
    });
    const Microbiome_metrics = Microbiome.data.values.map((item) => item[1]);

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
      CBP: typeof CBP_metrics[1][1],
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
        body_score: 80,
        biome_score: 76,
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
              range: Lipid_metrics[0][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[50],
              value: values[50],
              unit: Lipid_metrics[1][0],
              range: Lipid_metrics[1][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[51],
              value: values[51],
              unit: Lipid_metrics[2][0],
              range: Lipid_metrics[2][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[52],
              value: values[52],
              unit: Lipid_metrics[3][0],
              range: Lipid_metrics[3][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[53],
              value: values[53],
              unit: Lipid_metrics[4][0],
              range: Lipid_metrics[4][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[54],
              value: values[54],
              unit: Lipid_metrics[5][0],
              range: Lipid_metrics[5][1]
                .split("-")
                .map((num) => Number(num.trim())),
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
              range: Diabetes_metrics[0][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[94],
              value: values[94],
              unit: Diabetes_metrics[1][0],
              range: Diabetes_metrics[1][1]
                .split("-")
                .map((num) => Number(num.trim())),
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
              range: Thyroid_metrics[0][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[57],
              value: values[57],
              unit: Thyroid_metrics[1][0],
              range: Thyroid_metrics[1][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[58],
              value: values[58],
              unit: Thyroid_metrics[2][0],
              range: Thyroid_metrics[2][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
          ],
          static: {
            heading: "Thryroid Profile",
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
              range: Vitamins_metrics[0][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[90],
              value: values[90],
              unit: Vitamins_metrics[1][0],
              range: Vitamins_metrics[1][1]
                .split("-")
                .map((num) => Number(num.trim())),
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
              range: Elements_metrics[0][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[61],
              value: values[61],
              unit: Elements_metrics[1][0],
              range: Elements_metrics[1][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[62],
              value: values[62],
              unit: Elements_metrics[2][0],
              range: Elements_metrics[2][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[63],
              value: values[63],
              unit: Elements_metrics[3][0],
              range: Elements_metrics[3][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[64],
              value: values[64],
              unit: Elements_metrics[4][0],
              range: Elements_metrics[4][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[65],
              value: values[65],
              unit: Elements_metrics[5][0],
              range: Elements_metrics[5][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[66],
              value: values[66],
              unit: Elements_metrics[6][0],
              range: Elements_metrics[6][1]
                .split("-")
                .map((num) => Number(num.trim())),
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
              range: CUE_metrics[0][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[69],
              value: values[69],
              unit: CUE_metrics[1][0],
              range: CUE_metrics[1][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[70],
              value: values[70],
              unit: CUE_metrics[2][0],
              range: CUE_metrics[2][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[71],
              value: values[71],
              unit: CUE_metrics[3][0],
              range: CUE_metrics[3][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[72],
              value: values[72],
              unit: CUE_metrics[4][0],
              range: CUE_metrics[4][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[73],
              value: values[73],
              unit: CUE_metrics[5][0],
              range: CUE_metrics[5][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[74],
              value: values[74],
              unit: CUE_metrics[6][0],
              range: CUE_metrics[6][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[75],
              value: values[75],
              unit: CUE_metrics[7][0],
              range: CUE_metrics[7][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[76],
              value: values[76],
              unit: CUE_metrics[8][0],
              range: CUE_metrics[8][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[77],
              value: values[77],
              unit: CUE_metrics[9][0],
              range: CUE_metrics[9][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[78],
              value: values[78],
              unit: CUE_metrics[10][0],
              range: CUE_metrics[10][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[79],
              value: values[79],
              unit: CUE_metrics[11][0],
              range: CUE_metrics[11][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[80],
              value: values[80],
              unit: CUE_metrics[12][0],
              range: CUE_metrics[12][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[81],
              value: values[81],
              unit: CUE_metrics[13][0],
              range: CUE_metrics[13][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[82],
              value: values[82],
              unit: CUE_metrics[14][0],
              range: CUE_metrics[14][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[83],
              value: values[83],
              unit: CUE_metrics[15][0],
              range: CUE_metrics[15][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[84],
              value: values[84],
              unit: CUE_metrics[16][0],
              range: CUE_metrics[16][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[85],
              value: values[85],
              unit: CUE_metrics[17][0],
              range: CUE_metrics[17][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[86],
              value: values[86],
              unit: CUE_metrics[18][0],
              range: CUE_metrics[18][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[87],
              value: values[87],
              unit: CUE_metrics[19][0],
              range: CUE_metrics[19][1]
                .split("-")
                .map((num) => Number(num.trim())),
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
              range: Microbiome_metrics[0],
            },
            {
              name: MB_keys[9],
              value: MB_values[9],
              unit: "%",
              range: Microbiome_metrics[1],
            },
            {
              name: MB_keys[10],
              value: MB_values[10],
              unit: "%",
              range: Microbiome_metrics[2],
            },
            {
              name: MB_keys[11],
              value: MB_values[11],
              unit: "%",
              range: Microbiome_metrics[3],
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
      references: {
        page_type: "references",
        reference_list: [
          "Everard, A., Belzer, C., Geurts, L., et al. (2013). Cross-talk between Akkermansia...",
          "Miquel, S., Martin, R., Rossi, O., et al. (2013). Faecalibacterium prausnitzii and...",
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
