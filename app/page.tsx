"use client";

//Dependencies Import
import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

//Components Import
import PreReport from "@/components/pre-report";
import TestParameters from "@/components/test-parameters-template";
import MicrobiomeStatic from "@/components/microbiome-static";
import HealthReportComponent from "@/components/health-report";
import { TraitHealthReportComponent } from "@/components/trait-health-report";

const dynamicData = {
  personal_info: {
    name: "Tejinder Sharma",
    age: 24,
    gender: "male",
    sample_types: " Blood , Saliva, Urine, Stool ",
    test_date: "Wednesday, July 31, 2024",
    report_date: "Monday, August 12, 2024",
  },
  overall_summary: {
    page_type: "snapshot",
    body_score: 80,
    biome_score: 76,
    health_snapshot_date: "15 aug 2023",
    message: "Your overall assessment seems ok, but would need improvement.",
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
          name: "Hemoglobin",
          value: "13.9",
          unit: "g/dL",
          range: [12, 15],
        },
        {
          name: "Total RBC Count",
          value: "4.7",
          unit: "Mlns/cmm",
          range: [3.8, 4.8],
        },
        {
          name: "Total WBC Count",
          value: "5800",
          unit: "cells/cmm",
          range: [4000, 10000],
        },
        {
          name: "Platelet Count",
          value: "1.78",
          unit: "lakhs/cmm",
          range: [1.5, 4.1],
        },
        {
          name: "PCV/HCT",
          value: "42.1",
          unit: "%",
          range: [36, 46],
        },
        {
          name: "MCV",
          value: "89.6",
          unit: "fL",
          range: [83, 101],
        },
        {
          name: "MCH",
          value: "29.5",
          unit: "pg",
          range: [27, 32],
        },
        {
          name: "MCHC",
          value: "32.9",
          unit: "g/dL",
          range: [31.5, 34.5],
        },
        {
          name: "Erytrocyte Sedimenation Rate (ESR)",
          value: "12",
          unit: "mm/hr",
          range: [0, 30],
        },
      ],
      differential_count: [
        {
          name: "Neutrophils",
          value: "40",
          unit: "%",
          range: [40, 80],
        },
        {
          name: "Lymphocytes",
          value: "51",
          unit: "%",
          range: [20, 40],
        },
        {
          name: "Eosinophils",
          value: "4",
          unit: "%",
          range: [1, 6],
        },
        {
          name: "Monocytes",
          value: "5",
          unit: "%",
          range: [2, 10],
        },
        {
          name: "Basophils",
          value: "0",
          unit: "%",
          range: [0, 1],
        },
      ],
      peripheral_smear: [
        {
          name: "RBC",
          value: "Predominantly normocytic normochromic",
        },
        {
          name: "WBC",
          value: "Normal in number and distribution",
        },
        {
          name: "Platelets",
          value: "Adequate in number on smear",
        },
        {
          name: "Haemoparasites",
          value: "No Hemoparasite seen.",
        },
        {
          name: "Impression",
          value: "Normocytic Normochromic blood picture",
        },
      ],
      blood_group: [
        {
          name: "Blood Group (A,B,O)",
          value: "B",
        },
        {
          name: "Rh Factor",
          value: "Negative",
        },
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
          name: "Blood Urea Nitrogen - BUN",
          value: "10.7",
          unit: "mg/dL",
          range: ["Infant/Child: 5-18", "Adult: 6-20", ">60.0 Years: 8-23"],
        },
        {
          name: "Urea",
          value: "22.898",
          unit: "mg/dL",
          range: [17, 43],
        },
        {
          name: "Uric Acid",
          value: "4.7",
          unit: "mg/dL",
          range: [2.6, 6],
        },
        {
          name: "Creatinine",
          value: "0.65",
          unit: "mg/dL",
          range: [0],
        },
        {
          name: "Urea Creatinine Ratio",
          value: "35.23",
          unit: "",
          range: ["40:1", "110:1"],
        },
        {
          name: "BUN Creatinine Ratio",
          value: "16.46",
          unit: "",
          range: ["10:1", "20:1"],
        },
        {
          name: "Calcium",
          value: "9.7",
          unit: "mg/dL",
          range: [8.6, 10.3],
        },
        {
          name: "Sodium",
          value: "142",
          unit: "mmol/L",
          range: [136, 146],
        },
        {
          name: "Potassium",
          value: "3.9",
          unit: "mmol/L",
          range: [3.5, 5.1],
        },
        {
          name: "Chloride",
          value: "106",
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
          name: "Bilirubin - Total",
          value: "0.88",
          unit: "mg/dL (Serum, Jendrassik Grof)",
          range: [0.3, 1.2],
        },
        {
          name: "Bilirubin - Direct",
          value: "0.37",
          unit: "mg/dL (Serum, Diazotization)",
          range: [0, 0.4],
        },
        {
          name: "Bilirubin - Indirect",
          value: "0.51",
          unit: "mg/L (Serum, Calculated)",
          range: [0.1, 1],
        },
        {
          name: "Aspartate Aminotransferase (AST/SGOT)",
          value: "20",
          unit: "U/L (UV without P5P (IFCC))",
          range: [0, 31],
        },
        {
          name: "Alanine Transaminase (ALT/SGPT)",
          value: "19",
          unit: "U/L (UV without P5P (IFCC))",
          range: [0, 34],
        },
        {
          name: "SGOT/SGPT",
          value: "1.05",
          unit: "ratio (calculated)",
          range: [0.7, 1.4],
        },
        {
          name: "GGT-Gamma-glutamyl transpeptidase",
          value: "21",
          unit: "U/L (G-glutamyl-carboxy-Nitroanilide)",
          range: [12, 73],
        },
        {
          name: "Alkaline Phosphatase-ALPI",
          value: "89",
          unit: "U/L (PNPP, AMP Buffer, IFCC)",
          range: [39, 118],
        },
        {
          name: "Total Protein",
          value: "7.6",
          unit: "g/L (Biuret)",
          range: [6.6, 8.7],
        },
        {
          name: "Albumin",
          value: "4.6",
          unit: "g/dL (Bromocresol Green)",
          range: [3.5, 5.2],
        },
        {
          name: "Globulin",
          value: "3",
          unit: "g/dL (Calculated)",
          range: [2, 3.5],
        },
        {
          name: "A/G Ratio",
          value: "1.53",
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

const IntegratedReport = () => {
  const currentCount = 1;
  const totalCount = 40;
  return (
    <div className="integrated-report">
      <div className="component w-[210mm] bg-white">
        <img
          src="/FirstPage.png"
          className="w-full h-full bg-white"
          alt="Trait First Page"
        />
      </div>
      <div className="component bg-white">
        <TraitHealthReportComponent
          personal_info={dynamicData.personal_info}
          pageNumber={currentCount}
          total={totalCount}
        />
      </div>
      <div className="component w-[210mm] bg-white">
        <PreReport />
      </div>
      <div className="component w-[210mm] bg-white">
        <HealthReportComponent />
      </div>
      <div className="component w-[210mm] bg-white">
        <TestParameters />
      </div>
      <div className="component w-[210mm] bg-white">
        <MicrobiomeStatic />
      </div>
    </div>
  );
};

const TotalPDFConverter = () => {
  const reportRef = useRef(null);

  const generatePDF = async () => {
    if (!reportRef.current) return;
    const report = reportRef.current as HTMLElement;
    const pdf = new jsPDF({
      format: "a4",
      unit: "mm",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = { top: 48, right: 0, bottom: 42, left: 0 };

    let shouldStartOnNewPage = false; // Flag for starting a new page

    const processComponent = async (
      element: HTMLElement,
      withMargin = false
    ) => {
      console.log(
        `Processing component, starting on page ${
          pdf.getCurrentPageInfo().pageNumber
        }`
      );

      const canvas = await html2canvas(element, { scale: 3 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth - (withMargin ? margin.left + margin.right : 0);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      console.log(`Component height: ${imgHeight} | Page height: ${pdfHeight}`);

      // Add image to the current page
      pdf.addImage(
        imgData,
        "PNG",
        withMargin ? margin.left : 0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pdfHeight;

      console.log(`Height left after first render: ${heightLeft}`);

      // If the content overflows, continue adding new pages
      while (heightLeft > 0) {
        pdf.addPage();
        console.log(
          `Adding new page for overflow, now on page ${
            pdf.getCurrentPageInfo().pageNumber
          }`
        );
        position = heightLeft - imgHeight;
        pdf.addImage(
          imgData,
          "PNG",
          withMargin ? margin.left : 0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pdfHeight;

        console.log(`Remaining height after new page: ${heightLeft}`);
      }

      // Set flag to indicate whether the next component should start on a new page
      shouldStartOnNewPage = heightLeft < 0;
      console.log(
        `Component processed. Will the next component start on a new page? ${shouldStartOnNewPage}`
      );
    };

    const components = report.querySelectorAll(".component");
    for (let i = 0; i < components.length; i++) {
      const element = components[i] as HTMLElement;

      // If a previous component overflowed, ensure the next one starts on a new page
      if (shouldStartOnNewPage || pdf.getCurrentPageInfo().pageNumber > 1) {
        pdf.addPage();
        console.log(
          `Starting new component on a new page: ${
            pdf.getCurrentPageInfo().pageNumber
          }`
        );
        shouldStartOnNewPage = false;
      }

      const elementHeight = element.scrollHeight;

      console.log(`Component ${i + 1} height: ${elementHeight}`);

      // Process each component, checking if it fits or overflows
      if (elementHeight > pdfHeight) {
        console.log(`Component ${i + 1} is large and may span multiple pages`);
        await processComponent(element, true); // Handle large components spanning multiple pages
      } else {
        console.log(`Component ${i + 1} fits on the page`);
        await processComponent(element); // Handle smaller components
      }

      console.log(`Finished processing component ${i + 1}`);
    }

    pdf.save("integrated_health_report.pdf");
  };

  return (
    <div className="max-w-[210mm] mx-auto">
      <button
        onClick={generatePDF}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Generate PDF
      </button>
      <div ref={reportRef}>
        <IntegratedReport />
      </div>
    </div>
  );
};

export default TotalPDFConverter;
