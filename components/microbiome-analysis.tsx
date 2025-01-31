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
  static : string
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
  balanceRatios?: any[];
  strainDistribution?: any[];
  fermicutesStrains?: any[];
  bacteriodetesStrains?: any[];
  proteobacteriaStrains?: any[];
  yeastStrains?: any[];
  opportunisticStrains?: any[];
}

export default function MicrobiomeTemplate({
  testData,
  pieData,
  normalData,
  balanceRatios,
  strainDistribution,
  fermicutesStrains,
  bacteriodetesStrains,
  proteobacteriaStrains,
  yeastStrains,
  opportunisticStrains,
}: props) {
  return (
    <div className="flex flex-col w-full">
      {/* Page 1: Phylum Breakup */}
      <div className="page component">
        <div className="px-[48px] pt-[72px] text-sharp">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-sharp">Microbiome Analysis</h1>
          </div>

          <div className="section-microbiome">
            <div className="mb-6 flex items-center">
              <img
                src="/microbiome/report-logo.svg"
                alt="Micro bacteria image"
                className="w-8 h-68 mr-2"
              />
            </div>

            <div className="my-6">
              <p className="text-base text-gray-500 text-sharp">
                <span className="font-bold text-black text-base">What is a phylum?</span> A
                phylum is a major grouping of microorganisms (such as bacteria and
                fungi). It is important to analyze because it gives us a good
                basis for determining overall gut health. The charts below show
                how your phyla compares to people who have a normal balance gut.
              </p>
            </div>

            <Card className="mb-8 rounded-xl shadow-lg">
              <CardContent className="p-8">
                <div className="flex justify-around items-center">
                  <div className="text-center">
                    <h3 className="mb-4 text-base font-semibold text-sharp">NORMAL</h3>
                    <PieChart width={200} height={200}>
                      <Pie
                        data={normalData}
                        cx={100}
                        cy={100}
                        innerRadius={0}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {normalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>

                  <div className="text-center">
                    <h3 className="mb-4 text-base font-semibold text-sharp">YOURS</h3>
                    <PieChart width={200} height={200}>
                      <Pie
                        data={pieData}
                        cx={100}
                        cy={100}
                        innerRadius={0}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-base font-semibold mb-4 text-sharp">BACTERIAL PHYLA KEY</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-sm mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="phylum-breakup">
              <h2 className="text-xl font-bold mb-4">PHYLLUM BREAKUP</h2>
              {testData && testData.map((param, index) => (
                <ParameterRow key={index} param={param} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page 2: Balance Ratios and Strain Distribution */}
      <div className="page component">
        <div className="px-[48px] pt-[72px] text-sharp">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6">BALANCE RATIOS</h2>
            {balanceRatios && balanceRatios.map((param, index) => (
              <ParameterRow key={index} param={param} />
            ))}
          </div>
          
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Strain wise distribution</h2>
            <h3 className="text-base font-light mb-3">ACTINOBACTERIA STRAINS</h3>
            {strainDistribution && strainDistribution.map((param, index) => (
              <ParameterRow key={index} param={param} />
            ))}
          </div>
        </div>
      </div>

      {/* Page 3: Fermicutes Strains */}
      <div className="page component">
        <div className="px-[48px] pt-[72px] text-sharp">
          <h2 className="text-base font-light mb-6">FERMICUTES STRAINS</h2>
          {fermicutesStrains && fermicutesStrains.map((param, index) => (
            <ParameterRow key={index} param={param} />
          ))}
        </div>
      </div>

      {/* Page 4: Bacteriodetes Strains */}
      <div className="page component">
        <div className="px-[48px] pt-[72px] text-sharp">
          <h2 className="text-base font-light mb-6">BACTERIODETES STRAINS</h2>
          {bacteriodetesStrains && bacteriodetesStrains.map((param, index) => (
            <ParameterRow key={index} param={param} />
          ))}
        </div>
        <div className="px-[48px] pt-[72px] text-sharp">
          <h2 className="text-base font-light mb-6">PROTEOBACTERIA STRAINS</h2>
          {proteobacteriaStrains && proteobacteriaStrains.map((param, index) => (
            <ParameterRow key={index} param={param} />
          ))}
        </div>
      </div>

      {/* Page 5: Yeast and Opportunistic Strains */}
      <div className="page component">
        <div className="px-[48px] pt-[72px] text-sharp">
          <h2 className="text-base font-light mb-6">YEAST STRAINS</h2>
          {yeastStrains && yeastStrains.map((param, index) => (
            <ParameterRow key={index} param={param} />
          ))}
        </div>
        <div className="px-[48px] pt-[72px] text-sharp">
          <h2 className="text-base font-light mb-6">OPPORTUNISTIC STRAINS</h2>
          {opportunisticStrains && opportunisticStrains.map((param, index) => (
            <ParameterRow key={index} param={param} />
          ))}
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
    static : string
  };
}

const ParameterRow: React.FC<ParameterRowProps> = ({ param }) => {
  const paramValue = param.value ?? 0; // Default to 0 if value is null or undefined
  const isOutOfRange = paramValue < param.range[0] || paramValue > param.range[1];
  const hasRange = param.range.length > 0;
  const rangeWidth = hasRange ? param.range[1] - param.range[0] : 0;
  const extendedMin = hasRange ? param.range[0] - rangeWidth : 0;
  const extendedMax = hasRange ? param.range[1] + rangeWidth : 0;
  const adjustedMax = hasRange ? Math.max(extendedMax, paramValue * 1.1) : paramValue;
  const startPosition = hasRange ? ((param.range[0] - extendedMin) / (adjustedMax - extendedMin)) : 0;
  const endPosition = hasRange ? ((param.range[1] - extendedMin) / (adjustedMax - extendedMin)) : 0;
  const valuePosition = hasRange ? ((paramValue - extendedMin) / (adjustedMax - extendedMin)) : 0;

  return (
    <div className="parameter-row no-break mb-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center h-[24px]">
            <p className="font-bold text-base">{param.name}</p>
          </div>
          <p className="text-[14px] text-gray-500 mt-2">{param.unit}</p>
        </div>
        {hasRange ? (
          <div className="flex flex-col">
            <div className="relative h-[2px] bg-score-f2 rounded-full flex items-center mt-[12px]">
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
                style={{ left: `${startPosition * 100}%`, top: '-2px' }}
              ></div>
              <div
                className="absolute w-0.5 h-0.5 rounded-full bg-gray-400"
                style={{ left: `${startPosition * 100}%`, top: '2px' }}
              ></div>
              <div
                className="absolute w-0.5 h-0.5 rounded-full bg-gray-400"
                style={{ left: `${endPosition * 100}%`, top: '-2px' }}
              ></div>
              <div
                className="absolute w-0.5 h-0.5 rounded-full bg-gray-400"
                style={{ left: `${endPosition * 100}%`, top: '2px' }}
              ></div>
              <div
                className={cn(
                  "absolute w-1 h-3 rounded-full top-1/2 -translate-y-1/2 shadow-md",
                  isOutOfRange ? "bg-[#FC4F64]" : "bg-[#333333]"
                )}
                style={{ left: `${valuePosition * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col" />
        )}
        <div className="flex flex-col items-end">
          <div className="flex items-center h-[24px]">
            <p
              className={`text-base ${isOutOfRange ? "font-semibold" : ""}`}
            >
              {paramValue}
            </p>
          </div>
          {hasRange && (
            <p className="text-[14px] text-end text-gray-500 mt-2">{param.rangeString}</p>
          )}
        </div>
      </div>
      {param.static && (
        <p className="text-lg text-gray-500 mt-2">{param.static}</p>
      )}
    </div>
  );
};
