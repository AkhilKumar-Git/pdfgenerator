"use client";
import React from "react";

interface UrineTestProps {
  testData: {
    name: string;
    value: string;
    normalRange?: string;
  }[];
}

export default function UrineTest({ testData }: UrineTestProps) {
  return (
    <div className="flex flex-col w-full">
      {/* First Page */}
      <div className="page component">
        <div className="px-[48px] pt-[72px] text-sharp">
          <h1 className="text-2xl font-bold mb-8 text-sharp">Urine Analysis</h1>
          
          <div className="mb-4 no-break">
            <h2 className="text-sm font-semibold mb-4 text-sharp">Physical Examination</h2>
            <div className="mb-6">
              <img
                src="/urine_test.png"
                alt="Urine Test Logo"
                className="w-4 h-6"
              />
            </div>
          </div>

          {/* Parameters */}
          <div className="parameters-group no-break">
            {testData.map((item, index) => (
              <div key={index} className="flex justify-between mb-4 text-[11px]">
                <span className="font-semibold">{item.name}</span>
                <div className="flex gap-4">
                  <span>{item.value}</span>
                  {item.normalRange && (
                    <span className="text-gray-500">({item.normalRange})</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Method Section */}
          <div className="mt-8 no-break">
            <p className="text-[8px] text-gray-500 italic text-sharp">
              Method: Manual and Automated Urine Analyzer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}