"use client";

//Dependencies Import
import React, { ReactNode, useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { cn } from "@/lib/utils";

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
  const reportRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

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
  console.log(dynamicData["overall_summary"]["microbiome_analysis"]["normalPie"]);

  const generatePDF = async () => {
    const report = reportRef.current;
    if (!report) return;

    setIsGenerating(true);
    setProgress(0);

    try {
      // A4 dimensions in mm
      const pageWidth = 210;
      const pageHeight = 297;

      const pdf = new jsPDF({
        format: 'a4',
        unit: 'mm',
        orientation: 'portrait',
        compress: true
      });

      const components = report.getElementsByClassName('page');
      const totalComponents = components.length;

      for (let i = 0; i < totalComponents; i++) {
        const component = components[i];
        
        // Add new page for all pages except first
        if (i > 0) pdf.addPage();

        const canvas = await html2canvas(component, {
          scale: 3,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#FFFFFF',
          windowWidth: component.scrollWidth,
          windowHeight: component.scrollHeight,
          onclone: (clonedDoc) => {
            const clonedComponent = clonedDoc.getElementsByClassName('component')[i];
            if (clonedComponent) {
              clonedComponent.style.transform = '';
              clonedComponent.style.border = 'none';
            }
          }
        });

        // Calculate dimensions to fit A4
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        pdf.addImage(
          canvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          0,
          0,
          imgWidth,
          imgHeight
        );

        setProgress(Math.floor((i + 1) / totalComponents * 100));
      }

      pdf.save('integrated-health-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center relative">
      {/* Download Button */}
      <div className="fixed top-8 z-10 w-full max-w-[210mm] flex justify-center">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className={cn(
            "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-all",
            isGenerating && "opacity-50 cursor-not-allowed"
          )}
        >
          {isGenerating ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>

      {/* Progress Popup */}
      {isGenerating && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-20">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">Generating PDF</h3>
            <p className="text-gray-600 text-sm mb-4">Please wait while we prepare your document...</p>
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{progress}%</p>
          </div>
        </div>
      )}

      {/* Preview Container */}
      <div className="py-24 px-4 w-full flex justify-center">
        <div className="w-[210mm] bg-white shadow-xl" ref={reportRef}>
          <style jsx global>{`
            /* A4 page simulation */
            .page {
              width: 210mm;
              min-height: 297mm;
              background: white;
              position: relative;
              break-after: page;
              page-break-after: always;
              border-bottom: 1px dashed #ccc;
              overflow: hidden;
            }

            /* Component container */
            .component {
              height: auto;
              min-height: 297mm;
              overflow: auto;
              break-inside: auto;
              page-break-inside: auto;
            }

            /* Prevent unwanted breaks */
            .no-break {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            /* Improve text sharpness */
            .text-sharp {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              text-rendering: optimizeLegibility;
            }

            /* Print-specific styles */
            @media print {
              html, body {
                margin: 0;
                padding: 0;
                width: 210mm;
                height: 297mm;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .page {
                margin: 0;
                border: initial;
                width: initial;
                min-height: 297mm;
                max-height: 297mm;
                box-shadow: initial;
                background: initial;
                page-break-after: always;
                page-break-before: auto;
                overflow: hidden;
              }

              .component {
                height: auto;
                min-height: 297mm;
                break-inside: auto;
                page-break-inside: auto;
              }

              .no-break {
                break-inside: avoid;
                page-break-inside: avoid;
              }

              /* Ensure text remains sharp in print */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `}</style>

          {/* Wrap each major section in a page div */}
          <div className="page">
            <img
              src="/FirstPage.svg"
              className="w-full h-full bg-white"
              alt="Trait First Page"
            />
          </div>

          <div className="page">
            <div className="no-break">
              <TraitHealthReportComponent
                personal_info={dynamicData["personal_info"]}
                pageNumber={1}
                total={41}
              />
            </div>
          </div>

          <div className="page">
            <div className="no-break">
              <PreReport
                name={dynamicData["personal_info"]["name"]}
                report_date={dynamicData["personal_info"]["report_date"]}
                pageNumber={2}
                total={41}
              />
            </div>
          </div>

          <div className="page">
            <div className="no-break">
              <TableOfContents
                contentList={contentlist}
                name={dynamicData["personal_info"]["name"]}
                report_date={dynamicData["personal_info"]["report_date"]}
                pageNumber={2}
                total={41}
              />
            </div>
          </div>

          <div className="page">
            <div className="no-break">
              <HealthReportComponent
                name={dynamicData["personal_info"]["name"]}
                report_date={dynamicData["personal_info"]["report_date"]}
                yourData={dynamicData["overall_summary"]["microbiome_analysis"]["yourPie"]}
                normalData={dynamicData["overall_summary"]["microbiome_analysis"]["normalPie"]}
                healthScore={dynamicData["overall_summary"]["body_score"]}
                gutScore={dynamicData["overall_summary"]["biome_score"]}
                barData={
                  dynamicData["overall_summary"]["microbiome_analysis"][
                    "health_overall_metrics"
                  ]
                }
              />
            </div>
          </div>

          <div className="page">
            <div className="no-break">
              <BloodTest
                testData={dynamicData["Tests"][0]["complete_blood_picture"]}
              />
            </div>
          </div>

          <div className="page">
            <div className="no-break">
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
          </div>

          <div className="page">
            <div className="no-break">
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
          </div>

          <div className="page">
            <div className="no-break">
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
          </div>

          <div className="page">
            <div className="no-break">
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
          </div>

          <div className="page">
            <div className="no-break">
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
          </div>

          <div className="page">
            <div className="no-break">
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
          </div>

          <div className="page">
            <div className="no-break">
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
          </div>

          <div className="page">
            <div className="no-break">
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
          </div>

          <div className="page">
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
            <div className="page" key={index}>
              <div className="no-break">
                <MicrobiomeStatic
                  name={dynamicData["personal_info"]["name"]}
                  report_date={dynamicData["personal_info"]["report_date"]}
                  pageNumber={24 + index}
                  total={41}
                  image_url={`/microbiome/image${index + 1}.svg`}
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
            </div>
          ))}

          <div className="page">
            <div className="no-break">
              <Component />
            </div>
          </div>

          <div className="page">
            <div className="no-break">
              <MicrobiomeTemplate
                testData={dynamicData["Tests"][9]["metrics"]}
                pieData={dynamicData["Tests"][9]["yourPie"]}
                normalData={dynamicData["Tests"][9]["normalPie"]}
                balanceRatios={dynamicData["Tests"][9]["balance_ratios"]}
                strainDistribution={dynamicData["Tests"][9]["strain_distribution"]}
                fermicutesStrains={dynamicData["Tests"][9]["fermicutes_strains"]}
                bacteriodetesStrains={dynamicData["Tests"][9]["bacteriodetes_strains"]}
                proteobacteriaStrains={
                  dynamicData["Tests"][9]["proteobacteria_strains"]}
                yeastStrains={dynamicData["Tests"][9]["yeast_strains"]}
                opportunisticStrains={
                  dynamicData["Tests"][9]["opportunistic_strains"]}
              />
            </div>
          </div>

          <div className="page">
            <div className="no-break">
              <Microbiome_interpretation
                image="/zoom-out.svg"
                alt="interpretation"
                title="Microbiome Analysis Interpretation"
                list={dynamicData["interpretations"]}
              />
            </div>
          </div>

          <div className="page">
            <div className="no-break">
              <Disclaimer
                title={"Disclaimer"}
                items={dynamicData["disclaimer"]["items"]}
              />
            </div>
          </div>

          <div className="page">
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

          <div className="page">
            <div className="no-break">
              <Disclaimer
                title={"References"}
                items={dynamicData["references"]["reference_list"]}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IntegratedReport;
