"use client";

//Dependencies Import
import React, { ReactNode, useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// import { toPng } from "html-to-image";
// import * as htmlToImage from "html-to-image";

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
import Microbiome_interpretation from "@/components/microbiome_interpretation";

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

  interface staticContentProps {
    title: string;
    content: ReactNode;
  }

  const dynamicData = reportData;
  const contentlist = dynamicData["toc"];
  const MicrobiomeStaticContent: staticContentProps[] =
    dynamicData["microbiome_static_content"];
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
        <HealthReportComponent
          name={dynamicData["personal_info"]["name"]}
          report_date={dynamicData["personal_info"]["report_date"]}
          yourData={dynamicData["Tests"][9]["yourPie"]}
          normalData={dynamicData["Tests"][9]["normalPie"]}
          healthScore={dynamicData["overall_summary"]["body_score"]}
          gutScore={dynamicData["overall_summary"]["biome_score"]}
          barData={
            dynamicData["overall_summary"]["microbiome_analysis"][
              "health_overall_metrics"
            ]
          }
        />
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
                  dangerouslySetInnerHTML={{ __html: content.content || "" }}
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
        <Microbiome_interpretation
          image="/zoom-out.svg"
          alt="interpretation"
          title="Microbiome Analysis Interpretation"
          list={dynamicData["interpretations"]}
        />
      </div>

      <div className="component w-[210mm] bg-white">
        <Disclaimer
          title={"Disclaimer"}
          items={dynamicData["disclaimer"]["items"]}
        />
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

      <div className="component w-[210mm] bg-white">
        <Disclaimer
          title={"References"}
          items={dynamicData["references"]["reference_list"]}
        />
      </div>
    </div>
  );
};

const TotalPDFConverter = () => {
  const reportRef = useRef(null);

  // Function to handle print settings
  const handlePrint = async () => {
    if (!reportRef.current) return;

    // Add print-specific styles
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 10mm;
        }
        
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .component {
          break-inside: avoid;
          margin-bottom: 20px;
          page-break-inside: avoid;
        }

        .page-break {
          page-break-before: always;
        }

        /* Hide the print button during printing */
        .print-button {
          display: none;
        }

        /* Skip first page content */
        @page :first {
          margin-top: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Configure print settings
    const printSettings = {
      destination: 'Save as PDF',
      documentTitle: 'Health Report',
      scale: 1,
      pageRanges: '2-',  // Print from page 2 onwards
      printBackground: true,
      shouldPrintBackgrounds: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size: 10px; text-align: center; width: 100%; margin: 0 10mm;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
    };

    try {
      // Trigger system print with configured settings
      window.print();
    } finally {
      // Cleanup
      document.head.removeChild(style);
    }
  };

  return (
    <div className="w-[210mm] mx-auto">
      <button
        onClick={handlePrint}
        className="print-button mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Generate PDF
      </button>
      <div ref={reportRef} className="print-content">
        <IntegratedReport />
      </div>
    </div>
  );
};

export default TotalPDFConverter;
