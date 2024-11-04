"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface testProps {
  name: string;
  value: number;
  unit: string;
  range: [number, number];
  rangeString: string;
}

interface props {
  testData: testProps[];
}

export default function BloodTest({ testData }: props) {
  return (
    <div className="blood-parameters-container w-[210mm] bg-white px-[48px] pt-[72px]">
      {/* Remove Card wrapper and use direct styling */}
      <div className="blood-parameters-content">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Urine Examination</h1>
        </div>

        {/* Complete Blood Picture Section */}
        <div className="section-blood-picture mb-12 break-inside-avoid-page">
          <h2 className="text-sm font-semibold mb-4">
            Complete Urine Examination (CUE) - Urine
          </h2>
          <div className="mb-6 flex items-center">
            <img
              src="/blood_drop.png"
              alt="Blood drop"
              className="w-4 h-6 mr-2"
            />
          </div>

          {/* First group of parameters */}
          <div className="parameters-group-1 break-inside-avoid-page">
            {testData.slice(0, 5).map((test, index) => (
              <div key={index} className="parameter-item">
                {/* <h3 className="text-lg font-semibold">{test.name}</h3> */}
                <ParameterRow param={test} />
              </div>
            ))}
          </div>

          {/* Second group of parameters */}
          <div className="parameters-group-2 break-inside-avoid-page">
            {testData.slice(5, 9).map((test, index) => (
              <div key={index} className="parameter-item">
                {/* <h3 className="text-lg font-semibold">{test.name}</h3> */}
                <ParameterRow param={test} />
              </div>
            ))}
          </div>

          {/* Differential count group */}
          <div className="parameters-group-3 break-inside-avoid-page mt-8">
            <h3 className="text-[10px] font-semibold mb-3 mt-6">
              {" "}
              DIFFERENTIAL COUNT
            </h3>
            {testData.slice(9).map((test, index) => (
              <div key={index} className="parameter-item">
                {/* <h3 className="text-lg font-semibold">{test.name}</h3> */}
                <ParameterRow param={test} />
              </div>
            ))}
          </div>
        </div>

        {/* Peripheral Smear Section */}
        <div className="section-peripheral-smear break-inside-avoid-page mt-8">
          <PeripheralSmearExamination />
        </div>

        {/* Blood Grouping Section */}
        <div className="section-blood-grouping break-inside-avoid-page mt-8">
          <BloodGroupingAndRHTyping />
        </div>

        {/* Why Test Important Section */}
        <div className="section-why-important break-inside-avoid-page mt-8">
          <WhyTestImportant />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[7px] text-gray-600 mt-8">
          <p>SONAL CHANDRA | Thursday, August 15, 2024</p>
          <p className="font-bold">24/41</p>
        </div>
      </div>
    </div>
  );
}

interface ParameterRowProps {
  param: {
    name: string;
    value: number;
    unit: string;
    range: [number, number];
  };
}

const ParameterRow: React.FC<ParameterRowProps> = ({ param }) => {
  const isOutOfRange =
    param.value < param.range[0] || param.value > param.range[1];

  // Calculate the extended range
  const rangeWidth = param.range[1] - param.range[0];
  const extendedMin = param.range[0] - rangeWidth;
  const extendedMax = param.range[1] + rangeWidth;

  // Adjust max if the value exceeds the extended range
  const adjustedMax = Math.max(extendedMax, param.value * 1.1);

  // Calculate positions
  const startPosition =
    (param.range[0] - extendedMin) / (adjustedMax - extendedMin);
  const endPosition =
    (param.range[1] - extendedMin) / (adjustedMax - extendedMin);
  const valuePosition =
    (param.value - extendedMin) / (adjustedMax - extendedMin);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="w-1/3">
        <p className="font-bold text-[11px]">{param.name}</p>
        <p className="text-[9px] text-gray-500">{param.unit}</p>
      </div>
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
        <div className="absolute left-0 right-0 px-2 text-xs text-gray-400">
          <span
            className="absolute font-semibold"
            style={{ left: `${startPosition * 100}%` }}
          >
            :
          </span>
          <span
            className="relative font-semibold"
            style={{ left: `${endPosition * 100}%` }}
          >
            :
          </span>
        </div>
        <div
          className={cn(
            "absolute w-1 h-3 rounded-full top-1/2 -translate-y-1/2 shadow-md",
            isOutOfRange ? "bg-[#FC4F64]" : "bg-[#333333]"
          )}
          style={{ left: `${valuePosition * 100}%` }}
        ></div>
      </div>
      <div className="w-1/6 text-right">
        <p className={cn("font-medium text-xs", isOutOfRange && "font-bold")}>
          {param.value}
        </p>
        <p className="text-[9px] text-gray-500">{`${param.range[0]} - ${param.range[1]}`}</p>
      </div>
    </div>
  );
};

