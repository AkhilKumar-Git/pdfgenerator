"use client";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface contentProps {
  title: string;
  content: ReactNode;
  image_path: string;
  image_alt: string;
}

interface TestParameterProps {
  testData: any;
  static_text: contentProps;
}

export default function TestParameters({
  testData,
  static_text,
}: TestParameterProps) {
  return (
    <div className="blood-parameters-container w-[210mm] bg-white px-[48px] pt-[72px]">
      {/* Remove Card wrapper and use direct styling */}
      <div className="blood-parameters-content">
        {/* Header */}
        <div className="mb-8">
          {/* <h1 className="text-2xl font-bold">{static_text.title}</h1> */}
        </div>

        {/* Complete Blood Picture Section */}
        <div className="section-blood-picture mb-12 break-inside-avoid-page">
          <h2 className="text-sm font-semibold mb-4">{static_text.title}</h2>
          <div className="mb-6 flex items-center">
            <img
              src={static_text.image_path}
              alt={static_text.image_alt}
              className="w-4 h-6 mr-2"
            />
          </div>

          {/* First group of parameters */}
          <div className="parameters-group-1 break-inside-avoid-page">
            {testData.map((test, index) => (
              <div key={index} className="parameter-item">
                {/* <h3 className="text-lg font-semibold">{test.name}</h3> */}
                <ParameterRow param={test} />
              </div>
            ))}
          </div>

          {/* Why Test Important Section */}
          <div className="section-why-important break-inside-avoid-page mt-8">
            {static_text.content}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-[7px] text-gray-600 mt-8">
            <p>SONAL CHANDRA | Thursday, August 15, 2024</p>
            <p className="font-bold">24/41</p>
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
    description?: string;
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
    <div>
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
          <p className="text-[9px] text-gray-500">{`${param.rangeString}`}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500">{param.description}</p>
    </div>
  );
};
