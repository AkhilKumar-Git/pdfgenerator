"use client";

//Dependencies Import
import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

//Components Import
import PreReport from "@/components/pre-report";
import TestParameters from "@/components/test-parameters-template";
import MicrobiomeStatic from "@/components/microbiome-static";
import HealthReportComponent from "@/components/health-report";
import { TraitHealthReportComponent } from "@/components/trait-health-report";
import TableOfContents from "@/components/table-of-contents";
import { integrateReport } from "../utils/integrateReport";
import BloodTest from "@/components/blood-test-template";
import Component from "./pages/5/page";
import MicrobiomeTemplate from "@/components/microbiome-analysis";
import Disclaimer from "@/components/disclaimer";

const IntegratedReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const data = await integrateReport();
      if (data) {
        setReportData(data);
      }
      setLoading(false);
    };

    fetchReport();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!reportData) {
    return <div>Failed to load report data</div>;
  }

  const dynamicData = reportData;
  const contentlist = dynamicData["toc"];
  const MicrobiomeStaticContent = dynamicData["microbiome_static_content"];
  console.log(dynamicData);
  return (
    <div className="integrated-report">
      {/* <pre>
        {JSON.stringify(
          dynamicData["Tests"][0]["complete_blood_picture"],
          null,
          2
        )}
      </pre> */}
      <div className="component w-[210mm] bg-white">
        <img
          src="/FirstPage.png"
          className="w-full h-full bg-white"
          alt="Trait First Page"
        />
      </div>
      <div className="component bg-white">
        <TraitHealthReportComponent
          personal_info={dynamicData["personal_info"]}
          pageNumber={1}
          total={41}
        />
      </div>

      <div className="component  bg-white">
        <PreReport
          name={dynamicData["personal_info"]["name"]}
          report_date={dynamicData["personal_info"]["report_date"]}
          pageNumber={2}
          total={41}
        />
      </div>
      <div className="component w-[210mm] bg-white">
        <TableOfContents
          contentList={contentlist}
          name={dynamicData["personal_info"]["name"]}
          report_date={dynamicData["personal_info"]["report_date"]}
          pageNumber={2}
          total={41}
        />
      </div>
      <div className="component w-[210mm] bg-white">
        {/* Only Static Component, logic needed for biome score and other things */}
        <HealthReportComponent />
      </div>
      <div className="component w-[210mm] bg-white">
        <BloodTest
          testData={dynamicData["Tests"][0]["complete_blood_picture"]}
        />
      </div>
      <div className="component w-[210mm] bg-white">
        <TestParameters
          testData={dynamicData["Tests"][1]["renal_function_tests"]}
          static_text={{
            title: dynamicData["Tests"][1]["static"]["heading"],
            content: (
              <div>
                <h3 className="text-[11px] font-semibold mb-2">
                  Why is this test important?
                </h3>
                <div
                  className="text-[10px] text-gray-500 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      dynamicData["Tests"][1]["static"][
                        "why_test_is_important"
                      ],
                  }}
                />
              </div>
            ),
            image_path: "/kidney.svg",
            image_alt: "Kidney Logo",
          }}
        />
      </div>
      <div className="component w-[210mm] bg-white">
        <TestParameters
          testData={dynamicData["Tests"][2]["liver_function_tests"]}
          static_text={{
            title: dynamicData["Tests"][2]["static"]["heading"],
            content: (
              <div>
                <h3 className="text-[11px] font-semibold mb-2">
                  Why is this test important?
                </h3>
                <div
                  className="text-[10px] text-gray-500 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      dynamicData["Tests"][2]["static"][
                        "why_test_is_important"
                      ],
                  }}
                />
              </div>
            ),
            image_path: "/liver.svg",
            image_alt: "Liver Logo",
          }}
        />
      </div>
      <div className="component w-[210mm] bg-white">
        <TestParameters
          testData={dynamicData["Tests"][3]["lipid_profile"]}
          static_text={{
            title: dynamicData["Tests"][3]["static"]["heading"],
            content: (
              <div>
                <h3 className="text-[11px] font-semibold mb-2">
                  Why is this test important?
                </h3>
                <div
                  className="text-[10px] text-gray-500 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      dynamicData["Tests"][3]["static"][
                        "why_test_is_important"
                      ],
                  }}
                />
              </div>
            ),
            image_path: "/lipid.svg",
            image_alt: "Lipid Logo",
          }}
        />
      </div>
      <div className="component w-[210mm] bg-white">
        <TestParameters
          testData={dynamicData["Tests"][4]["metrics"]}
          static_text={{
            title: dynamicData["Tests"][4]["static"]["heading"],
            content: (
              <div>
                <h3 className="text-[11px] font-semibold mb-2">
                  Why is this test important?
                </h3>
                <div
                  className="text-[10px] text-gray-500 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      dynamicData["Tests"][4]["static"][
                        "why_test_is_important"
                      ],
                  }}
                />
              </div>
            ),
            image_path: "/blood-sugar.svg",
            image_alt: "Blood sugar Logo",
          }}
        />
      </div>

      <div className="component w-[210mm] bg-white">
        <TestParameters
          testData={dynamicData["Tests"][5]["metrics"]}
          static_text={{
            title: dynamicData["Tests"][5]["static"]["heading"],
            content: (
              <div>
                <h3 className="text-[11px] font-semibold mb-2">
                  Why is this test important?
                </h3>
                <div
                  className="text-[10px] text-gray-500 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      dynamicData["Tests"][5]["static"][
                        "why_test_is_important"
                      ],
                  }}
                />
              </div>
            ),
            image_path: "/thyroid.svg",
            image_alt: "Thyroid Logo",
          }}
        />
      </div>

      <div className="component w-[210mm] bg-white">
        <TestParameters
          testData={dynamicData["Tests"][6]["metrics"]}
          static_text={{
            title: dynamicData["Tests"][6]["static"]["heading"],
            content: (
              <div>
                <h3 className="text-[11px] font-semibold mb-2">
                  Why is this test important?
                </h3>
                <div
                  className="text-[10px] text-gray-500 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      dynamicData["Tests"][6]["static"][
                        "why_test_is_important"
                      ],
                  }}
                />
              </div>
            ),
            image_path: "/vitamin.svg",
            image_alt: "Vitamin Logo",
          }}
        />
      </div>

      <div className="component w-[210mm] bg-white">
        <TestParameters
          testData={dynamicData["Tests"][7]["metrics"]}
          static_text={{
            title: dynamicData["Tests"][7]["static"]["heading"],
            content: (
              <div>
                <h3 className="text-[11px] font-semibold mb-2">
                  Why is this test important?
                </h3>
                <div
                  className="text-[10px] text-gray-500 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      dynamicData["Tests"][7]["static"][
                        "why_test_is_important"
                      ],
                  }}
                />
              </div>
            ),
            image_path: "/vitamin.svg",
            image_alt: "Vitamin Logo",
          }}
        />
      </div>

      <div className="component w-[210mm] bg-white">
        <TestParameters
          testData={dynamicData["Tests"][8]["metrics"]}
          static_text={{
            title: dynamicData["Tests"][8]["static"]["heading"],
            content: (
              <div>
                <h3 className="text-[11px] font-semibold mb-2">
                  Why is this test important?
                </h3>
                <div
                  className="text-[10px] text-gray-500 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      dynamicData["Tests"][8]["static"][
                        "why_test_is_important"
                      ],
                  }}
                />
              </div>
            ),
            image_path: "/urine.svg",
            image_alt: "Urine collection Logo",
          }}
        />
      </div>

      <div className="component w-[210mm] bg-white">
        <div className="flex flex-col justify-between w-[210mm] bg-white px-[48px] pt-[72px]">
          <div className=" text-black text-center text-3xl font-normal my-[420px] tracking-tight">
            Microbiome Analysis
          </div>
          <div className="flex justify-between items-center text-[7px] text-gray-600">
            <p>Tejinder | 15th August</p>
            <p className="font-bold">23/41</p>
          </div>
        </div>
      </div>
      {MicrobiomeStaticContent.map((content, index) => (
        <div className="component w-[210mm] bg-white" key={index}>
          <MicrobiomeStatic
            name={dynamicData["personal_info"]["name"]}
            report_date={dynamicData["personal_info"]["report_date"]}
            pageNumber={24 + index} // Adjust page number as needed
            total={41}
            image_url={`/microbiome/image${index + 1}.png`} // Adjust image URL as needed
            static_text={{
              title: content.title,
              content: (
                <div
                  className="text-base text-[11px] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              ),
            }}
          />
        </div>
      ))}

      <div className="component w-[210mm] bg-white">
        <Component />
      </div>

      <div className="component w-[210mm] bg-white">
        <MicrobiomeTemplate
          testData={dynamicData["Tests"][9]["metrics"]}
          pieData={dynamicData["Tests"][9]["yourPie"]}
          normalData={dynamicData["Tests"][9]["normalPie"]}
        />
      </div>

      <div className="component w-[210mm] bg-white">
        <Disclaimer />
      </div>

      <div className="component w-[210mm] bg-white">
        <div className="flex flex-col justify-between w-[210mm] bg-white px-[48px] pt-[72px]">
          <div className=" text-black text-center text-3xl font-normal my-[420px] tracking-tight">
            References
          </div>
          <div className="flex justify-between items-center text-[7px] text-gray-600">
            <p>Tejinder | 15th August</p>
            <p className="font-bold">23/41</p>
          </div>
        </div>
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
    const margin = { top: 72, right: 0, bottom: 42, left: 0 };

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
          position + 72,
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

    pdf.save("ihr.pdf");
  };

  return (
    <div className="w-[210mm] mx-auto">
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