// New components
function PeripheralSmearExamination() {
  return (
    <div className="mt-6">
      <h3 className="text-[10px] font-semibold mb-3 mt-6">
        PERIPHERAL SMEAR EXAMINATION
      </h3>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="font-bold w-[200px] text-[11px]">RBC</td>
            <td className="text-xs">Normocytic Normochromic</td>
          </tr>
          <tr>
            <td className="font-bold text-[11px]">WBC</td>
            <td className="text-xs">
              Total count normal in number with normal morphology and
              distribution
            </td>
          </tr>
          <tr>
            <td className="font-bold text-[11px]">Platelets</td>
            <td className="text-xs">Normal in number with normal morphology</td>
          </tr>
          <tr>
            <td className="font-bold text-[11px]">Haemoparasites</td>
            <td className="text-xs">Not seen</td>
          </tr>
          <tr>
            <td className="font-bold text-[11px]">Impression</td>
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
      <h3 className="text-[10px] font-semibold mb-3 mt-4">
        BLOOD GROUPING & RH TYPING
      </h3>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="font-bold text-[11px]">Blood Group (A,B,O)</td>
            <td className="text-xs">AB</td>
          </tr>
          <tr>
            <td className="font-bold text-[11px]">Rh Factor</td>
            <td className="text-xs">Positive</td>
          </tr>
        </tbody>
      </table>
      <p className="text-[8px] italic text-gray-500 mt-2">
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
      <h3 className="text-[11px] font-semibold mb-2">
        Why is this test important?
      </h3>
      <p className="text-[10px] text-gray-500">
        The Complete Blood Picture (CBP), also known as the Complete Blood Count
        (CBC), is a panel of blood tests that provide comprehensive insights
        into a person&apos;s overall health and the functioning of their blood
        cells. This panel assesses various components of blood, including red
        blood cells (RBCs), white blood cells (WBCs), and platelets, along with
        additional parameters. Here&apos;s why these tests, when collectively
        considered as a panel, are important:
      </p>
      <ul className="list-disc list-inside text-[10px] text-gray-500">
        <li>
          <span className="font-bold">Hemoglobin:</span> Hemoglobin measures the
          oxygen-carrying capacity of the blood. Abnormal levels can indicate
          anemia or other health issues.
        </li>
        <li>
          <span className="font-bold">RBC Count:</span> This count indicates the
          number of red blood cells. Abnormalities may suggest conditions such
          as anemia or dehydration.
        </li>
        <li>
          <span className="font-bold">WBC Count:</span> White blood cells are
          crucial for the immune system. Abnormal counts can indicate infections
          or immune disorders.
        </li>
        <li>
          <span className="font-bold">Platelet Count:</span> Platelets are
          essential for blood clotting. Abnormal counts might lead to bleeding
          or clotting problems.
        </li>
        <li>
          <span className="font-bold">PCV/HCT: </span>The hematocrit measures
          the volume of red blood cells in the blood. It helps diagnose anemia
          and dehydration.
        </li>
        <li>
          <span className="font-bold">MCV, MCH, MCHC:</span> These parameters
          provide insights into the size and content of red blood cells, helping
          diagnose different types of anemia.
        </li>
        <li>
          <span className="font-bold">Differential Count:</span> This assesses
          the different types of white blood cells, aiding in diagnosing
          infections, allergies, and other conditions.
        </li>
        <li>
          <span className="font-bold">Peripheral Smear:</span> Microscopic
          examination of blood cells helps detect abnormalities in their shape
          and size.
        </li>
        <li>
          RBC and WBC Descriptions: These describe the appearance and
          distribution of red and white blood cells, helping diagnose certain
          conditions.
        </li>
      </ul>
      <p className="text-[10px] text-gray-500 mb-10">
        Collectively, the CBP helps identify conditions like anemia, infections,
        bleeding disorders, and more. Its a crucial tool for diagnosing and
        monitoring various medical conditions. Interpretation of the panel,
        combined with clinical information, guides medical decisions and
        treatment plans.
      </p>
      <p className="text-[10px] text-gray-500">
        <i>
          Note: The blood parameters testing is powered by our testing facility:
          Previa Labs.
        </i>
      </p>
    </div>
  );
}
