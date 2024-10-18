// pages/api/sheets.js
import { google } from "googleapis";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
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
      overall_summary: {
        page_type: "snapshot",
        body_score: 80,
        biome_score: 76,
        health_snapshot_date: "15 aug 2023",
        message:
          "Your overall assessment seems ok, but would need improvement.",
        microbiome_analysis: {
          page_type: "microbiome_analysis",
          bacterial_phyla: {
            Bacteroidetes: 43.66,
            Firmicutes: 43.21,
            Proteobacteria: 7.69,
            Others: 2.29,
            Actinobacteria: 3.15,
          },
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
              unit: "g/dL",
              range: [12, 15],
            },
            {
              name: keys[4],
              value: values[4],
              unit: "Mlns/cmm",
              range: [3.8, 4.8],
            },
            {
              name: keys[5],
              value: values[5],
              unit: "cells/cmm",
              range: [4000, 10000],
            },
            {
              name: keys[6],
              value: values[6],
              unit: "lakhs/cmm",
              range: [1.5, 4.1],
            },
            { name: keys[7], value: values[7], unit: "%", range: [36, 46] },
            { name: keys[8], value: values[8], unit: "fL", range: [83, 101] },
            { name: keys[9], value: values[9], unit: "pg", range: [27, 32] },
            {
              name: keys[10],
              value: values[10],
              unit: "g/dL",
              range: [31.5, 34.5],
            },
            {
              name: keys[11],
              value: values[11],
              unit: "mm/hr",
              range: [0, 30],
            },
          ],
          differential_count: [
            {
              name: keys[12],
              value: values[12],
              unit: "%",
              range: [40, 80],
            },
            {
              name: keys[13],
              value: values[13],
              unit: "%",
              range: [20, 40],
            },
            { name: keys[14], value: values[14], unit: "%", range: [1, 6] },
            { name: keys[15], value: values[15], unit: "%", range: [2, 10] },
            { name: keys[16], value: values[16], unit: "%", range: [0, 1] },
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
              unit: "mg/dL",
              range: ["Infant/Child: 5-18", "Adult: 6-20", ">60.0 Years: 8-23"],
            },
            {
              name: keys[26],
              value: values[26],
              unit: "mg/dL",
              range: [17, 43],
            },
            {
              name: keys[27],
              value: values[27],
              unit: "mg/dL",
              range: [2.6, 6.0],
            },
            {
              name: keys[28],
              value: values[28],
              unit: "mg/dL",
              range: ["Adults: 0.5 - 0.9" | "Children: 0.30 - 0.70"],
            },
            {
              name: keys[29],
              value: values[29],
              unit: "",
              range: ["40:1", "110:1"],
            },
            {
              name: keys[30],
              value: values[30],
              unit: "",
              range: ["10:1", "20:1"],
            },
            {
              name: keys[31],
              value: values[31],
              unit: "mg/dL",
              range: [8.6, 10.3],
            },
            {
              name: keys[32],
              value: values[32],
              unit: "mmol/L",
              range: [136, 146],
            },
            {
              name: keys[33],
              value: values[33],
              unit: "mmol/L",
              range: [3.5, 5.1],
            },
            {
              name: keys[34],
              value: values[34],
              unit: "mmol/L",
              range: [101, 109],
            },
          ],
          static: {
            heading: "Renal (Kidney) Function Tests",
            why_test_is_important: "Why is this test important?",
          },
        },
        {
          page_type: "blood_parameters",
          liver_function_tests: [
            {
              name: keys[36],
              value: values[36],
              unit: "mg/dL (Serum, Jendrassik Grof)",
              range: [0.3, 1.2],
            },
            {
              name: keys[37],
              value: values[37],
              unit: "mg/dL (Serum, Diazotization)",
              range: [0, 0.4],
            },
            {
              name: keys[38],
              value: values[38],
              unit: "mg/L (Serum, Calculated)",
              range: [0.1, 1.0],
            },
            {
              name: keys[39],
              value: values[39],
              unit: "U/L (UV without P5P (IFCC))",
              range: [0, 31],
            },
            {
              name: keys[40],
              value: values[40],
              unit: "U/L (UV without P5P (IFCC))",
              range: [0, 34],
            },
            {
              name: keys[41],
              value: values[41],
              unit: "ratio (calculated)",
              range: [0.7, 1.4],
            },
            {
              name: keys[42],
              value: values[42],
              unit: "U/L (G-glutamyl-carboxy-Nitroanilide)",
              range: [12, 73],
            },
            {
              name: keys[43],
              value: values[43],
              unit: "U/L (PNPP, AMP Buffer, IFCC)",
              range: [39, 118],
            },
            {
              name: keys[44],
              value: values[44],
              unit: "g/L (Biuret)",
              range: [6.6, 8.7],
            },
            {
              name: keys[45],
              value: values[45],
              unit: "g/dL (Bromocresol Green)",
              range: [3.5, 5.2],
            },
            {
              name: keys[46],
              value: values[46],
              unit: "g/dL (Calculated)",
              range: [2.0, 3.5],
            },
            {
              name: keys[47],
              value: values[47],
              unit: "ratio (Calculated)",
              range: [1.2, 2.2],
            },
          ],
          static: {
            heading: "Liver Function Tests",
            why_test_is_important: "Why is this test important?",
          },
        },
        {
          page_type: "blood_parameters",
          glucose_fasting: 85,
          static: {
            heading: "Blood Sugar Indicator",
            why_test_is_important: "Why is this test important?",
          },
        },
        {
          page_type: "iron_profile",
          iron: 87,
          uibc: 246,
          tibc: 333,
          transferrin: 233.1,
          transferrin_saturation: 26,
          static: {
            heading: "Iron Profile",
            why_test_is_important: "Why is this test important?",
          },
        },
        {
          page_type: "urine_examination",
          microscopic_examination: {
            pus_cells_wbc: "2-3",
            epithelial_cells: "0-1",
            red_blood_cells: "0-1",
            yeast_cells: "Absent",
            crystals: "Absent",
            casts: "Absent",
            bacteria: "Absent",
            others: "Absent",
          },
          static: {
            heading: "Urine Examination",
            why_test_is_important: "Why is this test important?",
          },
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
    fs.writeFileSync(filePath, JSON.stringify(dynamicData, null, 2));

    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching Google Sheets data" });
  }
}
