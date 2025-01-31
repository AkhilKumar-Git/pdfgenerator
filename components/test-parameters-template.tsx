"use client";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface contentProps {
  title: string;
  content: ReactNode;
  image_path: string;
  image_alt: string;
}

interface testProps {
  name: string;
  value: number;
  unit: string;
  range: [number, number];
  rangeString: string;
  description?: string;
  your_value: number;
  normal_range: string;
}

interface TestParameterProps {
  testData: testProps[];
  static_text: contentProps;
}

export default function TestParameters({
  testData,
  static_text,
}: {
  testData: any;
  static_text: any;
}) {
  return (
    <div className="flex flex-col w-full">
      {/* First Page */}
      <div className="page component">
        <div className="flex flex-col w-full bg-white px-[48px] pt-[72px] text-sharp">
          <div className="flex items-center gap-4 mb-8 no-break">
            <img src={static_text.image_path} alt={static_text.image_alt} className="w-8 h-8" />
            <h2 className="text-black text-3xl font-semibold text-sharp">{static_text.title}</h2>
          </div>

          <div className="flex flex-col">
            {testData.map((item: any, index: number) => (
              <div key={index} className="no-break">
                <ParameterRow param={item} />
              </div>
            ))}
          </div>

          <div className="mt-8 no-break text-sharp text-lg leading-relaxed">
            {static_text.content}
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
              {param.value}
            </p>
          </div>
          {hasRange && (
            <p className="text-[14px] text-end text-gray-500 mt-2">{param.rangeString}</p>
          )}
        </div>
      </div>
      {param.description && (
        <p className="text-sm text-gray-500 mt-2">{param.description}</p>
      )}
    </div>
  );
};
