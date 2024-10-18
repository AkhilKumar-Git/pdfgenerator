"use client";

import Image from "next/image";

interface ReportProps {
  name: string;
  age: number;
  gender: string;
  biomaterial: string;
  sampleCollectionDate: string;
  reportPreparationDate: string;
}

export function TraitHealthReportComponent({
  name,
  age,
  gender,
  biomaterial,
  sampleCollectionDate,
  reportPreparationDate,
}: ReportProps) {
  return (
    <div className="w-[210mm] max-h-[296mm] bg-white px-[48px] pt-[72px]">
      <Image
        src="/trait_logo.svg"
        alt="Trait Health Logo"
        width={200}
        height={60}
        className="mb-12"
      />

      <h1 className="text-sm font-bold mb-[15px]">Dear {name},</h1>

      <p className="text-xs mb-[48px]">
        The information on this report is for educational and informational use
        only. The information is not intended to be used by the customer for any
        diagnostic purpose and is not a substitute for professional medical
        advice. You should always seek the advice of your physician or other
        healthcare providers with any questions you may have regarding
        diagnosis, cure, treatment, mitigation, or prevention of any disease or
        other medical condition or impairment or the status of your health.
      </p>

      <hr className="my-12" />

      <h2 className="text-xl font-bold mb-6">About your raw data</h2>

      <div className="text-[11px] mb-[143px]">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between">
            <span
              className="text-gray-500"
              style={{ color: "var(--key-color)" }}
            >
              Name:
            </span>
            <span className="text-black">{name}</span>
          </div>
          <hr className="my-2" />

          <div className="flex justify-between">
            <span
              className="text-gray-600"
              style={{ color: "var(--key-color)" }}
            >
              Age:
            </span>
            <span className="text-black">{age}</span>
          </div>
          <hr className="my-2" />

          <div className="flex justify-between">
            <span
              className="text-gray-600"
              style={{ color: "var(--key-color)" }}
            >
              Gender:
            </span>
            <span className="text-black">{gender}</span>
          </div>
          <hr className="my-2" />

          <div className="flex justify-between">
            <span
              className="text-gray-600"
              style={{ color: "var(--key-color)" }}
            >
              Type of biomaterial:
            </span>
            <span className="text-black">{biomaterial}</span>
          </div>
          <hr className="my-2" />

          <div className="flex justify-between">
            <span
              className="text-gray-600"
              style={{ color: "var(--key-color)" }}
            >
              Sample Collection date:
            </span>
            <span className="text-black">{sampleCollectionDate}</span>
          </div>
          <hr className="my-2" />

          <div className="flex justify-between">
            <span
              className="text-gray-600"
              style={{ color: "var(--key-color)" }}
            >
              Report preparation date:
            </span>
            <span className="text-black">{reportPreparationDate}</span>
          </div>
          <hr className="my-2" />
        </div>
      </div>

      <div className="flex justify-between items-center text-[7px] text-gray-600">
        <p>SONAL CHANDRA | Thursday, August 15, 2024</p>
        <p className="font-bold">24/41</p>
      </div>
    </div>
  );
}
