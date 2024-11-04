"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { PieChart, Pie, Cell } from "recharts";

interface testProps {
  name: string;
  value: number;
  unit: string;
  range: [number, number];
  rangeString: string;
}

interface pieProps {
  name: string;
  value: number;
  color: string;
}

interface props {
  testData: testProps[];
  pieData: pieProps[];
  normalData: pieProps[];
}
export default function MicrobiomeTemplate({
  testData,
  pieData,
  normalData,
}: props) {
  return (
    <div className="blood-parameters-container w-[210mm] bg-white px-[48px] pt-[72px]">
      {/* Remove Card wrapper and use direct styling */}
      <div className="blood-parameters-content">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Microbiome Analysis</h1>
        </div>

        {/* Microbiome Intro Section */}
        <div className="section-blood-picture mb-12 break-inside-avoid-page">
          <div className="mb-6 flex items-center">
            <img
              src="/microbiome/report-logo.svg"
              alt="Micro bacteria image"
              className="w-4 h-6 mr-2"
            />
          </div>

          {/* Intro Text */}
          <div className="my-6 break-inside-avoid">
            <p className="text-[10px] text-gray-500">
              <span className="font-bold text-black">What is a phylum?</span> A
              phylum is a major grouping of microorganisms (such as bacteria and
              fungi). It is important to analyze because it gives us a good
              basis for determining overall gut health. The charts below show
              how your phyla compares to people who have a normal balance gut.
            </p>
          </div>

          {/* Pie Charts */}
          <div>
            <Card className="mb-8 rounded-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex">
                  <div className="flex-1 mr-6">
                    <div className="flex justify-around">
                      <div>
                        <h3 className="text-center mb-1 text-[8px]">NORMAL</h3>

                        <PieChart width={75} height={75}>
                          <Pie
                            data={normalData}
                            cx={35}
                            cy={35}
                            innerRadius={0}
                            outerRadius={35}
                            fill="#8884d8"
                            paddingAngle={0}
                            dataKey="value"
                            isAnimationActive={false}
                          >
                            {normalData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry["color"]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </div>

                      <div>
                        <h3 className="text-center mb-1 text-[8px]">YOURS</h3>

                        <PieChart width={75} height={75}>
                          <Pie
                            data={pieData}
                            cx={35}
                            cy={35}
                            innerRadius={0}
                            outerRadius={35}
                            fill="#8884d8"
                            paddingAngle={0}
                            dataKey="value"
                            isAnimationActive={false}
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry["color"]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </div>
                    </div>
                  </div>

                  <div className="w-1/2 ml-6">
                    <h4 className="text-[6px] text-black/50 font-semibold mb-2">
                      BACTERIAL PHYLA KEY
                    </h4>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {pieData.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className="w-3 h-3 mr-2"
                            style={{ backgroundColor: item.color }}
                          />

                          <span className="text-[6px] text-black/50">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* First group of parameters */}
          <div className="parameters-group-1 break-inside-avoid-page">
            <h3 className="text-[10px] font-semibold mb-3 mt-6">
              {" "}
              PHYLLUM BREAKUP
            </h3>
            {testData.slice(0, 5).map((test, index) => (
              <div key={index} className="parameter-item">
                {/* <h3 className="text-lg font-semibold">{test.name}</h3> */}
                <ParameterRow param={test} />
              </div>
            ))}
          </div>

          {/* Balance Ratios*/}
          <div className="parameters-group-1 break-inside-avoid-page">
            <h3 className="text-[10px] font-semibold mb-3 mt-6">
              {" "}
              BALANCE RATIOS
            </h3>
            {testData.slice(5, 7).map((test, index) => (
              <div key={index} className="parameter-item">
                {/* <h3 className="text-lg font-semibold">{test.name}</h3> */}
                <ParameterRow param={test} />
              </div>
            ))}
          </div>

          {/* ACTINOBACTERIA STRAINS */}
          <div className="parameters-group-1 break-inside-avoid-page">
            <h3 className="text-[12px] font-bold mb-3 mt-12">
              {" "}
              Strain wise distribution
            </h3>
            <h3 className="text-[10px] font-semibold mb-3 mt-6">
              {" "}
              ACTINOBACTERIA STRAINS
            </h3>
            {testData.slice(7, 11).map((test, index) => (
              <div key={index} className="parameter-item">
                {/* <h3 className="text-lg font-semibold">{test.name}</h3> */}
                <ParameterRow param={test} />
              </div>
            ))}
          </div>

          {/* Firmicutes Strains */}
          <div className="parameters-group-1 break-inside-avoid-page">
            <h3 className="text-[10px] font-semibold mb-3 mt-6">
              {" "}
              FIRMICUTES STRAINS
            </h3>
            {testData.slice(11, 21).map((test, index) => (
              <div key={index} className="parameter-item">
                {/* <h3 className="text-lg font-semibold">{test.name}</h3> */}
                <ParameterRow param={test} />
              </div>
            ))}
            <p className="text-[9px] text-gray-500 mt-2">
              Firmicutes is one of the most abundant bacterial phyla in the
              human gut microbiota, comprising a diverse range of species. These
              bacteria play pivotal roles in the digestion of dietary fibers,
              production of short-chain fatty acids (SCFAs), and maintaining gut
              health. Some studies suggest a link between the
              Firmicutes-to-Bacteroidetes ratio and obesity, although the
              connection and its implications are still under research. Strains
              within the Firmicutes phylum, such as Lactobacillus and
              Clostridium, have both beneficial and pathogenic members,
              highlighting the complex and multifaceted roles of these bacteria
              in human health
            </p>
          </div>

          {/* Bacteriodetes Strains */}
          <div className="parameters-group-1 break-inside-avoid-page">
            <h3 className="text-[10px] font-semibold mb-3 mt-6">
              {" "}
              BACTERIODETES STRAINS
            </h3>
            {testData.slice(21, 30).map((test, index) => (
              <div key={index} className="parameter-item">
                {/* <h3 className="text-lg font-semibold">{test.name}</h3> */}
                <ParameterRow param={test} />
              </div>
            ))}
            <p className="text-[9px] text-gray-500 mt-2">
              Firmicutes is one of the most abundant bacterial phyla in the
              human gut microbiota, comprising a diverse range of species. These
              bacteria play pivotal roles in the digestion of dietary fibers,
              production of short-chain fatty acids (SCFAs), and maintaining gut
              health. Some studies suggest a link between the
              Firmicutes-to-Bacteroidetes ratio and obesity, although the
              connection and its implications are still under research. Strains
              within the Firmicutes phylum, such as Lactobacillus and
              Clostridium, have both beneficial and pathogenic members,
              highlighting the complex and multifaceted roles of these bacteria
              in human health
            </p>
          </div>

          {/* Proteobacteria Strains group */}
          <div className="parameters-group-3 break-inside-avoid-page mt-8">
            <h3 className="text-[10px] font-semibold mb-3 mt-6">
              {" "}
              PROTEOBACTERIA STRAINS
            </h3>
            {testData.slice(30, 33).map((test, index) => (
              <div key={index} className="parameter-item">
                {/* <h3 className="text-lg font-semibold">{test.name}</h3> */}
                <ParameterRow param={test} />
              </div>
            ))}
          </div>

          {/* YEAST Strains group */}
          <div className="parameters-group-3 break-inside-avoid-page mt-8">
            <h3 className="text-[10px] font-semibold mb-3 mt-6">
              {" "}
              YEAST STRAINS
            </h3>
            {testData.slice(33, 36).map((test, index) => (
              <div key={index} className="parameter-item">
                {/* <h3 className="text-lg font-semibold">{test.name}</h3> */}
                <ParameterRow param={test} />
              </div>
            ))}
          </div>

          {/* OPPORTUNISTIC STRAINS */}
          <div className="parameters-group-3 break-inside-avoid-page mt-8">
            <h3 className="text-[10px] font-semibold mb-3 mt-6">
              {" "}
              YEAST STRAINS
            </h3>
            {testData.slice(36).map((test, index) => (
              <div key={index} className="parameter-item">
                {/* <h3 className="text-lg font-semibold">{test.name}</h3> */}
                <ParameterRow param={test} />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-[7px] text-gray-600 mt-8">
            <p>SONAL CHANDRA | Thursday, August 15, 2024</p>
            <p className="font-bold">24/41</p>
          </div>

          {/* Test Report Declaration */}
          <div>
            <p className="text-[10px] text-gray-500">
              <i>
                Note: The blood parameters testing is powered by our testing
                facility: Previa Labs.
              </i>
            </p>
          </div>
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
    rangeString: string;
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
  // Adjust min if the value goes below the extended range
  const adjustedMin = Math.min(extendedMin, param.value * 0.9); // New line to adjust minimum

  // Calculate positions
  const startPosition =
    (param.range[0] - adjustedMin) / (adjustedMax - adjustedMin);
  const endPosition =
    (param.range[1] - adjustedMin) / (adjustedMax - adjustedMin);
  const valuePosition =
    (param.value - adjustedMin) / (adjustedMax - adjustedMin);

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
        <p className="text-[9px] text-gray-500 mt-2">{`${param.rangeString}`}</p>
      </div>
    </div>
  );
};
