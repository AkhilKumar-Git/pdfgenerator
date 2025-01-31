"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface testProps {
  name: string;
  value: number;
  unit: string;
  range: [number, number];
  rangeString: string;
  description?: string;
}

interface props {
  testData: testProps[];
}

interface ParameterRowProps {
  param: {
    name: string;
    value: number;
    unit: string;
    range: [number, number];
    rangeString: string;
    description?: string;
  };
}

const ParameterRow: React.FC<ParameterRowProps> = ({ param }) => {
  const isOutOfRange = param.value < param.range[0] || param.value > param.range[1];
  const hasRange = param.range.length > 0;
  const rangeWidth = hasRange ? param.range[1] - param.range[0] : 0;
  const extendedMin = hasRange ? param.range[0] - rangeWidth : 0;
  const extendedMax = hasRange ? param.range[1] + rangeWidth : 0;
  const adjustedMax = hasRange ? Math.max(extendedMax, param.value * 1.1) : param.value;
  const startPosition = hasRange ? ((param.range[0] - extendedMin) / (adjustedMax - extendedMin)) : 0;
  const endPosition = hasRange ? ((param.range[1] - extendedMin) / (adjustedMax - extendedMin)) : 0;
  const valuePosition = hasRange ? ((param.value - extendedMin) / (adjustedMax - extendedMin)) : 0;

  return (
    <div className="parameter-row no-break mb-4">
      <div className="flex items-center justify-between">
        <div className="w-1/3">
          <p className="font-bold text-base">{param.name}</p>
          <p className="text-sm text-gray-500">{param.unit}</p>
        </div>
        {hasRange ? (
          <div className="w-1/3 relative h-[2px] bg-score-f2 rounded-full flex items-center">
            <div className="absolute left-0 right-0 h-full">
              <div
                className="absolute h-full rounded-full"
                style={{
                  left: `${startPosition * 100}%`,
                  right: `${(1 - endPosition) * 100}%`,
                }}
              ></div>
            </div>
            <div
              className="absolute w-0.5 h-0.5 rounded-full bg-gray-400"
              style={{ left: `${startPosition * 100}%`, top: '-4px' }}
            ></div>
            <div
              className="absolute w-0.5 h-0.5 rounded-full bg-gray-400"
              style={{ left: `${startPosition * 100}%`, top: '4px' }}
            ></div>
            <div
              className="absolute w-0.5 h-0.5 rounded-full bg-gray-400"
              style={{ left: `${endPosition * 100}%`, top: '-4px' }}
            ></div>
            <div
              className="absolute w-0.5 h-0.5 rounded-full bg-gray-400"
              style={{ left: `${endPosition * 100}%`, top: '4px' }}
            ></div>
            <div
              className={cn(
                "absolute w-1 h-3 rounded-full top-1/2 -translate-y-1/2 shadow-md",
                isOutOfRange ? "bg-[#FC4F64]" : "bg-[#333333]"
              )}
              style={{ left: `${valuePosition * 100}%` }}
            ></div>
          </div>
        ) : (
          <div className="w-1/3" />
        )}
        <div className="w-1/4 text-right flex flex-col">
          <p
            className={`text-sm ${isOutOfRange ? "font-semibold" : ""}`}
          >
            {param.value}
          </p>
          <p className="text-xs text-gray-500">{param.rangeString}</p>
        </div>
      </div>
      {param.description && (
        <p className="text-xs text-gray-500 mt-1">{param.description}</p>
      )}
    </div>
  );
};

