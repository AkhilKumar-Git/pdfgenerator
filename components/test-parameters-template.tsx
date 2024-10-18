"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const bloodData = [
  { name: "Hemoglobin", value: 15.9, unit: "g/dL", range: [12, 15] },
  { name: "Total RBC Count", value: 4.91, unit: "Mlns/cmm", range: [3.8, 4.8] },
  {
    name: "Total WBC Count",
    value: 9130,
    unit: "cells/cmm",
    range: [4000, 10000],
  },
  { name: "Platelet Count", value: 2.89, unit: "lakhs/cmm", range: [1.5, 4.1] },
  { name: "PCV/HCT", value: 47, unit: "%", range: [36, 46] },
  { name: "MCV", value: 95.8, unit: "fL", range: [83, 101] },
  { name: "MCH", value: 32.5, unit: "pg", range: [27, 32] },
  { name: "MCHC", value: 33.8, unit: "g/dL", range: [31.5, 34.5] },
  {
    name: "Erytrocyte Sedimenation Rate (ESR)",
    value: 2,
    unit: "mm/hr",
    range: [0, 30],
  },
  { name: "Neutrophils", value: 59, unit: "%", range: [40, 80] },
  { name: "Lymphocytes", value: 22.4, unit: "%", range: [20, 40] },
  { name: "Eosinophils", value: 13.4, unit: "%", range: [1, 6] },
  { name: "Monocytes", value: 4.6, unit: "%", range: [2, 10] },
];

export default function TestParameters() {
  // const [dynamicData, setDynamicData] = useState(null);

  // useEffect(() => {
  //   const fetchDynamicData = async () => {
  //     try {
  //       const response = await fetch("/api/dynamicData.json");
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log(data);
  //       setDynamicData(data);
  //     } catch (error) {
  //       console.error("Failed to fetch dynamic data:", error);
  //     }
  //   };

  //   fetchDynamicData();
  // }, []);

  // if (!dynamicData) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="blood-parameters-container w-[210mm] min-h-[297mm] bg-white px-[48px] pt-[72px]">
      <Card className="blood-parameters-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Blood Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-sm font-semibold mb-4">Complete Blood Picture</h2>
          <div className="mb-6 flex items-center">
            <img
              src="/blood_drop.png"
              alt="Blood drop"
              className="w-4 h-6 mr-2"
            />
          </div>
          {bloodData.map((test, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold">{test.name}</h3>
              <ParameterRow key={index} param={test} />
            </div>
          ))}

          {/* New sections */}

          <PeripheralSmearExamination />
          <BloodGroupingAndRHTyping />
          <WhyTestImportant />

          <div className="flex justify-between items-center text-[7px] text-gray-600 mt-2">
            <p>SONAL CHANDRA | Thursday, August 15, 2024</p>
            <p className="font-bold">24/41</p>
          </div>
        </CardContent>
      </Card>
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
    <div className="mt-6">
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
    <div className="mt-6">
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
      </ul>
    </div>
  );
}
