"use client";

import { Card, CardContent } from "./ui/card";
import { PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { FileText } from "lucide-react";
import Image from "next/image";
import { curveCardinal } from "d3-shape";
import React, { FC } from "react";
const barData = [
  { name: "Gut & Microbiome", value: 90 },
  { name: "Metabolic fitness", value: 95 },
  { name: "Heart health", value: 98 },
  { name: "Detox & Organ fitness", value: 75 },
  { name: "Blood and Immunity", value: 80 },
];

const cardinal = curveCardinal.tension(0);

const pieData = [
  { name: "BACTEROIDETES", value: 70, color: "#10D3E4" },
  { name: "FIRMICUTES", value: 20, color: "#F8F58A" },
  { name: "PROTEOBACTERIA", value: 5, color: "#A480B1" },
  { name: "ACTINOBACTERIA", value: 3, color: "#16354B" },
  { name: "OTHERS", value: 2, color: "#E9AC9C" },
];

interface CustomizedDotProps {
  cx: number;
  cy: number;
}
const CustomizedDot: FC<CustomizedDotProps> = ({ cx, cy }) => {
  return (
    <image x={cx - 10} y={cy - 20} width={20} height={20} href="/person.svg" />
  );
};

const areaData = [
  { x: 0, y: 0 },
  { x: 1, y: 0.2 },
  { x: 2, y: 0.5 },
  { x: 3, y: 1 },
  { x: 4, y: 0.5 },
  { x: 5, y: 0.2 },
  { x: 6, y: 0 },
];

const HealthReportComponent = () => {
  return (
    <div className="w-[210mm] max-h-[297mm] bg-white px-[48px] pt-[72px]">
      <div className="max-w-[504px] mx-auto">
        {" "}
        {/* 600px - 48px*2 = 504px */}
        <h2 className="text-gray-500 mb-2 text-xs">Your health snapshot on</h2>
        <h1 className="text-xl font-bold mb-4">15 Aug 2024</h1>
        <Card className="mb-4 rounded-xl shadow-lg border-border1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="text-gray-400 w-4 h-4" />

              <div>
                <h3 className="font-semibold text-xs">
                  Overall Summary for Sonal Chandra
                </h3>

                <p className="text-[10px] text-gray-500">
                  Your overall assessment seems ok, but would need improvement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="my-4 text-[10px]">
          Following is your integrated health score, combining microbiome and
          blood analysis.
        </p>
        <Card className="mb-4 rounded-xl shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="w-1/3 pr-4">
                <div className="flex items-center">
                  <img src="/microbe_logo.png" className="mr-[2px]" />

                  <h3 className="font-semibold text-xs">Your evaluation:</h3>
                </div>

                <div className="relative mb-3">
                  <Image
                    src="/image.svg"
                    alt="Human silhouette"
                    width={50}
                    height={100}
                    className="w-full"
                  />
                </div>

                <div className="flex rounded-xl overflow-hidden text-score border-border2 border-[0.5px]">
                  <div className="flex-1 bg-score-f1 pl-2 pt-2 pb-1 border-r">
                    <div className="text-[5.52px]">BODY SCORE</div>

                    <div className="text-xl font-bold ">80</div>
                  </div>

                  <div className="flex-1 bg-score-f2 text-right pr-2 pt-2 pb-1">
                    <div className="text-[5.52px]">BIOME SCORE</div>

                    <div className="text-xl font-bold ">84</div>
                  </div>
                </div>
              </div>

              <div className="w-2/3 pl-3">
                <div className="text-right">
                  <span className="text-[8px] font-semibold text-gray-500">
                    IDEAL
                  </span>
                </div>

                <div className="space-y-1 mb-2">
                  {barData.map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="text-[9px] text-gray-600 mb-1">
                        {item.name}
                      </div>

                      <div className="w-full mb-2">
                        <div className="relative">
                          <div className="h-[4px] bg-gray-200 rounded-full">
                            <div
                              className="h-[4px] bg-cyan-400 rounded-full"
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>

                          <div className="absolute right-2 top-0 -mt-1 w-0.5 h-3 bg-black"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <h2 className="text-xs font-bold mb-2">Microbiome Analysis</h2>
        <Card className="mb-4 rounded-xl shadow-lg">
          <CardContent className="p-4">
            <div className="flex">
              <div className="flex-1 mr-6">
                <div className="flex justify-around">
                  <div>
                    <h3 className="text-center mb-1 text-[8px]">NORMAL</h3>

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
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                </div>
              </div>

              <div className="w-1/2 ml-6">
                <h4 className="text-[6px] text-gray-400 font-semibold mb-2">
                  BACTERIAL PHYLA KEY
                </h4>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 mr-2"
                        style={{ backgroundColor: item.color }}
                      />

                      <span className="text-[6px] text-gray-400">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <h2 className="text-[8px] font-bold mb-2">ASSESSMENT</h2>
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-4">
            <p className="mb-3 text-[10px]">
              You are in the top <span className="font-bold">50%</span> of the
              users for your Biome score.
            </p>

            <AreaChart width={450} height={100} data={areaData}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#73CCA4" stopOpacity={0.3} />

                  <stop offset="100%" stopColor="#73CCA4" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#35CC87" stopOpacity={0.3} />

                  <stop offset="100%" stopColor="#35CC87" stopOpacity={0} />
                </linearGradient>
              </defs>

              <Area
                type={cardinal}
                dataKey="y"
                stroke="#73CCA4"
                fillOpacity={1}
                fill="url(#colorUv)"
                isAnimationActive={false}
              />

              <Area
                type={cardinal}
                dataKey="y"
                stroke="#35CC87"
                fillOpacity={1}
                fill="url(#colorPv)"
                clipPath="url(#clip-path-score)"
                dot={<CustomizedDot cx={0} cy={0} />}
                isAnimationActive={false}
              />

              <defs>
                <clipPath id="clip-path-score">
                  <rect x="50%" y="0" width="50%" height="100%" />
                </clipPath>
              </defs>
            </AreaChart>

            <p className="text-[7px] text-gray-500 mt-2">
              Compared with the users of same age and gender
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthReportComponent;