export default function BloodTest({ testData }: props) {
  return (
    <div className="flex flex-col w-full">
      {/* First Page */}
      <div className="page component">
        <div className="px-[48px] pt-[72px] text-sharp">
          <h1 className="text-3xl font-bold mb-8 text-sharp">Blood Parameters</h1>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4 text-sharp">Complete Blood Picture</h2>
            <div className="mb-6">
              <img
                src="/blood_drop.png"
                alt="Blood test Logo"
                className="w-4 h-6"
              />
            </div>
          </div>

          {/* First group of parameters */}
          <div className="parameters-group">
            {testData.slice(0, 8).map((item: any, index: number) => (
              <ParameterRow key={index} param={item} />
            ))}
          </div>

          {/* Differential count group */}
          <div className="parameters-group mt-8">
            <h3 className="text-[14px] font-semibold mb-3 text-sharp">
              DIFFERENTIAL COUNT
            </h3>
            {testData.slice(8).map((item: any, index: number) => (
              <ParameterRow key={index} param={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Second Page */}
      <div className="page component">
        <div className="px-[48px] pt-[72px] text-sharp">
          {/* Peripheral Smear Section */}
          <div className="mb-8">
            <h3 className="text-base font-semibold mb-3 text-sharp">
              PERIPHERAL SMEAR EXAMINATION
            </h3>
            <div className="text-[14px] text-sharp">
              <div className="flex justify-between mb-2">
                <span>RBC</span>
                <span>Normocytic Normochromic</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>WBC</span>
                <span>Total count normal in number with normal morphology and distribution</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Platelets</span>
                <span>Normal in number with normal morphology</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Haemoparasites</span>
                <span>Not seen</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Impression</span>
                <span>NORMOCYTIC NORMOCHROMIC BLOOD PICTURE WITH EOSINOPHILIA</span>
              </div>
            </div>
          </div>

          {/* Blood Grouping Section */}
          <div className="mb-8">
            <h3 className="text-base font-semibold mb-3 text-sharp">
              BLOOD GROUPING & RH TYPING
            </h3>
            <div className="text-[14px] text-sharp">
              <div className="flex justify-between mb-2">
                <span>Blood Group (A,B,O)</span>
                <span>AB</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Rh Factor</span>
                <span>Positive</span>
              </div>
            </div>
          </div>

          {/* Method Section */}
          <div className="mb-8">
            <p className="text-xs text-gray-500 italic text-sharp">
              Method: Fully automated hematology analyser (Mindray BC-6800),(Photometric, Electrical impedance, VCS Technology, Leishman Stain and Microscopy)
            </p>
            <p className="text-xs text-gray-500 italic text-sharp">
              Reference: Dacie and Lewis Practical Hematology,12th Edition
            </p>
          </div>

          {/* Why Test Important Section */}
          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2 text-sharp">
              Why is this test important?
            </h3>
            <div className="text-xs text-gray-500 text-sharp">
              <p className="mb-2">
                The Complete Blood Picture (CBP), also known as the Complete Blood Count (CBC), is a panel of blood tests that provide comprehensive insights into a person's overall health and functioning of their blood cells. This panel assesses various components of blood, including red blood cells (RBCs), white blood cells (WBCs), and platelets, along with additional parameters. Here's why these tests, when collectively considered as a panel, are important:
              </p>
              <ul className="list-disc pl-4 space-y-2">
                <li>
                  <span className="font-bold text-black text-base">Hemoglobin:</span> Hemoglobin measures the oxygen-carrying capacity of the blood. Abnormal levels can indicate anemia or other health issues.
                </li>
                <li>
                  <span className="font-bold text-black text-base">RBC Count:</span> This count indicates the number of red blood cells. Abnormalities may suggest conditions such as anemia or dehydration.
                </li>
                <li>
                  <span className="font-bold text-black text-base">WBC Count:</span> White blood cells are crucial for the immune system. Abnormal counts can indicate infections or immune disorders.
                </li>
                <li>
                  <span className="font-bold text-black text-base">Platelet Count:</span> Platelets are essential for blood clotting. Abnormal counts might lead to bleeding or clotting problems.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// New components
function PeripheralSmearExamination() {
  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold mb-3 mt-6">
        PERIPHERAL SMEAR EXAMINATION
      </h3>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="font-bold w-[200px] text-sm">RBC</td>
            <td className="text-xs">Normocytic Normochromic</td>
          </tr>
          <tr>
            <td className="font-bold text-sm">WBC</td>
            <td className="text-xs">
              Total count normal in number with normal morphology and
              distribution
            </td>
          </tr>
          <tr>
            <td className="font-bold text-sm">Platelets</td>
            <td className="text-xs">Normal in number with normal morphology</td>
          </tr>
          <tr>
            <td className="font-bold text-sm">Haemoparasites</td>
            <td className="text-xs">Not seen</td>
          </tr>
          <tr>
            <td className="font-bold text-sm">Impression</td>
            <td className="text-xs">
              NORMOCYTIC NORMOCHROMIC BLOOD PICTURE WITH EOSINOPHILIA.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BloodGroupingAndRHTyping() {
  return (
    <div className="mt-6 break-inside-avoid">
      <h3 className="text-base font-semibold mb-3 mt-4">
        BLOOD GROUPING & RH TYPING
      </h3>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="font-bold text-sm">Blood Group (A,B,O)</td>
            <td className="text-xs">AB</td>
          </tr>
          <tr>
            <td className="font-bold text-sm">Rh Factor</td>
            <td className="text-xs">Positive</td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs italic text-gray-500 mt-2">
        Method: Fully automated haematology analyzer (Mindray BC-6800)
        (Photometric, Electrical Impedance, VCS Technology, Leishman&apos;s
        Stain and Microscopy).
        <br />
        Reference: Dacie and Lewis Practical Hematology,12th Edition
      </p>
    </div>
  );
}

function WhyTestImportant() {
  return (
    <div className="mt-6 break-inside-avoid">
      <h3 className="text-base font-semibold mb-2">
        Why is this test important?
      </h3>
      <p className="text-xs text-gray-500">
        The Complete Blood Picture (CBP), also known as the Complete Blood Count
        (CBC), is a panel of blood tests that provide comprehensive insights
        into a person&apos;s overall health and the functioning of their blood
        cells. This panel assesses various components of blood, including red
        blood cells (RBCs), white blood cells (WBCs), and platelets, along with
        additional parameters. Here&apos;s why these tests, when collectively
        considered as a panel, are important:
      </p>
      <ul className="list-disc list-inside text-xs text-gray-500">
        <li>
          <span className="font-bold text-base">Hemoglobin:</span> Hemoglobin measures the
          oxygen-carrying capacity of the blood. Abnormal levels can indicate
          anemia or other health issues.
        </li>
        <li>
          <span className="font-bold text-base">RBC Count:</span> This count indicates the
          number of red blood cells. Abnormalities may suggest conditions such
          as anemia or dehydration.
        </li>
        <li>
          <span className="font-bold text-base">WBC Count:</span> White blood cells are
          crucial for the immune system. Abnormal counts can indicate infections
          or immune disorders.
        </li>
        <li>
          <span className="font-bold text-base">Platelet Count:</span> Platelets are
          essential for blood clotting. Abnormal counts might lead to bleeding
          or clotting problems.
        </li>
        <li>
          <span className="font-bold text-base">PCV/HCT: </span>The hematocrit measures
          the volume of red blood cells in the blood. It helps diagnose anemia
          and dehydration.
        </li>
        <li>
          <span className="font-bold text-base">MCV, MCH, MCHC:</span> These parameters
          provide insights into the size and content of red blood cells, helping
          diagnose different types of anemia.
        </li>
        <li>
          <span className="font-bold text-base">Differential Count:</span> This assesses
          the different types of white blood cells, aiding in diagnosing
          infections, allergies, and other conditions.
        </li>
        <li>
          <span className="font-bold text-base">Peripheral Smear:</span> Microscopic
          examination of blood cells helps detect abnormalities in their shape
          and size.
        </li>
        <li>
          RBC and WBC Descriptions: These describe the appearance and
          distribution of red and white blood cells, helping diagnose certain
          conditions.
        </li>
      </ul>
      <p className="text-xs text-gray-500 mb-10">
        Collectively, the CBP helps identify conditions like anemia, infections,
        bleeding disorders, and more. Its a crucial tool for diagnosing and
        monitoring various medical conditions. Interpretation of the panel,
        combined with clinical information, guides medical decisions and
        treatment plans.
      </p>
      <p className="text-xs text-gray-500">
        <i>
          Note: The blood parameters testing is powered by our testing facility:
          Previa Labs.
        </i>
      </p>
    </div>
  );
}
