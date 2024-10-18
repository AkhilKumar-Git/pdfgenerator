"use client";

//Dependencies Import
import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

//Components Import
import PreReport from "@/components/pre-report";
import TestParameters from "@/components/test-parameters-template";
import MicrobiomeStatic from "@/components/microbiome-static";
import PersonDetails from "@/components/person-details";
import HealthReportComponent from "@/components/health-report";

const IntegratedReport = () => {
  return (
    <div className="integrated-report">
      <div className="component w-[210mm] bg-white">
        <PersonDetails />
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

      const canvas = await html2canvas(element, { scale: 2 });
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
