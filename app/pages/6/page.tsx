"use client";

import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { PieChart, Pie, Cell } from "recharts";

// Dummy data for microbiome analysis
const microbiomeData = {
  date: "15 Aug 2024",
  pieData: [
    { name: "BACTEROIDETES", value: 56.77, color: "#10D3E4" },
    { name: "FIRMICUTES", value: 35.21, color: "#F8F58A" },
    { name: "PROTEOBACTERIA", value: 4.49, color: "#A480B1" },
    { name: "ACTINOBACTERIA", value: 1.66, color: "#16354B" },
    { name: "OTHERS", value: 1.86, color: "#E9AC9C" },
  ],
  metrics: [
    {
      name: "Bacteroidetes Total (saliva/stool)",
      value: 56.77,
      range: [73.13, 22.16],
    },
    { name: "Firmicutes total (stool)", value: 35.21, range: [22.2, 18.66] },
    { name: "Proteobacteria Total", value: 4.49, range: [2.15, 10.39] },
    { name: "Others Total", value: 1.86, range: [0.07, 4.6] },
    {
      name: "Actinobacteria Total (saliva/stool)",
      value: 1.66,
      range: [1.82, 3],
    },
  ],
};

export default function MicrobiomeAnalysis() {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white px-[48px] pt-[72px]">
      <h2 className="text-gray-500 mb-2">Microbiome Analysis on</h2>
      <h1 className="text-4xl font-bold mb-6">{microbiomeData.date}</h1>

      <h2 className="text-xl font-bold mb-4">Bacterial Phyla Comparison</h2>
      <Card className="mb-6 rounded-xl shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-around">
            <div>
              <h3 className="text-center mb-2">NORMAL</h3>
              <PieChart width={200} height={200}>
                <Pie
                  data={microbiomeData.pieData}
                  cx={100}
                  cy={100}
                  innerRadius={0}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {microbiomeData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div>
              <h3 className="text-center mb-2">YOURS</h3>
              <PieChart width={200} height={200}>
                <Pie
                  data={microbiomeData.pieData}
                  cx={100}
                  cy={100}
                  innerRadius={0}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {microbiomeData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Phylum Breakup</h2>
      {microbiomeData.metrics.map((metric, index) => (
        <ParameterRow key={index} param={metric} />
      ))}
    </div>
  );
}

interface ParameterRowProps {
  param: {
    name: string;
    value: number;
    range: [number, number];
  };
}

const ParameterRow: React.FC<ParameterRowProps> = ({ param }) => {
  const isOutOfRange =
    param.value < param.range[0] || param.value > param.range[1];
  const sliderPosition =
    (param.value - param.range[0]) / (param.range[1] - param.range[0]);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="w-1/3">
        <p className="font-medium">{param.name}</p>
      </div>
      <div className="w-1/3 relative h-1 bg-gray-200 rounded-full flex items-center">
        <div
          className={`absolute w-1 h-3 rounded-full top-1/2 -translate-y-1/2 ${
            isOutOfRange ? "bg-[#FC4F64]" : "bg-[#333333]"
          }`}
          style={{ left: `${sliderPosition * 100}%` }}
        ></div>
      </div>
      <div className="w-1/6 text-right">
        <p className={`font-medium ${isOutOfRange && "font-bold"}`}>
          {param.value}
        </p>
        <p className="text-sm text-gray-500">{`${param.range[0]} - ${param.range[1]}`}</p>
      </div>
    </div>
  );
};
