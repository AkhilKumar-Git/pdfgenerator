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
    const CBP_grid = "CBP!A2:C22";
    const CBP = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: CBP_grid,
    });
    const CBP_metrics = CBP.data.values.map((item) => [item[2], item[1]]);

    //RFT Import
    const RFT_grid = "RFT!A2:C11";
    const RFT = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: RFT_grid,
    });
    const RFT_metrics = RFT.data.values.map((item) => [item[2], item[1]]);

    //LFT Import
    const LFT_grid = "LFT!A2:C13";
    const LFT = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: LFT_grid,
    });
    const LFT_metrics = LFT.data.values.map((item) => [item[2], item[1]]);

    //Lipid Import
    const Lipid_grid = "Lipid!A2:C7";
    const Lipid = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: Lipid_grid,
    });
    const Lipid_metrics = Lipid.data.values.map((item) => [item[2], item[1]]);

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
      // CBP: CBP_metrics,
      // RFT: RFT_metrics,
      Lipid: Lipid_metrics,
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
              unit: CBP_metrics[0][0],
              range: CBP_metrics[0][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[4],
              value: values[4],
              unit: CBP_metrics[1][0],
              range: CBP_metrics[1][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[5],
              value: values[5],
              unit: CBP_metrics[2][0],
              range: CBP_metrics[2][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[6],
              value: values[6],
              unit: CBP_metrics[3][0],
              range: CBP_metrics[3][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[7],
              value: values[7],
              unit: CBP_metrics[4][0],
              range: CBP_metrics[4][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[8],
              value: values[8],
              unit: CBP_metrics[5][0],
              range: CBP_metrics[5][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[9],
              value: values[9],
              unit: CBP_metrics[6][0],
              range: CBP_metrics[6][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[10],
              value: values[10],
              unit: CBP_metrics[7][0],
              range: CBP_metrics[7][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[11],
              value: values[11],
              unit: CBP_metrics[8][0],
              range: CBP_metrics[8][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
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
              unit: RFT_metrics[0][0],
              range: RFT_metrics[0][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[26],
              value: values[26],
              unit: RFT_metrics[1][0],
              range: RFT_metrics[1][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[27],
              value: values[27],
              unit: RFT_metrics[2][0],
              range: RFT_metrics[2][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[28],
              value: values[28],
              unit: RFT_metrics[3][0],
              range: RFT_metrics[3][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[29],
              value: values[29],
              unit: "",
              range: RFT_metrics[4][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[30],
              value: values[30],
              unit: "",
              range: RFT_metrics[5][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[31],
              value: values[31],
              unit: RFT_metrics[6][0],
              range: RFT_metrics[6][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[32],
              value: values[32],
              unit: RFT_metrics[7][0],
              range: RFT_metrics[7][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[33],
              value: values[33],
              unit: RFT_metrics[8][0],
              range: RFT_metrics[8][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[34],
              value: values[34],
              unit: RFT_metrics[9][0],
              range: RFT_metrics[9][1]
                .split("-")
                .map((num) => Number(num.trim())),
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
              range: LFT_metrics[0][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[37],
              value: values[37],
              unit: LFT_metrics[1][0],
              range: LFT_metrics[1][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[38],
              value: values[38],
              unit: LFT_metrics[2][0],
              range: LFT_metrics[2][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[39],
              value: values[39],
              unit: LFT_metrics[3][0],
              range: LFT_metrics[3][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[40],
              value: values[40],
              unit: LFT_metrics[4][0],
              range: LFT_metrics[4][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[41],
              value: values[41],
              unit: LFT_metrics[5][0],
              range: LFT_metrics[5][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[42],
              value: values[42],
              unit: LFT_metrics[6][0],
              range: LFT_metrics[6][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[43],
              value: values[43],
              unit: LFT_metrics[7][0],
              range: LFT_metrics[7][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[44],
              value: values[44],
              unit: LFT_metrics[8][0],
              range: LFT_metrics[8][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[45],
              value: values[45],
              unit: LFT_metrics[9][0],
              range: LFT_metrics[9][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[46],
              value: values[46],
              unit: LFT_metrics[10][0],
              range: LFT_metrics[10][1]
                .split("-")
                .map((num) => Number(num.trim())),
            },
            {
              name: keys[47],
              value: values[47],
              unit: LFT_metrics[11][0],
              range: LFT_metrics[11][1]
                .split("-")
                .map((num) => Number(num.trim())),
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
          glucose_fasting: 85,
          static: {
            heading: "Blood Sugar Indicators",
            why_test_is_important: "Why is this test important?",
          },
        },
        {
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
